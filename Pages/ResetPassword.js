import { expect } from '@playwright/test';

class ResetPassword {
    constructor(page) {
        this.page = page;

        // Elements for sending reset
        this.linkResetItHere = page.getByRole('link', { name: 'Reset it here' });
        this.txtEmail = page.getByRole('textbox', { name: 'Email' });
        this.btnSendReset = page.getByRole('button', { name: 'Send Reset Link' });
        this.lblSendEmailSuccess = page.locator("//p[contains(text(),'Password reset link sent')]");
        this.lblNonRegisterEmail = page.locator("//p[normalize-space()='Your email is not registered']");

        // Elements for resetting password
        this.lblResetPasswordAssert = page.locator('//h4[normalize-space()="Reset Password"]');
        this.txtNewPassword = page.getByRole('textbox', { name: 'New Password' });
        this.txtConfrimPassword = page.getByRole('textbox', { name: 'Confirm Password' });
        this.btnResetPassword = page.getByRole('button', { name: 'RESET PASSWORD' });
        this.errorMsg = page.getByText("Passwords do not match");
        // this.lblResetSuccess= page.locator("//p[contains(text(),'Password reset successful')]");
        this.lblResetSuccess1 = page.locator("text=Password reset successfully")
    }
    // 1️⃣ Send reset link to email and get the reset link (mock for now)
    async sendResetLink(email) {
        await this.txtEmail.fill(email);
        await this.btnSendReset.click({ timeout: 10000 });
    }

    // 2️⃣ Reset password using link
    async resetPass(newPassword, confirmPassword) {
        await this.txtNewPassword.fill(newPassword);
        await this.txtConfrimPassword.fill(confirmPassword);
        await this.btnResetPassword.click({ timeout: 10000 });

        // Check for success first
        if (await this.lblResetSuccess1.isVisible({ timeout: 5000 })) {
            return 'success';
        }

        // Check for error message
        if (await this.errorMsg.isVisible({ timeout: 5000 })) {
            return 'error';
        }

    }
}
export default ResetPassword;