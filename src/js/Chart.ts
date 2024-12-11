import { BarData } from './BarData.js';
import { TimeScale } from './TimeScale.js';
import { BarDrawer } from './BarDrawer.js';
import { PriceScale } from './PriceScale.js';

export class Chart {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: { ChunkStart: number, Bars: BarData[] }[];
    private barWidth: number = 5;
    private offset: number = 0;
    private zoomLevel: number = 1;
    private priceRange: number;
    private minPrice: number;
    private maxPrice: number;
    private timeRange: number;
    private priceScale: PriceScale;
    private timeScale: TimeScale;
    private barDrawer: BarDrawer;

    private isDragging: boolean = false;
    private startDragX: number = 0;
    private startDragOffset: number = 0;

    constructor(canvas: HTMLCanvasElement, data: { ChunkStart: number, Bars: BarData[] }[]) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.data = data;

        this.minPrice = Math.min(...this.data.flatMap(chunk => chunk.Bars.map(d => d.Low)));
        this.maxPrice = Math.max(...this.data.flatMap(chunk => chunk.Bars.map(d => d.High)));
        this.priceRange = this.maxPrice - this.minPrice;

        this.timeRange = this.data[this.data.length - 1].ChunkStart - this.data[0].ChunkStart;

        this.priceScale = new PriceScale(this.canvas, this.priceRange, this.minPrice);
        this.timeScale = new TimeScale(this.canvas, this.data, this.barWidth, this.zoomLevel, this.offset);
        this.barDrawer = new BarDrawer(this.canvas, this.priceRange, this.minPrice, this.barWidth, this.zoomLevel);

        this.initEventHandlers();
        this.render();
    }

    private initEventHandlers() {
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.handleScroll(event);  
        });


        this.canvas.addEventListener('mousedown', (event) => {
            if (event.button === 0) {  
                this.isDragging = true;
                this.startDragX = event.clientX;
                this.startDragOffset = this.offset;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mousemove', (event) => {
            if (this.isDragging) {
                const deltaX = event.clientX - this.startDragX;
                this.offset = this.startDragOffset + deltaX;
                this.offset = Math.max(0, this.offset); 
                this.render();
            }
        });
    }

    private handleScroll(event: WheelEvent) {
        const scrollDirection = event.deltaY > 0 ? 1 : -1;
        this.offset += scrollDirection * 20;
        this.offset = Math.max(0, this.offset);
        this.render();
    }

    private render() {
        this.clearCanvas();
        this.barDrawer.draw(this.getVisibleBars());
        this.priceScale.draw();
        this.timeScale.draw();
    }

    private clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private getVisibleBars() {
        const visibleBars = Math.floor(this.canvas.width / (this.barWidth * this.zoomLevel));
        const startIdx = Math.floor(this.offset / this.barWidth);
        let bars: BarData[] = [];
        let idx = startIdx;
        this.data.forEach(chunk => {
            bars = bars.concat(chunk.Bars.slice(idx, idx + visibleBars));
            if (bars.length >= visibleBars) return;
        });
        return bars.slice(0, visibleBars);
    }
}
