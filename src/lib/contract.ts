import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract ABI for Crypto Showdown Ace
export const contractABI = [
  {
    "inputs": [
      {"name": "gameId", "type": "uint256"},
      {"name": "encryptedHand", "type": "bytes"},
      {"name": "betAmount", "type": "uint256"}
    ],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "gameId", "type": "uint256"},
      {"name": "encryptedAction", "type": "bytes"}
    ],
    "name": "makeMove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "gameId", "type": "uint256"}
    ],
    "name": "fold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "gameId", "type": "uint256"},
      {"name": "encryptedReveal", "type": "bytes"}
    ],
    "name": "revealHand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "gameId", "type": "uint256"}
    ],
    "name": "getGameState",
    "outputs": [
      {"name": "players", "type": "address[]"},
      {"name": "pot", "type": "uint256"},
      {"name": "currentPlayer", "type": "uint256"},
      {"name": "gamePhase", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990'),
});

export const createWalletClientFromPrivateKey = (privateKey: `0x${string}`) => {
  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990'),
  });
};
