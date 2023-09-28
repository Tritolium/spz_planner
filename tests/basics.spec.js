// @ts-check
const { test, expect } = require('@playwright/test');

test('do login', async ({ page }) => {

  page.on('console', msg => console.log(msg.text()))

  await page.goto('https://spzroenkhausen.bplaced.net/alpha/index.html');
  
  const login = page.getByPlaceholder("Namen eingeben")
  const passwd = page.locator("#passwd")
  await login.fill("Dominik")
  await passwd.fill("QzJ%6WKP")
  await login.press("Enter")
})