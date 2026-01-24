import { test, expect } from '@playwright/test';
import { NoteActions } from './actions/noteActions';

test.describe("Note", () => {

  test("should add/edit/delete some notes", async ({ page }) => {

    // knows how to create/delete/edit notes
    const noteActions = new NoteActions(page);

    // Test Data for create
    const uniqueId = `${Date.now()} - ${test.info().project.name}`
    const title = `Note ${uniqueId}`;
    const tags = [`Java ${uniqueId}`,
    `React ${uniqueId}`,
    `Motivation ${uniqueId}`];

    await noteActions.navigate();

    // Note Creation
    await noteActions.createNote(title, tags);

    // Test Data for edit
    const newTitle = `${title} - edited`;
    const newTags = [
      `NewTag ${uniqueId}`
      ,`userInfo ${uniqueId}`];

    await noteActions.editNote(title, newTitle, newTags);

    // Cleanup
    await noteActions.deleteNote(newTitle);

    for (const tag of [...tags, ...newTags]) {
      const userTag = page.getByTestId("usertag").filter({ hasText: new RegExp(tag, 'i') }).first();

      await expect(userTag).toBeVisible({ timeout: 10000 });

      const deleteTagButton = userTag.getByTestId("delete-tag-button");
      await deleteTagButton.click();

      await expect(userTag).not.toBeVisible({ timeout: 10000 });
    }
  });

})