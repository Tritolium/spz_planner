// @ts-check
const { test, expect } = require('@playwright/test');

test('do login', async ({ page }) => {

  page.on('console', msg => console.log(msg.text()))
  page.on('request', request => console.log('>>', request.method(), request.url(), request.postData()))
  page.on('response', response => console.log('<<', response.status(), response.url()))

  await page.goto('https://spzroenkhausen.bplaced.net/alpha/index.html');
  
  await page.locator("#loginname").fill("Dominik")
  await page.locator("#passwd").fill("QzJ%6WKP")
  await page.getByRole("button", {name: "Login"}).press("Enter")
  await expect(page.getByRole("button", {name: "Feedback"})).toBeVisible()
  await expect(page.getByText(/Nächste Probe/)).toBeVisible()
  await page.getByRole("button", {name: "Hauptmenü"}).click()
  // test the attendence page
  await expect(page.locator("#main_button_1")).toBeVisible()
  await page.locator("#main_button_1").click()
  await expect(page.locator("tbody > tr").first()).toBeVisible()
  // test the attendence overview page
  await page.locator("#date_button_1").click()
  await page.locator("#usergroup_select").selectOption("Rönkhausen")
  await expect(page.locator("tbody > tr").first()).toBeVisible()
})