import { showChart } from './script.js'

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
async function updatePrices(prices, tokenTag) {
    try {
        prices.shift();
        const price = await getTokenPrice(tokenTag);
        prices.push({ price: price, time: Date.now() });
    } catch (error) {
        console.error("error!", error);
    }
}


export async function getHistoricalPrice(tokenTag, fromTimestamp, toTimestamp, interval) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&interval=${interval}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
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

async function updateChart(interval){
    let prices = await loadPrices("ETH", Date.now() - 60 * interval, Date.now(), interval);
    await showChart(prices);
    setInterval(async () => {
        await updatePrices(prices, "ETH");
        await showChart(prices);
        console.log("GREAT!")
    }, interval)
}

// time in milliseconds
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;
export const SECOND = 1000;

updateChart(MINUTE);