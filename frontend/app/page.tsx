'use client';

import { useEffect, useState } from 'react';
import { decodeAbiParameters } from 'viem';
import { publicClient } from '@/lib/client';
import { CONTRACTS, EAS_ABI, BELIEF_STAKE_ABI, GENESIS_BELIEF_UID } from '@/lib/contracts';

export default function Home() {
  const [belief, setBelief] = useState<string>('');
  const [stakerCount, setStakerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBelief() {
      try {
        // Fetch attestation from EAS
        const attestation = await publicClient.readContract({
          address: CONTRACTS.EAS_REGISTRY,
          abi: EAS_ABI,
          functionName: 'getAttestation',
          args: [GENESIS_BELIEF_UID as `0x${string}`],
        });

        // Decode the belief text from attestation.data
        // Schema is: string belief
        const decoded = decodeAbiParameters(
          [{ name: 'belief', type: 'string' }],
          attestation.data as `0x${string}`
        );
        setBelief(decoded[0]);

        // Fetch staker count from BeliefStake
        const count = await publicClient.readContract({
          address: CONTRACTS.BELIEF_STAKE,
          abi: BELIEF_STAKE_ABI,
          functionName: 'getStakerCount',
          args: [GENESIS_BELIEF_UID as `0x${string}`],
        });
        setStakerCount(Number(count));
      } catch (error) {
        console.error('Error fetching belief:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBelief();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading belief...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">OnRecord</h1>

        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <p className="text-xl">{belief}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">{stakerCount}</span>
            <span>{stakerCount === 1 ? 'person' : 'people'} staked $2</span>
          </div>
        </div>
      </div>
    </main>
  );
}
