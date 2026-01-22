import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth', 'user.json');

// This will make sure that each test-environment such as webkit, firefox
// will be authenticated
setup("authenticate", async ({page}) => {

  await page.goto("/sign-in");

  await page.getByTestId("email").fill("test-user-1@test.com");
  await page.getByTestId("key").fill("TestUser+123")

  await page.getByTestId('sign-in').click();

  await page.waitForURL("**/dashboard")

  await expect(page.getByTestId("user-card")).toBeVisible();

  // Will load the context of the page, where storageState then will 
  // extract cookies and the localstorage and write it into the authFile
  await page.context().storageState({path: authFile})
})