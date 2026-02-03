class LoginPage {
    constructor(page) {
        this.page = page;

        this.txtEmail = page.getByRole('textbox', { name: 'Email' });
        this.txtPassword = page.getByRole('textbox', { name: 'Password' });
        this.btnLogin = page.getByRole('button', { name: 'Login' });
    }

    async doLogin(email, password) {
        await this.txtEmail.fill(email);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
    }

}
export default LoginPage;