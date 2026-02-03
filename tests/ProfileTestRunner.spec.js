import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import jsonData from '../Utils/userData.json' assert { type: 'json' };
import ProfilePage from '../Pages/ProfilePage';
import { faker } from '@faker-js/faker';

let loginPage;
let page;
let context;
let profilePage;

test.beforeEach(async ({ browser }) => {
    // New browser context & make page
    context = await browser.newContext();
    page = await context.newPage();
    // LoginPage Object call
    profilePage = new ProfilePage(page);

    // Login before each test if required
    loginPage = new LoginPage(page);
    await page.goto("/");
    const latestData = jsonData[jsonData.length - 1];
    await loginPage.doLogin(latestData.email, latestData.password, { waitUntil: 'networkidle' });
});

test("User can update Profile but profile image upload failed", async () => {
    // Invlaid FIle
    const imagePath = "./Fixtures/1600w-yMEujoaa8Hs.webp";

    // Profile Edit Mode
    await profilePage.iconProfile.click();
    await profilePage.profileMenuItems.nth(0).click();
    await profilePage.btnEdit.click();

    // Input Fillup and Upload
    await profilePage.chooseFileInput.setInputFiles(imagePath);
    await profilePage.btnUpload.click();

    // Assertion
    await expect(profilePage.errorMsg).toBeVisible({ timeout: 10000 });
    const errorText = await profilePage.errorMsg.textContent();
    expect(errorText).toContain("Failed to upload image.");
})

test("User can update Profile", async () => {
    const imagePath = "./Fixtures/Image 1.jpg";
    const { uploadMessage } = await profilePage.updateProfile(imagePath);

    const address = faker.location.streetAddress();

    // ২. New input added
    await profilePage.txtAddress.clear();
    await profilePage.txtAddress.fill(address);

    // ৩. Click Save button
    const updateMessage = await profilePage.saveProfile();

    // ৪. Assertions
    expect(uploadMessage).toContain('Image uploaded successfully!');
    expect(updateMessage).toContain('User updated successfully!');

    // ৫. New address check
    await expect(profilePage.txtAddress).toHaveValue(address);
})

test("User can logout", async () => {
    await profilePage.iconProfile.click();
    await profilePage.profileMenuItems.nth(1).click();

    //Assertion for Logout
    const actualText = page.locator('#root')
    const expectedText = "Login";
    await expect(actualText).toContainText(expectedText);
})