let myChart = null;

export async function showChart(prices) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const labels = prices.map(p => new Date(p.time).toLocaleTimeString());
    const data = prices.map(p => p.price);

    if (myChart === null) {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'ETH',
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
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


async function getTokenPrice(tokenTag) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&limit=1`
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;  
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}
async function updatePrices(prices, tokenTag, timestamp) {
    try {
        prices.shift();
        const price = await getTokenPrice(tokenTag);
        prices.push({ price: price, time: timestamp });
    } catch (error) {
        console.error("error!", error);
    }
}


async function getHistoricalPrice(tokenTag, fromTimestamp, toTimestamp, interval) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&interval=${interval}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

async function getSingleHistoricalPrice(tokenTag, timestamp){
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&toTimestamp=${timestamp}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

async function loadPrices(tokenTag, fromTimestamp, toTimestamp, interval) {
    const prices = await getHistoricalPrice(tokenTag, fromTimestamp, toTimestamp, interval);
    
    let priceList = [];

    prices.forEach(element => {
        priceList.push({ price: element.value, time: element.timestamp });
    });
    return priceList;
}

async function updatePricesList(prices, nextTimestamp, interval){
    await updatePrices(prices, 'ETH', nextTimestamp)
    await showChart(prices);
    console.log(prices, Date.now());

    const currentTimestamp = Date.now();
    const nextUpdateTime = nextTimestamp + interval;
    const waitTime = nextUpdateTime - currentTimestamp;

    setTimeout(() => {
        updatePricesList(prices, nextUpdateTime, interval);
    }, Math.max(waitTime, 0));

}

async function updateChart(interval){
    const price = await getHistoricalPrice("ETH", Date.now());
    console.log(price);

    let prices = await loadPrices("ETH", Date.now() - 60 * interval, Date.now(), interval);
    await showChart(prices);

    const currentTimestamp = Date.now();
    const nextTimestamp = prices[prices.length - 1].time + interval;
    const waitTime = nextTimestamp - currentTimestamp;

    // console.log(waitTime, currentTimestamp);

    setTimeout(() => {
        updatePricesList(prices, nextTimestamp, interval)
    }, Math.max(waitTime, 0));

    // updatePricesList(interval, prices);

    // await showChart(prices);
    // console.log(prices);

    // let currentTimestamp = Date.now();
    // let nextTimestamp = prices[prices.length - 1].time + MINUTE;
    // let waitTime = nextTimestamp - currentTimestamp;

    // console.log(Date.now())
    // setInterval(async () => {
    //     console.log(Date.now())
    //     console.log(prices);
    //     await updatePrices(prices, "ETH", nextTimestamp);
    //     await showChart(prices);
        
    //     currentTimestamp = Date.now();
    //     nextTimestamp = prices[prices.length - 1].time + MINUTE;
    //     waitTime = nextTimestamp - currentTimestamp;
    //     console.log(waitTime)
    // }, waitTime); 
}

// time in milliseconds
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;
export const SECOND = 1000;

updateChart(MINUTE);