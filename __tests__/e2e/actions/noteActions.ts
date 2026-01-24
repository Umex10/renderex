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

  // 1. TEST - CREATE NOTE

  async createNote(title: string, tags: string[]) {

    const addButton = this.page.getByTestId("add-button");

    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    const createConfirmationButton = this.page.getByTestId("create-confirmation-button");

    // Wait for Dialog elements
    for (const element of [this.titleInput, this.tagsInput, createConfirmationButton]) {
      await expect(element).toBeVisible({ timeout: 10000 });
    }

    await this.titleInput.click();
    await this.titleInput.pressSequentially(title, { delay: 50 });
    await expect(this.titleInput).toHaveValue(title, {timeout: 10000});

    for (const tag of tags) {
      await this.tagsInput.pressSequentially(tag, { delay: 50 });
      await this.tagsInput.press(",");
      // Since "," is like a Enter
      await expect(this.tagsInput).toHaveValue("");
    }

    await expect(createConfirmationButton).toBeEnabled();
    const creatingNoteStatus = this.page.getByTestId("creating-note-status");
    await createConfirmationButton.click();
    await expect(creatingNoteStatus).toBeVisible({ timeout: 10000 });

    for (const element of [this.titleInput, this.tagsInput, createConfirmationButton]) {
      await expect(element).not.toBeVisible({ timeout: 10000 });
    }

    const sidebarNote = this.page.getByText(new RegExp(title, 'i'));
    await expect(sidebarNote).toBeVisible({timeout: 10000 });
  }

  // 2. TEST - DELETE NOTE

  async deleteNote(title: string) {
    const noteCard = this.page.getByTestId('note-card').filter({ hasText: new RegExp(title, 'i') }).first();

    await expect(noteCard).toBeVisible({ timeout: 10000 });

    // search for the delete button and status inside of the card we've filtered
    const deleteButton = noteCard.getByTestId("delete-button");
    const deletingStatus = noteCard.getByTestId("deleting-note-status");

    await deleteButton.click();
    await expect(deletingStatus).toBeVisible({ timeout: 10000 });
    await expect(noteCard).not.toBeVisible({ timeout: 10000 });
  }

  // 3. TEST - EDIT NOTE

  async editNote(oldTitle: string, newTitle: string, newTags: string[]) {

    const noteCard = this.page.getByTestId('note-card').filter({ hasText: new RegExp(oldTitle, 'i') }).first();

    await expect(noteCard).toBeVisible({ timeout: 10000 });

    const editButton = noteCard.getByTestId("edit-button");
    await expect(editButton).toBeVisible({ timeout: 10000 });

    await editButton.click();

    const editConfirmationButton = this.page.getByTestId("edit-confirmation-button");

    // Wait for Dialog elements
    for (const element of [this.titleInput, this.tagsInput, editConfirmationButton]) {
      await expect(element).toBeVisible({ timeout: 10000 });
    }

    await expect(this.titleInput).toHaveValue(oldTitle);
    await this.titleInput.click();

    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.press('Backspace');
    
    await this.titleInput.pressSequentially(newTitle, { delay: 50 });
    await expect(this.titleInput).toHaveValue(newTitle, {timeout: 10000});


    for (const tag of newTags) {
      await this.tagsInput.pressSequentially(tag, { delay: 50 });
      await this.tagsInput.press(",");
      // Since "," is like a Enter
      await expect(this.tagsInput).toHaveValue("");
    }


    await expect(editConfirmationButton).toBeEnabled();
    await editConfirmationButton.click();

    for (const element of [this.titleInput, this.tagsInput, editConfirmationButton]) {
      await expect(element).not.toBeVisible({ timeout: 10000 });
    }

    const editedNote = this.page.getByText(new RegExp(newTitle, 'i'));
    await expect(editedNote).toBeVisible({timeout: 10000});

  }
}