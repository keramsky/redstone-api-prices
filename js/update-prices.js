export let myChart = null;

export function deleteChart(){
    myChart = null;
}

export async function showChart(prices, tokenSymbol) {
    let lineColor = getTokenColor(prices);

    const ctx = document.getElementById('chart').getContext('2d');

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
                    borderColor: lineColor,
                    tension: 0.1
                }]
            },
            options: {
                animation: false,
                scales: {
                    x: {
                        type: 'category',
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'white'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'white'
                        }
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


export async function getTokenPrice(tokenSymbol) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&limit=1`
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;  
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}
export async function updatePrices(prices, tokenSymbol, timestamp) {
    try {
        prices.shift();
        const price = await getTokenPrice(tokenSymbol);
        prices.push({ price: price, time: timestamp });
    } catch (error) {
        console.error("error!", error);
    }
}


export async function getHistoricalPrice(tokenSymbol, fromTimestamp, toTimestamp, interval) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&interval=${interval}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

export async function getSingleHistoricalPrice(tokenSymbol, timestamp){
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenSymbol}&provider=redstone&toTimestamp=${timestamp}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

export async function loadPrices(tokenSymbol, fromTimestamp, toTimestamp, interval) {
    const prices = await getHistoricalPrice(tokenSymbol, fromTimestamp, toTimestamp, interval);
    
    let priceList = [];

    prices.forEach(element => {
        priceList.push({ price: element.value, time: element.timestamp });
    });
    return priceList;
}

export async function updatePricesList(prices, nextTimestamp, interval, tokenSymbol){
    await updatePrices(prices, tokenSymbol, nextTimestamp)
    await showChart(prices, tokenSymbol);
    console.log(prices, Date.now());

    const currentTimestamp = Date.now();
    const nextUpdateTime = nextTimestamp + interval;
    const waitTime = nextUpdateTime - currentTimestamp;

    updatePricesId2 = setTimeout(() => {
        updatePricesList(prices, nextUpdateTime, interval, tokenSymbol);
    }, Math.max(waitTime, 0));

}

export function getTokenColor(prices){
    if (prices[0].price <= prices[prices.length - 1].price) {
        return 'green';
    } else {
        return 'red';
    }
}

export async function updateChart(interval, tokenSymbol){
    prices = await loadPrices(tokenSymbol, Date.now() - 60 * interval, Date.now(), interval);


    const currentTimestamp = Date.now();
    let nextTimestamp;
    try {
        nextTimestamp = prices[prices.length - 1].time + interval;
    } catch (error) {
        return -1;
    }

    const waitTime = nextTimestamp - currentTimestamp;

    await showChart(prices, tokenSymbol);

    updatePricesId1 = setTimeout(() => {
        updatePricesList(prices, nextTimestamp, interval, tokenSymbol)
    }, Math.max(waitTime, 0));
}

// time in milliseconds
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;
export const SECOND = 1000;

export let updatePricesId1;
export let updatePricesId2;

export let prices;

const tokenSymbol = 'ETH';
const interval = MINUTE;