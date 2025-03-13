const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function testUserProperty() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:4200/');
        await driver.executeScript("localStorage.clear()");
        await driver.get('http://localhost:4200/login');

        await driver.findElement(By.id('inputEmail')).sendKeys('test@example.com');
        await driver.findElement(By.id('inputPassword')).sendKeys('password');
        await driver.findElement(By.id('btn')).click();
        await driver.wait(until.urlIs('http://localhost:4200/'), 10000);

        await driver.get('http://localhost:4200/profile');

        await driver.findElement(By.id('inputNome')).clear();
        await driver.findElement(By.id('inputNome')).sendKeys('Name');
        await driver.findElement(By.id('inputCognome')).clear();
        await driver.findElement(By.id('inputCognome')).sendKeys('Surname');
        await driver.findElement(By.id('btn')).click();

        driver.sleep(5000);

        await driver.get('http://localhost:4200/profile');
        const updatedNome = await driver.findElement(By.id('inputNome')).getAttribute('value');
        const updatedCognome = await driver.findElement(By.id('inputCognome')).getAttribute('value');
        assert.strictEqual(updatedNome, 'Name');
        assert.strictEqual(updatedCognome, 'Surname');

        console.log('Test passato: Modifica dei dati utente avvenuta con successo');
    } catch (error) {
        console.error('Test fallito:', error);
    } finally {
        await driver.quit();
    }
}

async function testDeleteUser() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:4200/');
        await driver.executeScript("localStorage.clear()");
        await driver.get('http://localhost:4200/login');

        await driver.findElement(By.id('inputEmail')).sendKeys('test@example.com');
        await driver.findElement(By.id('inputPassword')).sendKeys('password');
        await driver.findElement(By.id('btn')).click();
        await driver.wait(until.urlIs('http://localhost:4200/'), 10000);

        await driver.get('http://localhost:4200/profile');

        await driver.findElement(By.id('btn-delete')).click();

        await driver.wait(until.urlIs('http://localhost:4200/'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        const checkToken = await driver.executeScript("return localStorage.getItem('token')");

        assert.strictEqual(currentUrl, 'http://localhost:4200/');
        assert.strictEqual(checkToken, null);

        console.log("Test passato: Eliminazione dell'utente avvenuta con successo");
    } catch (error) {
        console.error('Test fallito:', error);
    } finally {
        await driver.quit();
    }
}

module.exports = { testUserProperty, testDeleteUser };
