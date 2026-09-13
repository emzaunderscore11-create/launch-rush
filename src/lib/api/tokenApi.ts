import axios from 'axios';
import { DiscoveryToken, SortOption } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface FetchTokensParams {
  sort?: SortOption;
  limit?: number;
  offset?: number;
  chain?: string;
}

export const tokenApi = {
  // Fetch newly launched tokens
  async getNewTokens(params: FetchTokensParams = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tokens/new`, {
        params: {
          sort: params.sort || 'newest',
          limit: params.limit || 20,
          offset: params.offset || 0,
          chain: params.chain,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new tokens:', error);
      throw error;
    }
  },

  // Fetch trending tokens
  async getTrendingTokens(params: FetchTokensParams = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tokens/trending`, {
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
          chain: params.chain,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  },

  // Get single token details
  async getToken(tokenAddress: string, chain: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tokens/${chain}/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token details:', error);
      throw error;
    }
  },

  // Get token stats
  async getTokenStats(tokenAddress: string, chain: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tokens/${chain}/${tokenAddress}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token stats:', error);
      throw error;
    }
  },

  // Get token transactions
  async getTokenTransactions(tokenAddress: string, chain: string, limit = 50) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tokens/${chain}/${tokenAddress}/transactions`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      throw error;
    }
  },

  // Get holders
  async getTokenHolders(tokenAddress: string, chain: string, limit = 20) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/tokens/${chain}/${tokenAddress}/holders`,
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching token holders:', error);
      throw error;
    }
  },

  // Launch new token
  async launchToken(tokenConfig: any) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tokens/launch`, tokenConfig);
      return response.data;
    } catch (error) {
      console.error('Error launching token:', error);
      throw error;
    }
  },

  // Search tokens
  async searchTokens(query: string, chain?: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tokens/search`, {
        params: { q: query, chain },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  },
};
