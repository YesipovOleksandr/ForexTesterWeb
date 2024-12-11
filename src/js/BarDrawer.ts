import { BarData } from './BarData.js';

export class BarDrawer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private priceRange: number;
    private minPrice: number;
    private barWidth: number;
    private zoomLevel: number;

    constructor(canvas: HTMLCanvasElement, priceRange: number, minPrice: number, barWidth: number, zoomLevel: number) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.priceRange = priceRange;
        this.minPrice = minPrice;
        this.barWidth = barWidth;
        this.zoomLevel = zoomLevel;
    }

    public draw(bars: BarData[]) {
        const priceScale = (this.canvas.height - 50) / this.priceRange;

        bars.forEach((bar, index) => {
            const x = index * this.barWidth * this.zoomLevel;
            const openY = this.canvas.height - 50 - (bar.Open - this.minPrice) * priceScale;
            const closeY = this.canvas.height - 50 - (bar.Close - this.minPrice) * priceScale;
            const highY = this.canvas.height - 50 - (bar.High - this.minPrice) * priceScale;
            const lowY = this.canvas.height - 50 - (bar.Low - this.minPrice) * priceScale;

            this.context.strokeStyle = bar.Close > bar.Open ? 'green' : 'red';
            this.context.beginPath();
            this.context.moveTo(x + this.barWidth * this.zoomLevel / 2, highY);
            this.context.lineTo(x + this.barWidth * this.zoomLevel / 2, lowY);
            this.context.stroke();

            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);

            this.context.fillStyle = bar.Close > bar.Open ? 'green' : 'red';
            this.context.fillRect(x, bodyTop, this.barWidth * this.zoomLevel, bodyBottom - bodyTop);
        });
    }
}
