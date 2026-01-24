/* eslint-disable @typescript-eslint/no-explicit-any */
import { test as setup, expect } from '@playwright/test';
import path from 'path';

// This will make sure that each test-environment such as webkit, firefox
// will be authenticated
setup("authenticate", async ({ page }, testInfo) => {

  const userEmail = testInfo.project.metadata?.userEmail;
  const userKey = testInfo.project.metadata?.userKey;
  const userName = testInfo.project.metadata?.userName;

  // To find out where the user should be written
  const browserName = testInfo.project.name.replace('setup-', '');
  const storagePath = path.resolve(__dirname, '.auth', `${browserName}.json`);

  await page.goto("/sign-in");

  await page.getByTestId("email").fill(userEmail);
  await page.getByTestId("key").fill(userKey);

  await page.getByTestId('sign-in').click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByTestId("user-card")).toBeVisible();

  await page.evaluate(({ email, name }) => {
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_name', name || 'Default User');
  }, { email: userEmail, name: userName });

  // Write the whole storage into the file
  await page.context().storageState({ path: storagePath });
});