import { loginToGitHub } from '../src/utils/github_login.js';
import { test } from '@playwright/test';

/**
 * Test suite for GitHub login functionality.
 * 
 * This suite contains tests related to user authentication on GitHub.
 * The test ensures that the login process is successful by executing
 * the `loginToGitHub` function and checking for expected outcomes.
 * 
 * @async
 * @function
 */
test.describe('Login GitHub', () => {
  test('login is successful', async ({ page }) => {
    await loginToGitHub(page);

  });

});