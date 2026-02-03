import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import jsonData from '../Utils/userData.json' assert { type: 'json' };

test('User Login with Invalid Email and Valid Password', async ({ page }) => {
    await page.goto("/")

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const userData = () => {
        return {
            email: "abir45@gmail.com",
            password: "t7he3u1FUm"

        };
    };

    const login = new LoginPage(page);

    const { email, password } = userData();

    await login.doLogin(email, password)

    //Assertion
    const actualText = page.getByRole('paragraph');
    const expectedText = "Invalid email or password";
    await expect(actualText).toHaveText(expectedText);
})

test('User Login with Valid Email and Invalid Password', async ({ page }) => {
    await page.goto("/")

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const userData = () => {
        return {
            email: "abir45@gmail.com",
            password: "t7he3u1FUm"

        };
    };

    const login = new LoginPage(page);

    const { email, password } = userData();

    await login.doLogin(email, password)

    //Assertion
    const actualText = page.getByRole('paragraph');
    const expectedText = "Invalid email or password";
    await expect(actualText).toHaveText(expectedText);
})

test('User Login successfully', async ({ page }) => {
    await page.goto("/")

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const latestData = jsonData[jsonData.length - 1]

    const login = new LoginPage(page);

    await login.doLogin(latestData.email, latestData.password)

    // 🔥 Dynamic wait (no hard timer)
    await this.page.waitForLoadState('networkidle');

    //Assertion
    const actualText = page.getByRole('banner');
    const expectedText = "Dashboard";
    await expect(actualText).toHaveText(expectedText);
})