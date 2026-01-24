import { expect, Locator, Page } from '@playwright/test';

export class NoteActions {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly tagsInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId("note-title");
    this.tagsInput = page.getByTestId("note-tags");
  }

  async navigate() {
    await this.page.goto("/dashboard");
    await this.page.waitForURL("/dashboard");
    await expect(this.page.getByTestId("user-card")).toBeVisible({ timeout: 10000 });
  }

  async createNote(title: string, tags: string[]) {

    const addButton = this.page.getByTestId("add-button");

    await expect(addButton).toBeVisible({ timeout: 5000 });
    await addButton.click();

    const createConfirmationButton = this.page.getByTestId("create-confirmation-button");

    // Wait for Dialog elements
    for (const element of [this.titleInput, this.tagsInput, createConfirmationButton]) {
      await expect(element).toBeVisible({ timeout: 5000 });
    }

    await this.titleInput.fill(title);
    await expect(this.titleInput).toHaveValue(title);

    for (const tag of tags) {
      await this.tagsInput.pressSequentially(tag, { delay: 50 });
      await this.tagsInput.press(",");
      // Since "," is like a Enter
      await expect(this.tagsInput).toHaveValue("");
    }

    await expect(createConfirmationButton).toBeEnabled();
    const creatingNoteStatus = this.page.getByTestId("creating-note-status");
    await createConfirmationButton.click();
    await expect(creatingNoteStatus).toBeVisible({ timeout: 5000 });

    for (const element of [this.titleInput, this.tagsInput, createConfirmationButton]) {
      await expect(element).not.toBeVisible({ timeout: 5000 });
    }
  }

  async deleteNote(title: string) {
    const noteCard = this.page.getByTestId('note-card').filter({ hasText: title }).first();

    // search for the delete button and status inside of the card we've filtered
    const deleteButton = noteCard.getByTestId("delete-button");
    const deletingStatus = noteCard.getByTestId("deleting-note-status");

    await deleteButton.click();
    await expect(deletingStatus).toBeVisible({ timeout: 5000 });
    await expect(noteCard).not.toBeVisible({ timeout: 10000 });
  }

  async editNote(oldTitle: string, newTitle: string, newTags: string[]) {

    const noteCard = this.page.getByTestId('note-card').filter({ hasText: oldTitle }).first();

    const editButton = noteCard.getByTestId("edit-button");
    await expect(editButton).toBeVisible({ timeout: 5000 });

    await editButton.click();

    const editConfirmationButton = this.page.getByTestId("edit-confirmation-button");

    // Wait for Dialog elements
    for (const element of [this.titleInput, this.tagsInput, editConfirmationButton]) {
      await expect(element).toBeVisible({ timeout: 5000 });
    }

    await expect(this.titleInput).toHaveValue(oldTitle);
    await this.titleInput.clear();
    await this.titleInput.fill(newTitle);
    await expect(this.titleInput).toHaveValue(newTitle);


    for (const tag of newTags) {
      await this.tagsInput.pressSequentially(tag, { delay: 50 });
      await this.tagsInput.press(",");
      // Since "," is like a Enter
      await expect(this.tagsInput).toHaveValue("");
    }

    await expect(editConfirmationButton).toBeEnabled();
    await editConfirmationButton.click();

    for (const element of [this.titleInput, this.tagsInput, editConfirmationButton]) {
      await expect(element).not.toBeVisible({ timeout: 5000 });
    }

  }
}