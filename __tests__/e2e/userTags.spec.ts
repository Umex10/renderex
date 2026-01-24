import { test, expect } from '@playwright/test';

test.describe("UserTags", () => {

  test("should add/edit/delete some usertags", async ({ page }) => {

    await page.goto("/dashboard");
    await page.waitForURL("/dashboard");

    const userTagArea = page.getByTestId("usertag-area");
    const userTagInput = page.getByTestId("usertag-input");

     const uniqueId = `${Date.now()} - ${test.info().project.name}`

    const tags = [`motivation - ${uniqueId}`,
    `area - ${Date.now()} - ${uniqueId}`,
    `color - ${Date.now()} - ${uniqueId}`];

    for (const tag of tags) {
      await userTagInput.pressSequentially(tag, { delay: 50 });
      await userTagInput.press(",");
      // Since "," is like a Enter
      await expect(userTagInput).toHaveValue("");

      const userTag = userTagArea.getByTestId("usertag").filter({ hasText: new RegExp(tag, 'i') });

      await expect(userTag).toBeVisible({ timeout: 10000 });

      const color = userTag.getByTestId("color");

      await color.fill("#ff0000", { force: true });

      await expect(color).toHaveValue("#ff0000", { timeout: 10000 });

      const deleteTagButton = userTag.getByTestId("delete-tag-button");

      await deleteTagButton.click();

      await expect(userTag).not.toBeVisible({ timeout: 10000 });


    }
  });

})