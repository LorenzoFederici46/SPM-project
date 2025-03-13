const { Builder, By, until } = require('selenium-webdriver');

async function testLogin() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://localhost:4200/login');

    await driver.findElement(By.id('inputEmail')).sendKeys('test@example.com');
    await driver.findElement(By.id('inputPassword')).sendKeys('password');

    await driver.findElement(By.id('btn')).click();

    await driver.wait(until.urlIs('http://localhost:4200/'), 10000);    
    const currentUrl = await driver.getCurrentUrl();
    const checkToken = await driver.executeScript("return localStorage.getItem('token')");

    if(currentUrl === 'http://localhost:4200/' && checkToken != null){
        console.log('Test passato: Login avvenuto con successo');
    } else {
        console.log('Test fallito: Processo di login fallito');
    }

  } catch (error) {
    console.error('Test fallito:', error.message);
  } finally {
    await driver.quit();
  }
}

module.exports = { testLogin };