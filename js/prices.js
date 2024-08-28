const redstone = require('redstone-api');

async function getTokenPrices(tokenTag) {
    try {
        const price = await redstone.getPrice(tokenTag);
        return price.value;
    } catch (error) {
        console.error('ERROR 1:', error);
    }
}

async function runAtSpecificTime(timestamp, interval, tokenTag) {
    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
        setTimeout(async () => {
            try {
                const price = await getTokenPrices(tokenTag);
                console.log(price);
            } catch (error) {
                console.error("ERROR 2:", error);
            }
        
            runAtSpecificTime(timestamp + interval, interval, tokenTag);
        }, delay);
    } else {
        runAtSpecificTime(Date.now() + interval, interval, tokenTag);
    }
}

interval = 1000 // in ms
runAtSpecificTime(Date.now() + interval, interval, "ETH");