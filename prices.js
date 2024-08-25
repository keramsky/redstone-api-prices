const redstone = require('redstone-api');

async function getTokenPrice(tokenTag) {
    try {
        const price = await redstone.getPrice(tokenTag);
        return price.value;
    } catch (error) {
        console.error('Error occured', error);
    }
}

(async () => {
    console.log(await getTokenPrice("ETH"))
})();