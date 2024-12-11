import { DataLoader } from './DataLoader.js';
import { Chart } from './Chart.js';

const canvas = document.getElementById('chart') as HTMLCanvasElement;
const container = document.getElementById('chart-container') as HTMLElement;
const loading = document.getElementById('loading') as HTMLElement;

function resizeCanvas() {
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dataUrl = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false';

async function initChart() {
    loading.classList.remove('hidden');
    try {
        const data = await DataLoader.fetchBars(dataUrl);
        new Chart(canvas, data);
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        loading.classList.add('hidden');
    }
}

initChart();
