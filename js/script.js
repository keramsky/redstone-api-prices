import {
    updatePricesId1,
    updatePricesId2
} from './update-prices.js'

const ethButton = document.querySelector('.eth-button');
const chart = document.getElementById('chart');

let isOn = true;

ethButton.addEventListener('click', (e) => {
    if(isOn === false) {
        // chart.style.visibility = "visible";
        isOn = true;
    } else {
        // chart.style.visibility = "hidden";
        isOn = false;
        clearTimeout(updatePricesId1);
        clearTimeout(updatePricesId2);
    }
});