import { loginToGitHub } from '../src/utils/github_login.js';
import { GIST_DESCRIPTION, GIST_FILE_EXTENSION, GIST_CONTENT } from '../src/config/constants.js';
import { test, expect } from '@playwright/test';
const CreateGistPage = require('../src/pages/create_gist_page.js');
const BasePage = require('../src/pages/base_page.js');

test.describe('Create Gist', () => {
  let createGist;
  let basePageGist;

/**
 * Setup function that runs before each test in the suite.
 * 
 * This asynchronous function logs in to GitHub using the provided page object,
 * waits for the "All gists" link to be visible, and initializes instances 
 * of the `CreateGistPage` and `BasePage` classes. This setup ensures that 
 * each test starts with a fresh state and the necessary context for interacting 
 * with the application.
 * 
 * @async
 * @function
 * @param {Object} context - The context object provided by Playwright.
 * @param {Page} context.page - The Playwright page object used to interact with the web page.
 * @returns {Promise<void>} Resolves once the setup actions have been completed.
 */
  test.beforeEach(async ({ page }) => {
    await loginToGitHub(page);
    await page.waitForSelector('//a[text()="All gists"]');
    createGist = new CreateGistPage(page);
    basePageGist = new BasePage(page);
  });

/**
 * Test case for creating a new gist on GitHub.
 * 
 * This test navigates to the create gist page, adds a description, file extension,
 * and content for the gist, and submits the form. After submission, it verifies 
 * that the newly created gist displays the expected filename in the user interface.
 *
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the test assertions have been executed.
 */
  test('Create new gist', async () => {
    await createGist.clickCreateGistPage();
    await basePageGist.addGistDescription(GIST_DESCRIPTION);
    await basePageGist.addFileExtension(GIST_FILE_EXTENSION);
    await basePageGist.addGistContent(GIST_CONTENT);
    await createGist.clickAddGistButton();
    const fileName = await createGist.page.locator('//a[text()="README.md"]');
    await expect(fileName).toHaveText("README.md");
  });

});
