import {
    updatePricesId1,
    updatePricesId2,
    myChart,
    deleteChart,

    updateChart
} from './update-prices.js'

const chartContainer = document.querySelector('.chart-container');

// let isOn = false;

function toggleButtons(state) {
    const buttons = document.querySelectorAll('.token-button');
    buttons.forEach(button => {
        button.disabled = state;
    });
}

function setupButton(button, tokenSymbol){
    button.addEventListener('click', (e) => {
        // if(isOn === false) {
        toggleButtons(true);
        const newChart = document.createElement("canvas");
        newChart.id = 'chart';
        chartContainer.appendChild(newChart);
    
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
        
            deleteChart();
    
            toggleButtons(false);
        });
    
        updateChart(60000, tokenSymbol);
    
    });
}

const ethButton = document.querySelector('.eth-button');
const btcButton = document.querySelector('.btc-button');
const arButton = document.querySelector('.ar-button');

setupButton(ethButton, 'ETH');
setupButton(btcButton, 'BTC');
setupButton(arButton, 'AR');