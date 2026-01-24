import { test, expect } from '@playwright/test';

test.describe('Authentication Verification', () => {

  test('should the the user in a userCard in the sidebar', async ({ page }) => {

    await page.goto('/dashboard');

    await page.waitForURL("**/dashboard");

    const email = await page.evaluate(() => localStorage.getItem('user_email'));
    const name = await page.evaluate(() => localStorage.getItem('user_name'));

    if (!email || !name) {
      throw new Error("Email or name is undefined");
    }

    // UserCard in the Sidebar
    const userCard = page.getByTestId("user-card");
    const userUsername = page.getByTestId("user-username");
    const userEmail = page.getByTestId("user-email");

    await expect(userCard).toBeVisible();
    await expect(userEmail).toHaveText(new RegExp(email, 'i'));
    await expect(userUsername).toHaveText(new RegExp(name, 'i'));

  });
});