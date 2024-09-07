const ethButton = document.querySelector('.eth-button');
const ethChart = document.getElementById('eth-chart');

let isOn = false;

ethButton.addEventListener('click', (e) => {
    if(isOn === false) {
        ethChart.style.visibility = "visible";
        isOn = true;
    } else {
        ethChart.style.visibility = "hidden";
        isOn = false; 
    }
});