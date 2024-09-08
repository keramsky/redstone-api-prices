import {
    updatePricesId1,
    updatePricesId2,
    myChart,
    deleteChart,

    updateChart
} from './update-prices.js'

const chartContainer = document.querySelector('.chart-container');

// let isOn = false;

document.addEventListener('DOMContentLoaded', () => {
    const tokenInput = document.querySelector('.token-input');

    tokenInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputTokenSymbol = tokenInput.value;
            
            showChartWindow(inputTokenSymbol);


        }
    });
});

async function showChartWindow(tokenSymbol){
    const newChart = document.createElement("canvas");
    newChart.id = 'chart';
    chartContainer.appendChild(newChart);

    const response = await updateChart(60000, tokenSymbol);
    if (response == -1) {
        newChart.remove();
        const wrongTokenText = document.querySelector('.wrong-token-text');
        wrongTokenText.innerHTML = 'Token not found';
        setTimeout(() => {
            wrongTokenText.innerHTML = '';
        }, 3000);
        return;
    }
    toggleButtons(true);

    chartContainer.style.display = 'block';

    const closeChartButton = document.createElement("button");
    closeChartButton.id = 'close-chart-button';
    closeChartButton.textContent = "Close Chart";
    chartContainer.appendChild(closeChartButton);

    closeChartButton.addEventListener('click', (e) => {
        // isOn = false;
        clearTimeout(updatePricesId1);
        clearTimeout(updatePricesId2);
        document.getElementById('chart').remove();
        document.getElementById('close-chart-button').remove();
    
        chartContainer.style.display = 'none';

        deleteChart();

        toggleButtons(false);
    });
}


function toggleButtons(state) {
    const buttons = document.querySelectorAll('.token-button');
    buttons.forEach(button => {
        button.disabled = state;
    });
}

function setupButton(button, tokenSymbol){
    button.addEventListener('click', async (e) => {
        showChartWindow(tokenSymbol)
    });
}

const ethButton = document.querySelector('.eth-button');
const btcButton = document.querySelector('.btc-button');
const arButton = document.querySelector('.ar-button');

setupButton(ethButton, 'ETH');
setupButton(btcButton, 'BTC');
setupButton(arButton, 'AR');