import {
    updatePricesId1,
    updatePricesId2,
    myChart,
    deleteChart,
    prices,
    getTokenColor,
    getTokenPrice,

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
            
            const response = await showChartWindow(inputTokenSymbol, 1);
            if (response === -1){
                await showChartWindow(inputTokenSymbol.toUpperCase(), 2);
            }

        }
    });
});

async function showChartWindow(tokenSymbol, attempt){
    const newChart = document.createElement("canvas");
    newChart.id = 'chart';
    chartContainer.appendChild(newChart);

    const response = await updateChart(60000, tokenSymbol);
    if (response == -1) {
        newChart.remove();
        if (attempt === 2) {
            const wrongTokenText = document.querySelector('.wrong-token-text');
            wrongTokenText.innerHTML = 'Token not found';
            setTimeout(() => {
                wrongTokenText.innerHTML = '';
            }, 3000);
        }

        return -1;
    }
    toggleButtons(true);

    chartContainer.style.display = 'block';

    const closeChartButton = document.createElement("button");
    closeChartButton.id = 'close-chart-button';
    closeChartButton.textContent = "Close";
    chartContainer.appendChild(closeChartButton);

    const priceText = document.createElement("div");
    priceText.id = 'price-text';
    priceText.innerHTML = `PRICE: ${prices[prices.length - 1].price.toFixed(2)}`;
    const textColor = getTokenColor(prices);
    priceText.style.color = textColor;
    chartContainer.appendChild(priceText);

    const updatePriceText = setInterval(() => {
        priceText.innerHTML = `PRICE: ${prices[prices.length - 1].price.toFixed(2)}`;
    }, 60000);

    closeChartButton.addEventListener('click', (e) => {
        // isOn = false;
        clearTimeout(updatePricesId1);
        clearTimeout(updatePricesId2);
        document.getElementById('chart').remove();
        document.getElementById('close-chart-button').remove();
    
        chartContainer.style.display = 'none';
        
        clearInterval(updatePriceText);
        priceText.remove();


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

function updateTextPrices(){
    const buttons = document.querySelectorAll('.token-button');

    buttons.forEach(async (button) => {
        let classList = button.classList;

        let price = await getTokenPrice(`${classList[2]}`);

        button.innerHTML += ` ${price.toFixed(1)}`;
    });

    setInterval(() => {
        buttons.forEach(async (button) => {
            const classList = button.classList;
            
            const price = await getTokenPrice(`${classList[2]}`);
    
            button.innerHTML = `${classList[2]} <br>`
            button.innerHTML += ` ${price.toFixed(1)}`;
        });
    }, 1000);

}

const ethButton = document.querySelector('.eth-button');
const btcButton = document.querySelector('.btc-button');
const arButton = document.querySelector('.ar-button');
const solButton = document.querySelector('.sol-button');

setupButton(ethButton, 'ETH');
setupButton(btcButton, 'BTC');
setupButton(arButton, 'AR');
setupButton(solButton, 'SOL');

updateTextPrices();