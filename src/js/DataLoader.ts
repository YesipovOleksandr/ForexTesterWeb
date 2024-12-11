import { BarData } from './BarData.js';

export class DataLoader {
  static async fetchBars(url: string): Promise<{ ChunkStart: number, Bars: BarData[] }[]> {
      try {
          const response = await fetch(url);
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error loading data:', error);
          throw error;
      }
  }
}
