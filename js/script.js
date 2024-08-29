import { prices } from './update-prices.js'

async function showPrices() {

    // btcPrice = await getTokenPrice("BTC");
    // elementBtc = document.getElementById("btc-price");
    // elementBtc.innerHTML = `${btcPrice}`;
    // console.log(btcPrice);
    
    // ethPrice = await getTokenPrice("ETH");
    // elementEth = document.getElementById("eth-price");
    // elementEth.innerHTML = `${ethPrice}`;
    // console.log(ethPrice);

    // multipliedPrice = btcPrice * ethPrice
    // elementMultiplied = document.getElementById("multiplied-price");
    // elementMultiplied.innerHTML = `${multipliedPrice}`;

    // prices = [
    //     {token: 'btc', price: 1000, time: '2024-08-21'},
    //     {token: 'eth', price: 1200, time: '2024-08-25'},
    //     {token: 'bth', price: 800, time: '2024-08-28'}
    // ]

    // console.log(prices)

    // elementPriceList = document.getElementById("price-list")
    // elementPriceList.innerHTML = `${JSON.stringify(prices)}`;



    // const ctx = document.getElementById('myChart').getContext('2d');

    // const myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: [prices[0].time, prices[1].time, prices[2].time],
    //         datasets: [{
    //             label: 'token prices test',
    //             data: [prices[0].price, prices[1].price, prices[2].price],
    //             fill: false,
    //             borderColor: 'rgb(75, 192, 192)',
    //             tension: 0.1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             x: {
    //                 type: 'category',
    //             },
    //             y: {
    //                 beginAtZero: false
    //             }
    //         }
    //     }
    // });

    setTimeout(() => {
        console.log(prices)

        const ctx = document.getElementById('myChart').getContext('2d');

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [prices[0].time, prices[1].time, prices[2].time, prices[3].time, prices[4].time, prices[5].time, prices[6].time, prices[7].time, prices[8].time],
                datasets: [{
                    label: 'token prices test',
                    data: [prices[0].price, prices[1].price, prices[2].price, prices[3].price, prices[4].price, prices[5].price, prices[6].price, prices[7].price, prices[8].price],
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
    }, 1000)
}

showPrices();