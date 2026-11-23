// @ts-check
const { test, expect } = require("@playwright/test")

// Playwright traces can contain credentials and session tokens.
test.use({ trace: "off", screenshot: "off" })

test("do login", async ({ page }) => {
	const username = process.env.E2E_LOGIN_USERNAME
	const password = process.env.E2E_LOGIN_PASSWORD
	if (!username || !password) {
		throw new Error("Set E2E_LOGIN_USERNAME and E2E_LOGIN_PASSWORD before running the login test.")
	}

	await page.goto("https://spzroenkhausen.bplaced.net/alpha/index.html", { waitUntil: "domcontentloaded" })

	await expect(page.locator("#loginname")).toBeVisible()
	await expect(page.locator("#passwd")).toBeVisible()
	await page.locator("#loginname").fill(username)
	await page.locator("#passwd").fill(password)
	await page.getByRole("button", {name: "Login"}).press("Enter")
	await expect(page.getByRole("button", {name: "Feedback"})).toBeVisible()
	await expect(page.getByText(/Nächste Probe/)).toBeVisible()
	await page.getByRole("button", {name: "Hauptmenü"}).click()
	// test the attendence page
	await expect(page.locator("#main_button_1")).toBeVisible()
	await page.locator("#main_button_1").click()
	await expect(page.locator(".event").first()).toBeVisible()
	// test the attendence overview page
	await page.locator("#date_button_1").click()
	await page.locator("#usergroup_select").selectOption("Rönkhausen")
	await expect(page.locator("tbody > tr").first()).toBeVisible()
})
