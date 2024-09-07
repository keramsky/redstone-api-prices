let myChart = null;

export async function showChart(prices, tokenSymbol) {
    const ctx = document.getElementById('eth-chart').getContext('2d');

    const labels = prices.map(p => new Date(p.time).toLocaleTimeString());
    const data = prices.map(p => p.price);

    if (myChart === null) {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: tokenSymbol,
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                animation: false,  // Wyłączenie animacji
                scales: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    } else {
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = data;
        myChart.options.animation = false;
        myChart.update();
    }
}


async function getTokenPrice(tokenSymbol) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&limit=1`
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;  
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}
async function updatePrices(prices, tokenSymbol, timestamp) {
    try {
        prices.shift();
        const price = await getTokenPrice(tokenSymbol);
        prices.push({ price: price, time: timestamp });
    } catch (error) {
        console.error("error!", error);
    }
}


async function getHistoricalPrice(tokenSymbol, fromTimestamp, toTimestamp, interval) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&interval=${interval}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

async function getSingleHistoricalPrice(tokenSymbol, timestamp){
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&toTimestamp=${timestamp}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

async function loadPrices(tokenSymbol, fromTimestamp, toTimestamp, interval) {
    console.log(interval)
    const prices = await getHistoricalPrice(tokenSymbol, fromTimestamp, toTimestamp, interval);
    
    let priceList = [];

    prices.forEach(element => {
        priceList.push({ price: element.value, time: element.timestamp });
    });
    return priceList;
}

async function updatePricesList(prices, nextTimestamp, interval, tokenSymbol){
    await updatePrices(prices, tokenSymbol, nextTimestamp)
    await showChart(prices, tokenSymbol);
    console.log(prices, Date.now());

    const currentTimestamp = Date.now();
    const nextUpdateTime = nextTimestamp + interval;
    const waitTime = nextUpdateTime - currentTimestamp;

    setTimeout(() => {
        updatePricesList(prices, nextUpdateTime, interval, tokenSymbol);
    }, Math.max(waitTime, 0));

}

async function updateChart(interval, tokenSymbol){
    let prices = await loadPrices(tokenSymbol, Date.now() - 60 * interval, Date.now(), interval);
    await showChart(prices, tokenSymbol);

    const currentTimestamp = Date.now();
    const nextTimestamp = prices[prices.length - 1].time + interval;
    const waitTime = nextTimestamp - currentTimestamp;

    setTimeout(() => {
        updatePricesList(prices, nextTimestamp, interval, tokenSymbol)
    }, Math.max(waitTime, 0));
}

// time in milliseconds
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;
export const SECOND = 1000;

const tokenSymbol = 'ETH';
const interval = MINUTE;

updateChart(interval, tokenSymbol);