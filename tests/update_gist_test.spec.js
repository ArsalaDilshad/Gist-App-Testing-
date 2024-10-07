import { loginToGitHub } from '../src/utils/github_login.js';
const UpdateGistPage = require('../src/pages/update_gist_page.js');
const BasePage = require('../src/pages/base_page.js');
import { test, expect } from '@playwright/test';
import { GIST_FILE_EXTENSION, UPDATE_DESCRIPTION } from '../src/config/constants.js';
import { generateRandomString } from "../src/utils/random_generator_util";

test.describe('Update Gist', () => {
  let updateGist;
  let basePageGist;

  test.beforeEach(async ({ page }) => {
    await loginToGitHub(page);
    await page.waitForSelector('//a[text()="All gists"]');
    updateGist = new UpdateGistPage(page);
    basePageGist = new BasePage(page);
  });
  
  test('update gist', async () => {
    await updateGist.clickViewProfile();
    await updateGist.clickViewYourGists();
    await updateGist.clickUpdateGist();
    await updateGist.clickEditButton();
    const fileExtension = generateRandomString().concat("_").concat(GIST_FILE_EXTENSION);
    await basePageGist.addFileExtension(fileExtension);
    await updateGist.clickUpdateGistButton();
    const fileName = await updateGist.page.locator('a').filter({ hasText: new RegExp(`^${fileExtension}$`) });
    await expect(fileName).toHaveText(fileExtension);
  });
});