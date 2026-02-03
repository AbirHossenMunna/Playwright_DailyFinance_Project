class RegisterPage {

    constructor(page) {
        this.page = page; //Pag2 variabl

        this.registrLink = page.getByRole('link', { name: 'Register' });
        this.txtFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.txtLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.txtemail = page.getByRole('textbox', { name: 'Email' });
        this.txtPassword = page.getByRole('textbox', { name: 'Password' });
        this.txtPhonNumber = page.getByRole('textbox', { name: 'Phone Number' });
        this.txtAddress = page.getByRole('textbox', { name: 'Address' });
        this.radioGender = page.getByRole('radio');
        this.chckbox = page.getByRole('checkbox');
        this.btnRgistr = page.getByRole('button', { name: 'Register' });
    }

    async doRegister(user) {
        await this.registrLink.click();
        await this.txtFirstName.fill(user.firstname);
        await this.txtLastName.fill(user.lastname)
        await this.txtemail.fill(user.email)
        await this.txtPassword.fill(user.password)
        await this.txtPhonNumber.fill(user.phonenumber)
        // Only fill address if it exists
        if (user.address) {
            await this.txtAddress.fill(user.address);
        }
        await this.radioGender.first().check();
        await this.chckbox.check();
        await this.btnRgistr.click();
    }
}

export default RegisterPage;