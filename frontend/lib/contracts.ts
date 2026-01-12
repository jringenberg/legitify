export const CONTRACTS = {
  EAS_REGISTRY: '0x4200000000000000000000000000000000000021',
  BELIEF_SCHEMA_UID:
    '0x21f7fcf4af0c022d3e7316b6a5b9a04dcaedac59eaea803251e653abd1db9fd6',
  MOCK_USDC: '0xA5c82FCFBe1274166D01B1f3cd9f69Eb79bd74E8',
  BELIEF_STAKE: '0xa37c9A89375134374a866EeD3E57EAF2789d9613',
} as const;

export const BASE_SEPOLIA_RPC = 'https://sepolia.base.org';

// Minimal EAS ABI - just getAttestation
export const EAS_ABI = [
  {
    inputs: [{ name: 'uid', type: 'bytes32' }],
    name: 'getAttestation',
    outputs: [
      {
        components: [
          { name: 'uid', type: 'bytes32' },
          { name: 'schema', type: 'bytes32' },
          { name: 'time', type: 'uint64' },
          { name: 'expirationTime', type: 'uint64' },
          { name: 'revocationTime', type: 'uint64' },
          { name: 'refUID', type: 'bytes32' },
          { name: 'recipient', type: 'address' },
          { name: 'attester', type: 'address' },
          { name: 'revocable', type: 'bool' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'attestation',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// BeliefStake ABI - just getStakerCount
export const BELIEF_STAKE_ABI = [
  {
    inputs: [{ name: 'attestationUID', type: 'bytes32' }],
    name: 'getStakerCount',
    outputs: [{ name: 'count', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Genesis belief for testing
export const GENESIS_BELIEF_UID =
  '0x52314b57ebbe83ebe00c02aa3a74df3cf1a55acd682318f7d88777945aa5c1dd';

