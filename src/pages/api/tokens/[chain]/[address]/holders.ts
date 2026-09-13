import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 20 } = req.query;

    // In production, query top holders from blockchain/indexer
    return res.status(200).json({
      holders: [],
    });
  } catch (error) {
    console.error('Error fetching holders:', error);
    return res.status(500).json({ error: 'Failed to fetch holders' });
  }
}
