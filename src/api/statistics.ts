import client from './client';
import { ApiResponse, Stats } from '../types';

export const statsApi = {
  get: () => client.get<ApiResponse<Stats>>('/statistics'),
};
