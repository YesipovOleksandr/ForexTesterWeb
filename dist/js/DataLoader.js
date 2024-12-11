export class DataLoader {
    static async fetchBars(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error("Expected an array in the API response.");
        }
        return data.flatMap((chunk) => {
            const chunkStart = chunk.ChunkStart;
            if (!chunkStart || !chunk.Bars) {
                throw new Error("Invalid chunk format.");
            }
            return chunk.Bars.map((bar) => ({
                time: chunkStart + bar.Time,
                open: bar.Open,
                high: bar.High,
                low: bar.Low,
                close: bar.Close,
                volume: bar.TickVolume,
            }));
        });
    }
}
//# sourceMappingURL=DataLoader.js.map