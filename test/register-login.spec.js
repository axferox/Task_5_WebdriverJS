const { expect } = require('chai');
const { By, Builder, until } = require('selenium-webdriver');
const { generate } = require('randomstring');

describe('Test performs the testing of the login and sign up forms', () => {
  let driver;

  before(() => {
    driver = new Builder().forBrowser('chrome').build();
    driver.manage().window().maximize();
  });

  after(async () => {
    await driver.sleep(9000);
    await driver.quit();
    driver = null;
  });

  it('Should test that page is loaded and the title matches the expected', async () => {
    const pageTitle = 'Albert Heijn: boodschappen doen bij de grootste supermarkt';
    await driver.get('https://www.ah.nl');
    expect(await driver.getTitle()).to.equal(pageTitle);
  });

  it('Should test that modal is opened and button contains the text ', async () => {
    const cookieButtonText = 'Accepteer';
    await driver.wait(until.elementLocated(By.id('cookie-popup'), 10000));
    expect(await driver.findElement(By.id('accept-cookies')).getText()).to.equal(cookieButtonText);
  });

  it('Should test that modal is closed after submission', async () => {
    await driver.findElement(By.id('accept-cookies')).click();
    expect((await driver.findElements(By.id('cookie-popup'))).length).equal(0);
  });

  it('Should test menu button name and user is landed on login screen after click', async () => {
    const loginButtonText = 'Inloggen';
    const expectedUrl = 'https://www.ah.nl/mijn/inloggen?ref=%2F';
    expect(await driver.findElement(By.xpath('//*[@id="menu_personal"]/li[2]/a/span')).getText()).to.equal(
      loginButtonText
    );
    await driver.findElement(By.xpath('//*[@id="menu_personal"]/li[2]/a/span')).click();
    expect(await driver.getCurrentUrl()).to.equal(expectedUrl);
  });

  it('Should test that page contains user sign up link with text', async () => {
    const createProfileLinkText = 'Maak nu een profiel aan';
    expect(
      await driver
        .findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/div[2]/div[3]/div/footer/p[1]/a/span'))
        .getText()
    ).to.equal(createProfileLinkText);
    await driver
      .findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/div[2]/div[3]/div/footer/p[1]/a/span'))
      .click();
  });

  it('Should test that radio buttons is present and un ticked by default', async () => {
    expect(await driver.findElement(By.id('f-radio-button-gender-female')).isSelected()).equal(false);
    expect(await driver.findElement(By.id('f-radio-button-gender-male')).isSelected()).equal(false);

    await driver.findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[1]/span[1]/label')).click();
    expect(await driver.findElement(By.id('f-radio-button-gender-female')).isSelected()).equal(true);

    await driver.findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[1]/span[2]/label')).click();
    expect(await driver.findElement(By.id('f-radio-button-gender-male')).isSelected()).equal(true);
  });

  it('Should complete the fields with the test data', async () => {
    const randomString = generate({ length: 8, charset: 'alphabetic' });
    const number = generate({ length: 3, charset: 'numeric' });
    await driver.findElement(By.name('firstName')).sendKeys(randomString);
    await driver.findElement(By.name('lastName')).sendKeys(randomString);
    await driver.findElement(By.name('address.postalCodeNld')).sendKeys('1421XM');
    await driver.findElement(By.name('address.houseNumber')).sendKeys('1');
    await driver.findElement(By.name('address.houseNumberExtra')).sendKeys('1');
    await driver.findElement(By.name('emailAddress')).sendKeys(`${randomString}@mailinator.com`);
    await driver.findElement(By.name('password')).sendKeys(`${generate(10).toUpperCase()}}`);
    await driver.findElement(By.css('#phoneNumberWebshop')).sendKeys(`31886599${number}`);
    await driver.findElement(By.css('#dateOfBirthWebshop')).sendKeys('11-11-2000');
  });

  it('Should test that Bonus card options are un ticked by default and can be ticked', async () => {
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-optOut')).isSelected()).equal(false);
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-request')).isSelected()).equal(false);
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-input')).isSelected()).equal(false);

    await driver
      .findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[8]/div[1]/div/span[3]/label'))
      .click();
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-optOut')).isSelected()).equal(true);

    await driver
      .findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[8]/div[1]/div/span[2]/label'))
      .click();
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-request')).isSelected()).equal(true);

    await driver
      .findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[8]/div[1]/div/span[1]/label'))
      .click();
    expect(await driver.findElement(By.id('f-radio-button-bonusCardChoice-input')).isSelected()).equal(true);
  });

  it('Should test that custom Bonus card field can be completed', async () => {
    await driver.findElement(By.xpath('//*[@id="cards.BO"]')).sendKeys('2620663024299');
  });

  it('Should test that subscription checkboxes are un ticked by default and can be ticked', async () => {
    expect(await driver.findElement(By.id('f-checkbox-serviceMail')).isSelected()).equal(false);
    await driver.findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[9]/div/label')).click();
    expect(await driver.findElement(By.id('f-checkbox-serviceMail')).isSelected()).equal(true);
    expect(await driver.findElement(By.id('f-checkbox-newsLetter')).isSelected()).equal(false);
    await driver.findElement(By.xpath('//*[@id="app"]/div/main/div/div/div/form/div[10]/div/label')).click();
    expect(await driver.findElement(By.id('f-checkbox-newsLetter')).isSelected()).equal(true);
  });

  it('Should test that can be submitted', async () => {
    await driver.findElement(By.id('registration-form-submit')).click();
  });
});
