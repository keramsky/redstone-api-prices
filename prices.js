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

async function showPrices() {

    btcPrice = await getTokenPrices("BTC");
    elementBtc = document.getElementById("btc-price");
    elementBtc.innerHTML = `${btcPrice}`;
    console.log(btcPrice);
    
    ethPrice = await getTokenPrices("ETH");
    elementEth = document.getElementById("eth-price");
    elementEth.innerHTML = `${ethPrice}`;
    console.log(ethPrice);

    elementMultiplied = document.getElementById("multiplied-price");
    elementMultiplied.innerHTML = `${btcPrice * ethPrice}`;

}

showPrices();
