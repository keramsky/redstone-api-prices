const redstone = require('redstone-api')

async function getTokenPrices(tokenTag) {
    try {
        const price = await redstone.getPrice(tokenTag);
        return price.value;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}
async function updatePrices(timestamp, interval, prices, tokenTag) {

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

async function loadPrices(timestamp, interval, prices, tokenTag) {
    for(let i = 0; i < 60; i++){
        const price = await redstone.getHistoricalPrice(tokenTag, {
            date: timestamp , // Any convertable to date type
        });
        prices.push({ price: price.value, timestamp: timestamp })
        timestamp -= interval
    }
}


getTokenPrices("ETH").then(value => {
    console.log(value)
})
