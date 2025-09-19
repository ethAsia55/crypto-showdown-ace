// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@fhevm/abstracts/Reencrypt.sol";
import "@fhevm/abstracts/FHE.sol";

/**
 * @title CryptoShowdownAce
 * @dev A secure poker platform using FHE encryption for private gaming
 * @author Zama Team
 */
contract CryptoShowdownAce is Reencrypt {
    using FHE for euint32;
    using FHE for euint8;
    using FHE for ebool;

    // Game phases
    enum GamePhase {
        Waiting,
        Playing,
        Revealing,
        Finished
    }

    // Player action types
    enum Action {
        Fold,
        Call,
        Raise
    }

    // Game structure
    struct Game {
        address[] players;
        euint32[] encryptedHands;
        euint32 pot;
        uint8 currentPlayer;
        GamePhase phase;
        uint256 betAmount;
        uint256 maxBet;
        mapping(address => bool) hasFolded;
        mapping(address => uint256) playerBets;
    }

    // Events
    event GameCreated(uint256 indexed gameId, address indexed creator);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event PlayerAction(uint256 indexed gameId, address indexed player, Action action, uint256 amount);
    event HandRevealed(uint256 indexed gameId, address indexed player, uint8[] cards);
    event GameFinished(uint256 indexed gameId, address indexed winner, uint256 amount);

    // State variables
    mapping(uint256 => Game) public games;
    uint256 public nextGameId;
    address public owner;
    uint256 public houseFee; // Fee percentage (in basis points)

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier gameExists(uint256 gameId) {
        require(gameId < nextGameId, "Game does not exist");
        _;
    }

    modifier validPlayer(uint256 gameId, address player) {
        Game storage game = games[gameId];
        bool isPlayer = false;
        for (uint i = 0; i < game.players.length; i++) {
            if (game.players[i] == player) {
                isPlayer = true;
                break;
            }
        }
        require(isPlayer, "Not a valid player");
        _;
    }

    constructor() {
        owner = msg.sender;
        houseFee = 250; // 2.5% house fee
    }

    /**
     * @dev Create a new poker game
     * @param maxPlayers Maximum number of players allowed
     * @param minBet Minimum bet amount
     * @param maxBet Maximum bet amount
     */
    function createGame(
        uint8 maxPlayers,
        uint256 minBet,
        uint256 maxBet
    ) external payable returns (uint256) {
        require(maxPlayers >= 2 && maxPlayers <= 8, "Invalid player count");
        require(minBet > 0 && maxBet >= minBet, "Invalid bet amounts");
        require(msg.value >= minBet, "Insufficient initial bet");

        uint256 gameId = nextGameId++;
        Game storage game = games[gameId];
        
        game.players.push(msg.sender);
        game.pot = FHE.asEuint32(uint32(msg.value));
        game.betAmount = minBet;
        game.maxBet = maxBet;
        game.phase = GamePhase.Waiting;
        game.currentPlayer = 0;
        game.playerBets[msg.sender] = msg.value;

        emit GameCreated(gameId, msg.sender);
        return gameId;
    }

    /**
     * @dev Join an existing game with encrypted hand
     * @param gameId ID of the game to join
     * @param encryptedHand Encrypted hand data
     */
    function joinGame(
        uint256 gameId,
        euint32 encryptedHand
    ) external payable gameExists(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Waiting, "Game not in waiting phase");
        require(game.players.length < 8, "Game is full");
        require(msg.value >= game.betAmount, "Insufficient bet amount");

        game.players.push(msg.sender);
        game.encryptedHands.push(encryptedHand);
        game.pot = game.pot + FHE.asEuint32(uint32(msg.value));
        game.playerBets[msg.sender] = msg.value;

        emit PlayerJoined(gameId, msg.sender);

        // Start game if we have enough players
        if (game.players.length >= 2) {
            game.phase = GamePhase.Playing;
        }
    }

    /**
     * @dev Make a move in the game (call, raise, or fold)
     * @param gameId ID of the game
     * @param action Action to take
     * @param encryptedAction Encrypted action data
     */
    function makeMove(
        uint256 gameId,
        Action action,
        euint32 encryptedAction
    ) external payable gameExists(gameId) validPlayer(gameId, msg.sender) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Playing, "Game not in playing phase");
        require(game.players[game.currentPlayer] == msg.sender, "Not your turn");
        require(!game.hasFolded[msg.sender], "Player has already folded");

        if (action == Action.Fold) {
            game.hasFolded[msg.sender] = true;
            emit PlayerAction(gameId, msg.sender, action, 0);
        } else if (action == Action.Call) {
            require(msg.value >= game.betAmount, "Insufficient call amount");
            game.pot = game.pot + FHE.asEuint32(uint32(msg.value));
            game.playerBets[msg.sender] += msg.value;
            emit PlayerAction(gameId, msg.sender, action, msg.value);
        } else if (action == Action.Raise) {
            require(msg.value > game.betAmount, "Raise amount must be higher than current bet");
            require(msg.value <= game.maxBet, "Raise amount exceeds maximum bet");
            game.pot = game.pot + FHE.asEuint32(uint32(msg.value));
            game.betAmount = msg.value;
            game.playerBets[msg.sender] += msg.value;
            emit PlayerAction(gameId, msg.sender, action, msg.value);
        }

        // Move to next player
        game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    }

    /**
     * @dev Reveal hand at the end of the game
     * @param gameId ID of the game
     * @param encryptedReveal Encrypted reveal data
     */
    function revealHand(
        uint256 gameId,
        euint32 encryptedReveal
    ) external gameExists(gameId) validPlayer(gameId, msg.sender) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Playing, "Game not in playing phase");

        // Decrypt and verify the hand
        uint32[] memory decryptedHand = FHE.decrypt(encryptedReveal);
        
        // Validate hand (simplified - in real implementation, validate poker hand)
        require(decryptedHand.length == 5, "Invalid hand size");
        
        emit HandRevealed(gameId, msg.sender, decryptedHand);
    }

    /**
     * @dev Get game state (public view)
     * @param gameId ID of the game
     */
    function getGameState(uint256 gameId) external view gameExists(gameId) returns (
        address[] memory players,
        uint256 pot,
        uint8 currentPlayer,
        GamePhase phase
    ) {
        Game storage game = games[gameId];
        return (
            game.players,
            uint256(FHE.decrypt(game.pot)),
            game.currentPlayer,
            game.phase
        );
    }

    /**
     * @dev Get encrypted hand for a player
     * @param gameId ID of the game
     * @param playerIndex Index of the player
     */
    function getEncryptedHand(uint256 gameId, uint8 playerIndex) external view gameExists(gameId) returns (euint32) {
        Game storage game = games[gameId];
        require(playerIndex < game.encryptedHands.length, "Invalid player index");
        return game.encryptedHands[playerIndex];
    }

    /**
     * @dev Finish game and distribute winnings
     * @param gameId ID of the game
     * @param winnerIndex Index of the winning player
     */
    function finishGame(uint256 gameId, uint8 winnerIndex) external gameExists(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Playing, "Game not in playing phase");
        require(winnerIndex < game.players.length, "Invalid winner index");

        address winner = game.players[winnerIndex];
        uint256 totalPot = uint256(FHE.decrypt(game.pot));
        uint256 houseCut = (totalPot * houseFee) / 10000;
        uint256 winnerAmount = totalPot - houseCut;

        game.phase = GamePhase.Finished;
        
        // Transfer winnings
        payable(winner).transfer(winnerAmount);
        
        emit GameFinished(gameId, winner, winnerAmount);
    }

    /**
     * @dev Withdraw house fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    /**
     * @dev Update house fee (owner only)
     * @param newFee New fee percentage in basis points
     */
    function setHouseFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        houseFee = newFee;
    }

    /**
     * @dev Emergency function to recover stuck funds
     * @param gameId ID of the game
     */
    function emergencyWithdraw(uint256 gameId) external onlyOwner gameExists(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Finished, "Game not finished");
        
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner).transfer(balance);
        }
    }
}
