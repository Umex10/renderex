import { test, expect } from '@playwright/test';
import { NoteActions } from './actions/noteActions';

test.describe("Note", () => {

  test("should create a new note and delete it", async ({ page }) => {

    // knows how to create/delete/edit notes
    const noteActions = new NoteActions(page);

    // SETUP: Test Data
    const title = `Note ${Date.now()} - ${test.info().project.name}`;
    const tags = ["java", "react", "testing"];


    await noteActions.navigate();

    await noteActions.createNote(title, tags);

    const sidebarNote = page.getByText(title).first();
    await expect(sidebarNote).toBeVisible({ timeout: 10000 });

    // Cleanup
    await noteActions.deleteNote(title);

  })

  test("should edit a note and delete it", async ({ page }) => {

    // knows how to create/delete/edit notes
    const noteActions = new NoteActions(page);

    // SETUP: Test Data
    const title = `Note ${Date.now()} - ${test.info().project.name}`;
    const tags = ["java", "react", "testing"];


    await noteActions.navigate();

    await noteActions.createNote(title, tags);

    const sidebarNote = page.getByText(title).first();
    await expect(sidebarNote).toBeVisible({ timeout: 10000 });

    const newTitle = `${title} - edited`;
    const newTags = ["newTag", "html"];

    await noteActions.editNote(title, newTitle, newTags);

    const editedNote = page.getByText(newTitle).first();
    await expect(editedNote).toBeVisible({ timeout: 10000 });

    // Cleanup
    await noteActions.deleteNote(title);

  })

})