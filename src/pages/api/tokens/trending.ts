import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 20, offset = 0, chain } = req.query;

    // In production, calculate trending score from real data
    // Formula: (volume_24h * 0.4) + (unique_traders * 0.3) + (liquidity * 0.2) + (holder_growth * 0.1)

    return res.status(200).json({
      tokens: [],
      hasMore: false,
    });
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return res.status(500).json({ error: 'Failed to fetch trending tokens' });
  }
}
