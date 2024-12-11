import { BarData } from './BarData.js';
import { DateFormatter } from './DateFormatter.js'; 

export class TimeScale {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: { ChunkStart: number, Bars: BarData[] }[];
    private dateFormatter: DateFormatter;
    private barWidth: number;
    private zoomLevel: number;
    private offset: number;

    constructor(canvas: HTMLCanvasElement, data: { ChunkStart: number, Bars: BarData[] }[], barWidth: number, zoomLevel: number, offset: number) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.data = data;
        this.dateFormatter = new DateFormatter('en-GB');
        this.barWidth = barWidth;
        this.zoomLevel = zoomLevel;
        this.offset = offset;
    }

    public draw() {
        const visibleBars = Math.floor(this.canvas.width / (this.barWidth * this.zoomLevel));
        const startIdx = Math.floor(this.offset / this.barWidth);
        const bars = this.getVisibleBars(startIdx, visibleBars);

        const step = Math.max(1, Math.floor(bars.length / 10));

        bars.forEach((bar, index) => {
            if (index % step === 0) {
                const x = index * this.barWidth * this.zoomLevel;
                const time = this.data[0].ChunkStart + bar.Time;
                const formattedDate = this.dateFormatter.format(time);

                this.context.font = '14px Arial';
                this.context.fillStyle = 'black';
                this.context.fillText(formattedDate, x, this.canvas.height - 10);
            }
        });
    }

    private getVisibleBars(startIdx: number, visibleBars: number) {
        let bars: BarData[] = [];
        let idx = startIdx;
        this.data.forEach(chunk => {
            bars = bars.concat(chunk.Bars.slice(idx, idx + visibleBars));
            if (bars.length >= visibleBars) return;
        });
        return bars.slice(0, visibleBars);
    }
}
