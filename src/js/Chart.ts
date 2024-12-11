import { BarData } from './DataLoader.js';

export class Chart {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private data: BarData[];
    private barWidth: number = 5;
    private offset: number = 0;
    private zoomLevel: number = 1;
    private priceRange: number;
    private minPrice: number;
    private maxPrice: number;
    private isDragging: boolean = false;
    private lastMouseX: number = 0;

    constructor(canvas: HTMLCanvasElement, data: BarData[]) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.data = data;

        this.minPrice = Math.min(...data.map(d => d.low));
        this.maxPrice = Math.max(...data.map(d => d.high));
        this.priceRange = this.maxPrice - this.minPrice;

        this.initEventHandlers();
        this.render();
    }

    private initEventHandlers() {
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (event.shiftKey) {
                this.handleZoom(event);
            } else {
                this.handleScroll(event);
            }
        });

        this.canvas.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
    }

    private handleMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.lastMouseX = event.clientX;
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.lastMouseX;
            this.offset += deltaX;
            this.offset = Math.max(0, this.offset); 
            this.lastMouseX = event.clientX;
            this.render();
        }
    }

    private handleMouseUp() {
        this.isDragging = false;
    }

    private handleScroll(event: WheelEvent) {
        this.offset += event.deltaY > 0 ? 20 : -20;
        this.offset = Math.max(0, this.offset); 
        this.render();
    }

    private handleZoom(event: WheelEvent) {
        this.zoomLevel += event.deltaY > 0 ? -0.1 : 0.1;
        this.zoomLevel = Math.max(0.5, Math.min(2, this.zoomLevel)); 
        this.render();
    }

    private render() {
        this.clearCanvas();
        this.drawBars();
    }

    private clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawBars() {
        // Calculate the visible bars based on zoom level
        const visibleBars = Math.floor(this.canvas.width / (this.barWidth * this.zoomLevel));
        const startIdx = Math.floor(this.offset / this.barWidth);
        const bars = this.data.slice(startIdx, startIdx + visibleBars);

        // Scale factor for prices (to fit within the canvas height)
        const priceScale = (this.canvas.height - 50) / this.priceRange;

        bars.forEach((bar, index) => {
            const x = index * this.barWidth * this.zoomLevel;
            const openY = this.canvas.height - 50 - (bar.open - this.minPrice) * priceScale;
            const closeY = this.canvas.height - 50 - (bar.close - this.minPrice) * priceScale;
            const highY = this.canvas.height - 50 - (bar.high - this.minPrice) * priceScale;
            const lowY = this.canvas.height - 50 - (bar.low - this.minPrice) * priceScale;

            this.context.strokeStyle = bar.close > bar.open ? 'green' : 'red';
            this.context.beginPath();
            this.context.moveTo(x + this.barWidth * this.zoomLevel / 2, highY);
            this.context.lineTo(x + this.barWidth * this.zoomLevel / 2, lowY);
            this.context.stroke();

            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);

            this.context.fillStyle = bar.close > bar.open ? 'green' : 'red';
            this.context.fillRect(
                x,
                bodyTop,
                this.barWidth * this.zoomLevel,
                bodyBottom - bodyTop
            );
        });
    }
}
