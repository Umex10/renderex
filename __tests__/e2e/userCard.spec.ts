import { test, expect } from '@playwright/test';

test.describe('Authentication Verification', () => {
  
  test('should the the user in a userCard in the sidebar', async ({ page }) => {

    await page.goto('/dashboard');

    // UserCard in the Sidebar
    const userCard = page.getByTestId("user-card");
    const userUsername = page.getByTestId("user-username");
    const userEmail = page.getByTestId("user-email");

    await expect(userCard).toBeVisible();
    await expect(userUsername).toHaveText("testUser");
    await expect(userEmail).toHaveText("test-user-1@test.com");

  });
});