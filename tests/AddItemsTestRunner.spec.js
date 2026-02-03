import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import jsonData from '../Utils/userData.json' assert { type: 'json' };
import AddItemsPage from '../Pages/AddItemsPage';
import { generateRandomID, randomFutureDate } from '../Utils/utils';

let loginPage;
let page;
let context;
let addItemsPage;

// Helper function to generate random food name
function randomFoodName() {
    const foods = [
        'Pizza', 'Burger', 'Sushi', 'Pasta', 'Sandwich',
        'Salad', 'Taco', 'Biryani', 'Noodles', 'Dumpling',
        'Steak', 'Curry', 'IceCream', 'Donut', 'Paneer'
    ];
    const randomIndex = Math.floor(Math.random() * foods.length);
    return foods[randomIndex] + '-' + Math.floor(Math.random() * 1000); // add random number to make unique
}

test.beforeAll(async ({ browser }) => {
    // New browser context & make page
    context = await browser.newContext();
    page = await context.newPage();
    // LoginPage Object call
    addItemsPage = new AddItemsPage(page);

    // Login before each test if required
    loginPage = new LoginPage(page);
    await page.goto("/");
    const latestData = jsonData[jsonData.length - 1];
    await loginPage.doLogin(latestData.email, latestData.password, { waitUntil: 'networkidle' });
});

test("User can reset input", async () => {
    addItemsPage = new AddItemsPage(page);
    await addItemsPage.btnAddCost.click();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // Generate 1 random items
    const item = {
        itemname: `Item-${randomFoodName()}`,
        amount: `${generateRandomID(100, 999)}`,
        date: randomFutureDate(),
        month: months[Math.floor(Math.random() * months.length)],
        remarks: 'Item 1'
    }

    // Fill the form without clicking Submit
    await addItemsPage.addNewCost(item.itemname, item.amount, item.remarks, item.date, item.month);

    // Click Reset
    await addItemsPage.btnReset.click();
})

test("User add item", async () => {
    addItemsPage = new AddItemsPage(page);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // Generate 2 random items
    const items = [
        {
            itemname: `Item-${randomFoodName()}`,
            amount: `${generateRandomID(100, 999)}`,
            date: randomFutureDate(),
            month: months[Math.floor(Math.random() * months.length)],
            remarks: 'Item 1'
        },
        {
            itemname: `Item-${randomFoodName()}`,
            amount: `${generateRandomID(100, 999)}`,
            date: randomFutureDate(),
            month: months[Math.floor(Math.random() * months.length)],
            remarks: 'Item 2'
        }
    ];

    // Add items
    for (const item of items) {
        await addItemsPage.addNewCost(item.itemname, item.amount, item.remarks, item.date, item.month);
        await addItemsPage.btnSubmit.click();
    }

    // Dynamic assertion using text/content
    for (const item of items) {
        // Locate the row by item name only
        const row = page.locator('tbody tr', {
            has: page.locator('td', { hasText: item.itemname })
        }).first();

        // Wait until row exists
        await expect(row).toHaveCount(1, { timeout: 10000 });

        // Get all cells in that row
        const cells = row.locator('td');

        // Assert each detail dynamically
        await expect(cells.nth(0)).toHaveText(item.itemname); // Item Name
        await expect(cells.nth(2)).toHaveText(item.amount);   // Amount
        await expect(cells.nth(5)).toHaveText(item.remarks);  // Remarks
    }
})

test("User search invalid item", async () => {
    addItemsPage = new AddItemsPage(page);
    // Fill the search box with an invalid item
    await addItemsPage.searchBox.fill('assa');

    // Assert that the table shows "No costs found."
    const noCostsMessage = page.locator('tbody tr', { hasText: 'No costs found.' });
    await expect(noCostsMessage).toHaveText('No costs found.');
})

test("User search valid item", async () => {
    addItemsPage = new AddItemsPage(page);

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });

    const firstCell = firstRow.locator('td').first();
    const itemName = (await firstCell.innerText()).trim();

    // Safety Check
    expect(itemName.length).toBeGreaterThan(0);
    console.log(`Searching for item: ${itemName}`);

    // ৪. Clear searchbox
    await addItemsPage.searchBox.clear();
    await addItemsPage.searchBox.fill(itemName);

    await page.waitForTimeout(1000);

    // Assertion Check
    const resultCell = page.locator('tbody tr').first().locator('td').first();
    await expect(resultCell).toHaveText(itemName, { timeout: 10000 });
})

test("User can edit Item", async () => {
    addItemsPage = new AddItemsPage(page);

    // Wait until at least 1 row is visible
    await expect(addItemsPage.tableRows.first()).toBeVisible({ timeout: 10000 });

    // Select Random Row
    const rowCount = await addItemsPage.tableRows.count();
    const randomIndex = Math.floor(Math.random() * rowCount);
    const selectedRow = addItemsPage.tableRows.nth(randomIndex);

    // Check Present Data (Optional)
    const initialText = await selectedRow.innerText();
    console.log("Before Edit:", initialText);

    // Go TO Edit Mode
    await selectedRow.locator('text=View').click();
    await addItemsPage.btnEdit.click();

    // New Value Generate
    const newAmount = generateRandomID(100, 999).toString();
    const uniqueRemark = `TestEdit-${Date.now()}`;

    // Alert Handling (It must be set before clicking)
    page.once('dialog', async dialog => {
        console.log(`Alert Message: ${dialog.message()}`);
        await dialog.accept();
    });

    // Filed Update and Click update
    await addItemsPage.txtAmount.fill(newAmount);
    await addItemsPage.txtRemarks.fill(uniqueRemark);
    await addItemsPage.btnUpdate.click();

    // Wait briefly after the alert appears and the processing finishes before clicking the Back button.
    await page.waitForTimeout(1000); // Buffer time for the alert to close
    await addItemsPage.btnBack.click();

    // Dynamic Row Select
    const updatedRow = page.locator('tr', { hasText: uniqueRemark });

    // Final Assertion
    await expect(updatedRow).toBeVisible({ timeout: 15000 });
    await expect(updatedRow).toContainText(newAmount);
    await expect(updatedRow).toContainText(uniqueRemark);
})

test("User can delete Item", async () => {
    addItemsPage = new AddItemsPage(page);

    // Wait until at least 1 row is visible
    await expect(addItemsPage.tableRows.first()).toBeVisible({ timeout: 10000 });

    // Total rows BEFORE delete
    const totalBeforeText = await page.locator('text=Total Rows:').innerText();
    const totalBefore = Number(totalBeforeText.replace(/\D/g, ''));
    console.log("Before delete:", totalBefore);

    // Random row selection
    const randomIndex = Math.floor(Math.random() * totalBefore);
    const selectedRow = addItemsPage.tableRows.nth(randomIndex);

    // Get item name
    const itemName = (await selectedRow.locator('td').first().innerText()).trim();
    expect(itemName).toBeTruthy();

    // Open modal
    await selectedRow.locator('text=View').click();

    // Handle confirmation dialog
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });

    // Click delete
    await addItemsPage.btnDelete.click();

    // Wait until row count decreases
    await expect(addItemsPage.tableRows)
        .toHaveCount(totalBefore - 1, { timeout: 15000 });

    // Final verification via label
    const totalAfterText = await page.locator('text=Total Rows:').innerText();
    const totalAfter = Number(totalAfterText.replace(/\D/g, ''));
    expect(totalAfter).toBe(totalBefore - 1);
})
