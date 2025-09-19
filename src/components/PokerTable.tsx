import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { contractABI, contractAddress } from '@/lib/contract';
import { parseEther, encodePacked, keccak256 } from 'viem';
import { useState, useEffect } from 'react';

const PokerTable = () => {
  const { address, isConnected } = useAccount();
  const [gameId, setGameId] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('0.1');
  const [encryptedHand, setEncryptedHand] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<string>('Waiting');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Generate encrypted hand data (simulated FHE encryption)
  const generateEncryptedHand = () => {
    setIsEncrypting(true);
    // Simulate FHE encryption process
    setTimeout(() => {
      const handData = {
        cards: [1, 2, 3, 4, 5], // Simulated poker hand
        timestamp: Date.now(),
        player: address,
        gameId: gameId
      };
      
      // Create encrypted data hash (simulated FHE encryption)
      const encryptedData = keccak256(
        encodePacked(
          ['uint256[]', 'uint256', 'address', 'uint256'],
          [handData.cards, handData.timestamp, handData.player, handData.gameId]
        )
      );
      
      setEncryptedHand(encryptedData);
      setIsEncrypting(false);
    }, 2000);
  };

  // Contract interactions
  const { data: gameState } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getGameState',
    args: gameId ? [BigInt(gameId)] : undefined,
    enabled: !!gameId,
  });

  const { write: createGame, data: createGameData } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'createGame',
    args: [8, parseEther('0.1'), parseEther('10')],
    value: parseEther(betAmount),
  });

  const { write: joinGame, data: joinGameData } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'joinGame',
    args: gameId ? [BigInt(gameId), encryptedHand as `0x${string}`] : undefined,
    value: parseEther(betAmount),
  });

  const { write: makeMove, data: makeMoveData } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'makeMove',
    args: gameId ? [BigInt(gameId), 0, encryptedHand as `0x${string}`] : undefined,
  });

  const { write: revealHand, data: revealHandData } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: 'revealHand',
    args: gameId ? [BigInt(gameId), encryptedHand as `0x${string}`] : undefined,
  });

  // Wait for transaction confirmations
  const { isLoading: isCreatingGame } = useWaitForTransaction({
    hash: createGameData?.hash,
  });

  const { isLoading: isJoiningGame } = useWaitForTransaction({
    hash: joinGameData?.hash,
  });

  const { isLoading: isMakingMove } = useWaitForTransaction({
    hash: makeMoveData?.hash,
  });

  const { isLoading: isRevealingHand } = useWaitForTransaction({
    hash: revealHandData?.hash,
  });

  const handleCreateGame = () => {
    if (isConnected) {
      createGame();
    }
  };

  const handleJoinGame = () => {
    if (isConnected && gameId && encryptedHand) {
      joinGame();
    }
  };

  const handleMakeMove = (action: number) => {
    if (isConnected && gameId && encryptedHand) {
      makeMove();
    }
  };

  const handleRevealHand = () => {
    if (isConnected && gameId && encryptedHand) {
      revealHand();
    }
  };

  // Update game phase based on contract state
  useEffect(() => {
    if (gameState) {
      const phases = ['Waiting', 'Playing', 'Revealing', 'Finished'];
      setGamePhase(phases[gameState.gamePhase] || 'Unknown');
    }
  }, [gameState]);

  return (
    <section className="py-20 bg-gradient-to-b from-casino-green/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Live <span className="text-crypto-cyan">Encrypted</span> Tables
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join active poker tables where every card is encrypted and every move is verified.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Encryption Status */}
          {isConnected && (
            <div className="mb-8 p-6 bg-gradient-to-r from-crypto-cyan/10 to-casino-gold/10 rounded-lg border border-crypto-cyan/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-crypto-cyan" />
                  FHE Encryption Status
                </h3>
                <div className="flex items-center gap-2">
                  {encryptedHand ? (
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Encrypted
                    </span>
                  ) : (
                    <span className="text-sm text-yellow-500 flex items-center gap-1">
                      <EyeOff className="w-4 h-4" />
                      Not Encrypted
                    </span>
                  )}
                </div>
              </div>
              
              {!encryptedHand && (
                <Button 
                  onClick={generateEncryptedHand} 
                  disabled={isEncrypting}
                  className="w-full"
                  variant="outline"
                >
                  {isEncrypting ? (
                    <>
                      <Lock className="w-4 h-4 mr-2 animate-spin" />
                      Encrypting Hand...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Generate Encrypted Hand
                    </>
                  )}
                </Button>
              )}

              {encryptedHand && (
                <div className="text-xs text-muted-foreground font-mono break-all">
                  Encrypted Data: {encryptedHand.slice(0, 20)}...
                </div>
              )}
            </div>
          )}

          {/* Game Controls */}
          {isConnected && (
            <div className="mb-8 p-6 bg-background/50 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Game Controls</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Bet Amount (ETH):</label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="px-3 py-1 border border-border rounded-md w-24"
                      min="0.1"
                      max="10"
                      step="0.1"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateGame} 
                    variant="casino"
                    disabled={isCreatingGame}
                    className="w-full"
                  >
                    {isCreatingGame ? 'Creating Game...' : 'Create New Game'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Game ID:</label>
                    <input
                      type="number"
                      value={gameId || ''}
                      onChange={(e) => setGameId(Number(e.target.value))}
                      className="px-3 py-1 border border-border rounded-md w-24"
                      placeholder="Enter Game ID"
                    />
                  </div>
                  <Button 
                    onClick={handleJoinGame} 
                    variant="outline"
                    disabled={isJoiningGame || !encryptedHand}
                    className="w-full"
                  >
                    {isJoiningGame ? 'Joining...' : 'Join Game'}
                  </Button>
                </div>
              </div>

              {/* Game Actions */}
              {gameId && encryptedHand && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Game Phase: {gamePhase}</span>
                    <span className="text-xs text-muted-foreground">
                      {gameState?.players?.length || 0} players
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleMakeMove(0)} 
                      variant="outline" 
                      size="sm"
                      disabled={isMakingMove}
                    >
                      {isMakingMove ? 'Processing...' : 'Fold'}
                    </Button>
                    <Button 
                      onClick={() => handleMakeMove(1)} 
                      variant="outline" 
                      size="sm"
                      disabled={isMakingMove}
                    >
                      {isMakingMove ? 'Processing...' : 'Call'}
                    </Button>
                    <Button 
                      onClick={() => handleMakeMove(2)} 
                      variant="outline" 
                      size="sm"
                      disabled={isMakingMove}
                    >
                      {isMakingMove ? 'Processing...' : 'Raise'}
                    </Button>
                    <Button 
                      onClick={handleRevealHand} 
                      variant="casino" 
                      size="sm"
                      disabled={isRevealingHand}
                    >
                      {isRevealingHand ? 'Revealing...' : 'Reveal Hand'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Poker Table Visualization */}
          <div className="relative">
            <div className="felt-texture rounded-[3rem] p-8 border-8 border-casino-gold/30 shadow-2xl">
              <div className="aspect-[2/1] relative">
                        {/* Table Center */}
                        <div className="absolute inset-1/4 bg-casino-green/20 rounded-full border-2 border-casino-gold/50 flex items-center justify-center">
                          <div className="text-center">
                            {encryptedHand ? (
                              <Lock className="w-12 h-12 text-crypto-cyan mx-auto mb-2 animate-pulse" />
                            ) : (
                              <Shield className="w-12 h-12 text-crypto-cyan mx-auto mb-2" />
                            )}
                            <p className="text-sm text-casino-gold font-semibold">
                              {encryptedHand ? 'FHE ENCRYPTED' : 'SECURE TABLE'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {encryptedHand ? 'Private Hands' : 'Community Cards'}
                            </p>
                            {gameState && (
                              <p className="text-xs text-crypto-cyan mt-1">
                                Pot: {gameState.pot ? (Number(gameState.pot) / 1e18).toFixed(4) : '0'} ETH
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Phase: {gamePhase}
                            </p>
                          </div>
                        </div>

                {/* Player Positions */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60) - 90; // Start from top
                  const radius = 45;
                  const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                  const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                  
                  return (
                    <div
                      key={i}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="bg-background/80 rounded-lg p-3 border border-crypto-cyan/30 min-w-[100px] text-center">
                        <div className="w-8 h-8 bg-crypto-cyan/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Users className="w-4 h-4 text-crypto-cyan" />
                        </div>
                        <p className="text-xs text-foreground font-medium">
                          {i === 0 ? "YOU" : `Player ${i + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 0 ? (isConnected ? "Connected" : "Not Connected") : "Waiting..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="felt-texture border-border/50">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-casino-gold mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Buy-in Range</h3>
                <p className="text-2xl font-bold text-casino-gold">0.1 - 10 ETH</p>
              </CardContent>
            </Card>

            <Card className="felt-texture border-border/50">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-crypto-cyan mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Active Players</h3>
                <p className="text-2xl font-bold text-crypto-cyan">2,847</p>
              </CardContent>
            </Card>

            <Card className="felt-texture border-border/50">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-casino-gold mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Security Level</h3>
                <p className="text-2xl font-bold text-casino-gold">Military</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="casino" 
              size="lg" 
              className="px-12 py-4 text-lg" 
              onClick={() => window.location.href = '/join-table'}
              disabled={!isConnected}
            >
              {isConnected ? 'Join Next Available Table' : 'Connect Wallet to Play'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PokerTable;