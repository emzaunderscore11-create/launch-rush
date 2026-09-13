import type { NextApiRequest, NextApiResponse } from 'next';
import { TokenLaunchConfig } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config: TokenLaunchConfig = req.body;

    // Validate request
    if (!config.metadata || !config.totalSupply || !config.creatorAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production:
    // 1. Validate the token configuration
    // 2. Store in database
    // 3. Return token details
    // 4. Client then performs blockchain transaction

    return res.status(200).json({
      status: 'created',
      tokenAddress: 'mock_address',
      message: 'Token launch request created. Sign transaction in wallet.',
    });
  } catch (error) {
    console.error('Error launching token:', error);
    return res.status(500).json({ error: 'Failed to launch token' });
  }
}
