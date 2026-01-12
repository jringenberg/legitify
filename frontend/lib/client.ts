import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { BASE_SEPOLIA_RPC } from './contracts';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA_RPC),
});

