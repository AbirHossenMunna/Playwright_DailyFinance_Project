import { test, expect } from '@playwright/test'
import RegisterPage from '../Pages/RegisterPage';
import { generateRandomID } from '../Utils/utils';
import { faker } from '@faker-js/faker';
import jsonData from '../Utils/userData.json' assert { type: 'json' };
import fs from 'fs';

test("User using existing Email", async ({ page }) => {
    await page.goto('/')

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const reg = new RegisterPage(page)

    const userData = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: `abir@gmail.com`,
        password: faker.internet.password({
            length: 10,
            memorable: false
        }),
        phonenumber: `018${generateRandomID(10000000, 99999999)}`,
        address: faker.location.city()
    };

    await reg.doRegister(userData)

    const toast = page.getByRole('alert');

    // auto-wait + visibility
    await expect(toast).toBeVisible({ timeout: 40000 });

    const msg = await toast.textContent('email address already exists.');
    console.log('Toast message:', msg);
})

test("User using mandatory field", async ({ page }) => {
    await page.goto('/')

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const reg = new RegisterPage(page)

    const userData = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: `abir${generateRandomID(1000, 9999)}@gmail.com`,
        password: faker.internet.password({
            length: 10,
            memorable: false
        }),
        phonenumber: `018${generateRandomID(10000000, 99999999)}`,
    };

    await reg.doRegister(userData)

    const toast = page.getByRole('alert');

    // auto-wait + visibility
    await expect(toast).toBeVisible({ timeout: 40000 });

    const msg = await toast.textContent('successfully!');
    console.log('Toast message:', msg);
})

test("User successfully register with all field", async ({ page }) => {
    await page.goto('/')

    await expect(
        page.getByRole('heading', { name: 'Welcome to daily finance' })
    ).toBeVisible();

    const reg = new RegisterPage(page)

    const userData = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: `abir${generateRandomID(1000, 9999)}@gmail.com`,
        password: faker.internet.password({
            length: 10,
            memorable: false
        }),
        phonenumber: `018${generateRandomID(10000000, 99999999)}`,
        address: faker.location.city()
    };

    await reg.doRegister(userData)

    const toast = page.getByRole('alert');

    // auto-wait + visibility
    await expect(toast).toBeVisible({ timeout: 40000 });

    const msg = await toast.textContent('successfully!');
    console.log('Toast message:', msg);

    //Save the user data to a JSON file
    jsonData.push(userData)
    fs.writeFileSync('./Utils/userData.json', JSON.stringify(jsonData, null, 2));
})