import { test, expect } from '@playwright/test';

test.describe("Note", () => {

  test("should create a new note", async ({ page }) => {

    // SETUP: Test Data
    const title = "Software Design";
    const tags = ["java", "react", "testing"];


    // STEP 1: Navigate to Dashboard
    await page.goto("/dashboard");
    await page.waitForURL("/dashboard");
    await expect(page.getByTestId("user-card")).toBeVisible({ timeout: 10000 });


    // STEP 2: Open Note Creation Dialog
    const addButton = page.getByTestId("add-button");
    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();


    // STEP 3: Wait for Dialog Elements
    const noteTitle = page.getByTestId("note-title");
    const noteTags = page.getByTestId("note-tags");
    const createButton = page.getByTestId("create-button");

    for (const element of [noteTitle, noteTags, createButton]) {
      await expect(element).toBeVisible({ timeout: 5000 });
    }


    // STEP 4: Fill in Note Title
    await noteTitle.click();
    await noteTitle.fill(title);
    await expect(noteTitle).toHaveValue(title);

    // STEP 5: Fill in Note Tags
    await noteTags.click();

    for (const tag of tags) {
      await noteTags.pressSequentially(tag, { delay: 50 });
      await noteTags.press(",");
      await expect(noteTags).toHaveValue("");
      await page.waitForTimeout(100);
    }

    // STEP 6: Submit Note Creation
    await expect(createButton).toBeEnabled();

    const creatingNoteStatus = page.getByTestId("creating-note-status");
    await createButton.click();
    await expect(creatingNoteStatus).toBeVisible({ timeout: 5000 });


    // STEP 7: Verify Dialog Closed
    for (const element of [noteTitle, noteTags, createButton]) {
      await expect(element).not.toBeVisible({ timeout: 5000 });
    }

    // STEP 8: Verify Note Appears in Sidebar
    const outsideNotetitle = page.getByText(title).first();
    await expect(outsideNotetitle).toBeVisible({ timeout: 10000 });

    // STEP 9: Delete Created Note (Cleanup)
    const deleteButton = page.getByTestId("delete-button");
    const deletingNoteStatus = page.getByTestId("deleting-note-status");

    await deleteButton.click();
    await expect(deletingNoteStatus).toBeVisible({ timeout: 5000 });
    await expect(outsideNotetitle).not.toBeVisible({ timeout: 10000 });
  })

})