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
async function updatePrice(timestamp, interval, prices, tokenTag) {

    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
        setTimeout(async () => {
            try {
                const price = await getTokenPrices(tokenTag);
                prices.push({ price, timestamp: Date.now() });
            } catch (error) {
                console.error("ERROR 3:", error);
            }

            await updatePrices(timestamp + interval, interval, prices, tokenTag); // Dodano await
        }, delay);
    } else {
        updatePrices(Date.now() + interval, interval, prices, tokenTag);
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

let prices = [];

loadPrices("ETH", Date.now() - 60 * 60 * 1000, Date.now(), 60 * 1000).then(value => {
    prices = value;
    console.log(prices);
});