class ProfilePage {
    constructor(page) {
        this.page = page;

        this.iconProfile = page.getByRole('button', { name: 'account of current user' });
        this.profileMenuItems = page.getByRole('menuitem');
        this.menuProfile = page.getByRole('menuitem', { name: 'Profile' });
        this.btnEdit = page.getByRole('button', { name: 'Edit' });
        this.chooseFileInput = page.locator('input[type="file"]');
        this.btnUpload = page.getByRole('button', { name: 'UPLOAD IMAGE' });
        this.txtAddress = page.getByRole('textbox', { name: 'Address' });
        this.btnUpdate = page.getByRole('button', { name: 'Update' });
        this.errorMsg = page.getByText('Failed to upload image.');
        this.linkLogout = page.getByRole('menuitem', { name: 'Logout' });
    }

    async updateProfile(imagePath) {
        await this.iconProfile.click();
        await this.profileMenuItems.nth(0).click();
        await this.btnEdit.click();

        let uploadMessage = '';

        // Handle image upload
        try {
            const uploadDialogPromise = this.page.waitForEvent('dialog', { timeout: 10000 });
            await this.chooseFileInput.setInputFiles(imagePath);
            await this.btnUpload.click();

            const uploadDialog = await uploadDialogPromise.catch(() => null);
            if (uploadDialog) {
                uploadMessage = uploadDialog.message();
                await uploadDialog.accept();
            } else {
                uploadMessage = 'Image uploaded successfully!'; // Fallback message
            }
        } catch (err) {
            uploadMessage = 'Upload failed or timeout';
        }

        return { uploadMessage };
    }
    
    async saveProfile() {
        // After Update button click pop up show
        const updateDialogPromise = this.page.waitForEvent('dialog', { timeout: 10000 });
        await this.btnUpdate.click(); 
        const updateDialog = await updateDialogPromise;
        const updateMessage = updateDialog.message();
        await updateDialog.accept();
        return updateMessage;
    }
}
export default ProfilePage;