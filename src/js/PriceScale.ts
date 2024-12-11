export class PriceScale {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private priceRange: number;
    private minPrice: number;

    constructor(canvas: HTMLCanvasElement, priceRange: number, minPrice: number) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.priceRange = priceRange;
        this.minPrice = minPrice;
    }

    public draw() {
        const priceScaleStep = this.priceRange / 5;
        for (let i = 0; i <= 5; i++) {
            const price = this.minPrice + i * priceScaleStep;
            const y = this.canvas.height - 50 - (price - this.minPrice) * ((this.canvas.height - 50) / this.priceRange);
            this.context.fillText(price.toFixed(5), 0, y);
        }
    }
}
