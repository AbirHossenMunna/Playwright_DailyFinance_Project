import { test, expect } from '@playwright/test';
import ResetPasswordPage from '../Pages/ResetPassword.js';
import jsonData from '../Utils/userData.json' assert { type: 'json' };
import { AUTH_TOKEN } from '../Utils/token.js';
import { waitForLatestResetEmail, extractResetLink } from '../Utils/emailUtils.js';

let resetPassword;

test('User can rest password with non-registered email', async ({ page }) => {
    resetPassword = new ResetPasswordPage(page);

    await page.goto('/');
    await page.getByText('Reset it here').click();

    const nonRegEmail = 'ab@gmail.com';
    await resetPassword.sendResetLink(nonRegEmail)

    //Assertion for rest link sent
    const actual = resetPassword.lblNonRegisterEmail;
    const expected = "Your email is not registered"
    await expect(actual).toHaveText(expected);
})

test('Negative: User cannot reset password if new and confirm passwords do not match', async ({ page, request }) => {
    resetPassword = new ResetPasswordPage(page);
    const testStartTime = Date.now();

    await page.goto('/');
    await page.getByText('Reset it here').click();
    const userEmail = "abirhossen422@gmail.com";

    await resetPassword.sendResetLink(userEmail);// Send reset link

    //Assertion for rest link sent
    const actual = resetPassword.lblSendEmailSuccess;
    const expected = "Password reset link sent to your email"
    await expect(actual).toHaveText(expected);

    // 📩 Wait for the latest valid reset email
    const mailBody = await waitForLatestResetEmail(
        request,
        AUTH_TOKEN,
        userEmail,
        testStartTime
    );

    const resetLink1 = extractResetLink(mailBody);

    await page.goto(resetLink1);

    // Fill new password and confirm password (mismatch)
    const newPassword = 'NewPass123!';
    const confirmPassword = 'DifferentPass456!';
    await resetPassword.resetPass(newPassword, confirmPassword);

    // Assertion: error message appears
    const expectedResetMsg = "Passwords do not match";
    await expect(resetPassword.errorMsg).toBeVisible();
    await expect(resetPassword.errorMsg).toContainText(expectedResetMsg);

});

test('User can reset password and login', async ({ page, request}) => {
    resetPassword = new ResetPasswordPage(page);
    const testStartTime = Date.now();

    await page.goto('/');
    await page.getByText('Reset it here').click();

    // Last array of users
    const userEmail = "abirhossen422@gmail.com";
    await resetPassword.sendResetLink(userEmail);

    //Assertion for rest link sent
    const actual = resetPassword.lblSendEmailSuccess;
    const expected = "Password reset link sent to your email"
    await expect(actual).toHaveText(expected);

    // 📩 Wait for the latest valid reset email
    const mailBody = await waitForLatestResetEmail(
        request,
        AUTH_TOKEN,
        userEmail,
        testStartTime
    );

    const resetLink = extractResetLink(mailBody);

    await page.goto(resetLink);

    //Fill new password and confirm password (mismatch)
    const newPassword = 'Ab123456';
    await resetPassword.resetPass(newPassword, newPassword);

    //Assertion after reset password
    const expectedResetMsg = 'Password reset successfully';
    await expect(resetPassword.lblResetSuccess1).toHaveText(expectedResetMsg);

    // Login with new password
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Email' }).fill(userEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(newPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    // 7️⃣ Assertion: login successful
    //Assertion
    const actualText = page.getByRole('banner');
    const expectedText = "Dashboard";
    await expect(actualText).toHaveText(expectedText);
});