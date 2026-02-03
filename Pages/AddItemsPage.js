class AddItemsPage {
    constructor(page) {
        this.page = page;

        this.btnAddCost = page.getByRole('button', { name: 'Add Cost' });
        this.txtItem = page.getByRole('textbox', { name: 'Item Name' });
        this.iconPlus = page.getByRole('button', { name: '+' });
        this.txtAmount = page.getByRole('spinbutton', { name: 'Amount' });
        this.purchaseDate = page.getByRole('textbox', { name: 'Purchase Date' })
        this.dropdownMonth = page.getByLabel('Month')
        this.txtRemarks = page.getByRole('textbox', { name: 'Remarks' })
        this.btnSubmit = page.getByRole('button', { name: 'Submit' });
        this.btnReset = page.getByRole('button', { name: 'Reset' });
        this.searchBox = page.getByRole('textbox', { name: 'Search items...' });
        this.linkView = page.getByRole('button', { name: 'View' });
        this.btnEdit = page.getByRole('button', { name: 'Edit' });
        this.btnDelete = page.getByRole('button', { name: 'Delete' });
        this.tableRows = page.locator('tbody tr');
        this.btnUpdate = page.getByRole('button', { name: 'Update' });
        this.btnBack= page.getByRole('button', { name: 'Back' });
        this.tableRows = page.locator('tbody tr');
    }

    async addNewCost(itemname, amount, remarks, date, month) {
        // await this.btnAddCost.click();
        await this.txtItem.fill(itemname);
        await this.iconPlus.click();
        await this.txtAmount.fill(amount);
        await this.purchaseDate.fill(date);
        await this.dropdownMonth.selectOption({ label: month });
        await this.txtRemarks.fill(remarks);
    }
}
export default AddItemsPage;