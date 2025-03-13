const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');

async function testUploadImage() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:4200/');
        await driver.executeScript("localStorage.setItem('token', '920243ae1898061df9a0f699b7caa9feb3cad03')");
        await driver.executeScript("localStorage.setItem('idUtente', '49')");

        await driver.get('http://localhost:4200/upload');

        await driver.executeScript("localStorage.setItem('lat', '43.432096')");
        await driver.executeScript("localStorage.setItem('long', ' 13.664128')");
        await driver.findElement(By.id('inputNomeLuogo')).sendKeys('Nome del luogo');
        await driver.findElement(By.id('inputAnno')).sendKeys('2002');
        await driver.findElement(By.id('inputDescrizione')).sendKeys('Descrizione del post');

        const absolutePath = path.resolve('../src/assets/images/layers.png');
        await driver.findElement(By.id('inputFoto')).sendKeys(absolutePath);

        await driver.findElement(By.id('btn')).click();

        await driver.wait(until.urlIs('http://localhost:4200/mappa'), 10000);

        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl === 'http://localhost:4200/mappa') {
            console.log('Test passato: Caricamento foto e indirizzamento alla pagina della mappa avvenuto con successo');
        } else {
            console.log('Test fallito: Caricamento foto non riuscita');
        }
    }
    finally {
        await driver.quit();
    }
}

module.exports = { testUploadImage };