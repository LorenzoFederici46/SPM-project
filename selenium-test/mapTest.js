const { Builder, By, until } = require('selenium-webdriver');

async function testSliderChange() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {

        await driver.get('http://localhost:4200/');
        await driver.get('http://localhost:4200/mappa');

        const slider = await driver.findElement(By.id('myRange'));
        const maxValue = await slider.getAttribute('max');
        const maxVal = parseInt(maxValue);

        await slider.sendKeys(maxVal.toString());

        await driver.wait(until.urlIs('http://localhost:4200/mappa'), 10000);
        const checkSliderValue = await driver.executeScript("return localStorage.getItem('anno')");
        
        if (maxVal === parseInt(checkSliderValue)) {
            console.log('Il valore massimo è uguale al valore nel local storage.');
          } else {
            console.log('Il valore massimo non corrisponde al valore nel local storage.');
          }
    } finally {
        await driver.quit();
    }
}

module.exports = { testSliderChange };