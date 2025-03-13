const { Builder, By, Key, until } = require('selenium-webdriver');
const path = require('path');

async function testRegistration() {
let driver = await new Builder().forBrowser('chrome').build();
try {
    await driver.get('http://localhost:4200/register');

    const absolutePath = path.resolve('../src/assets/images/layers.png');
    await driver.findElement(By.id('inputFoto')).sendKeys(absolutePath);

    await driver.findElement(By.id('inputNome')).sendKeys('NomeTest');
    await driver.findElement(By.id('inputCognome')).sendKeys('CognomeTest');
    await driver.findElement(By.id('inputEmail')).sendKeys('test@example.com');
    await driver.findElement(By.id('inputPassword')).sendKeys('password');

    await driver.findElement(By.id('btn')).click();

    await driver.wait(until.urlIs('http://localhost:4200/'), 10000);

    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === 'http://localhost:4200/') {
      console.log('Test passato: Registrazione nuovo utente avvenuta con successo');
    } else {
      console.log('Test fallito: Registrazione nuovo utente non riuscita');
    }
} finally {
    await driver.quit();
}
}

module.exports = { testRegistration };
