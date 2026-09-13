import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, chain } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    // In production, search database or indexer
    return res.status(200).json({
      results: [],
      message: 'No tokens found',
    });
  } catch (error) {
    console.error('Error searching tokens:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
