async function getTokenPrices(tokenTag) {
    try {
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&limit=1`
        const response = await fetch(url);
        const data = await response.json();
        return data[0].value;  
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

async function loadPrices(quantity, timestamp, interval, prices, tokenTag) {
    for(let i = 0; i < quantity; i++){
        const url = `https://api.redstone.finance/prices?symbol=${tokenTag}&provider=redstone&toTimestamp=${timestamp}&limit=1`
        const response = await fetch(url)
        const data = await response.json();
        prices.push({ price: data[0].value, timestamp: timestamp })
        timestamp -= interval
    }
}


getTokenPrices("ETH").then(value => {
    element = document.getElementById("token-price");
    element.innerHTML = `${value}`
    console.log(value)
})
// let prices = []


// loadPrices(10, Date.now(), 60 * 1000, prices, 'ETH').then(() => console.log(prices))