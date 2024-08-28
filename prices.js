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

    multipliedPrice = btcPrice * ethPrice
    elementMultiplied = document.getElementById("multiplied-price");
    elementMultiplied.innerHTML = `${multipliedPrice}`;

    prices = [
        {token: 'btc', price: 1000, time: '2024-08-21'},
        {token: 'eth', price: 1200, time: '2024-08-25'},
        {token: 'bth', price: 800, time: '2024-08-28'}
    ]

    console.log(prices)

    elementPriceList = document.getElementById("price-list")
    elementPriceList.innerHTML = `${JSON.stringify(prices)}`;



    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [prices[0].time, prices[1].time, prices[2].time],
            datasets: [{
                label: 'token prices test',
                data: [prices[0].price, prices[1].price, prices[2].price],
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

}

showPrices();