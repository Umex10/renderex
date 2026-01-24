import { expect, Locator, Page } from '@playwright/test';

export class NoteActions {
  readonly page: Page;
  readonly addButton: Locator;
  readonly titleInput: Locator;
  readonly tagsInput: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByTestId("add-button");
    this.titleInput = page.getByTestId("note-title");
    this.tagsInput = page.getByTestId("note-tags");
    this.createButton = page.getByTestId("create-button");
  }


  async navigate() {
    await this.page.goto("/dashboard");
    await this.page.waitForURL("/dashboard");
    await expect(this.page.getByTestId("user-card")).toBeVisible({ timeout: 10000 });
  }

  async createNote(title: string, tags: string[]) {

    await expect(this.addButton).toBeVisible({ timeout: 5000 });
    await this.addButton.click();

    // Wait for Dialog elements
    for (const element of [this.titleInput, this.tagsInput, this.createButton]) {
      await expect(element).toBeVisible({ timeout: 5000 });
    }

    // STEP 1: Fill Title
    await this.titleInput.fill(title);
    await expect(this.titleInput).toHaveValue(title);

    // STEP 2: Fill Tags
    for (const tag of tags) {
      await this.tagsInput.pressSequentially(tag, { delay: 50 });
      await this.tagsInput.press(",");
      // Since "," is like a Enter
      await expect(this.tagsInput).toHaveValue("");
    }

    // STEP 3: Submit
    await expect(this.createButton).toBeEnabled();
    const creatingNoteStatus = this.page.getByTestId("creating-note-status");
    await this.createButton.click();
    await expect(creatingNoteStatus).toBeVisible({ timeout: 5000 });

    // STEP 4: Verify Dialog closed
    for (const element of [this.titleInput, this.tagsInput, this.createButton]) {
      await expect(element).not.toBeVisible({ timeout: 5000 });
    }
  }
  
  async deleteNote(title: string) {
  const noteCard = this.page.getByTestId('note-card').filter({hasText: title}).first();

  // search for the delete button and status inside of the card we've filtered
  const deleteButton = noteCard.getByTestId("delete-button");
  const deletingStatus = noteCard.getByTestId("deleting-note-status");
  
  await deleteButton.click();
  await expect(deletingStatus).toBeVisible({ timeout: 5000 });
  await expect(noteCard).not.toBeVisible({ timeout: 10000 });
  }
}