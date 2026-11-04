import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5203';

test.describe('Notes management', () => {
  let createdNoteId: string | null = null;

  test.afterEach(async ({ request }) => {
    if (createdNoteId) {
      await request.delete(`${API_URL}/notes/${createdNoteId}`).catch(() => {});
      createdNoteId = null;
    }
  });

  test('should create a new note and display it in the notes list', async ({ page }) => {
    // Arrange
    const uniqueSuffix = Date.now().toString().slice(-8);
    const noteTitle = `E2E Note ${uniqueSuffix}`;
    const noteText = `Created by Playwright E2E test (${uniqueSuffix})`;

    await page.goto('/notes');

    // Act
    await page.getByTestId('create-note-link').click();
    await expect(page).toHaveURL(/\/notes\/new$/);

    await page.getByTestId('note-title-input').fill(noteTitle);
    await page.getByTestId('note-text-input').fill(noteText);

    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/notes') && response.request().method() === 'POST',
    );

    await page.getByTestId('save-note-button').click();

    const createResponse = await createResponsePromise;
    expect(createResponse.status()).toBe(201);
    const createdNote = (await createResponse.json()) as { id?: string };
    createdNoteId = createdNote.id ?? null;

    // Assert
    await expect(page).toHaveURL(/\/notes$/);

    const createdNoteCard = page
      .getByTestId('note-card')
      .filter({ has: page.getByTestId('note-title').filter({ hasText: noteTitle }) });

    await expect(createdNoteCard).toBeVisible();
    await expect(createdNoteCard.getByTestId('note-text')).toHaveText(noteText);
  });
});
