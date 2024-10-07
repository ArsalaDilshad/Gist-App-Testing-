import { USERNAME, PASSWORD } from '../config/constants.js';

/**
 * Logs in to GitHub using the provided page object.
 * 
 * This asynchronous function navigates to the GitHub login page, fills in the 
 * username and password fields, and submits the login form. It also waits for the 
 * "All gists" link to appear on the page to confirm that the login was successful.
 * @async
 * @function
 * @param {Page} page - The Playwright page object used to interact with the GitHub website.
 * @returns {Promise<void>} Resolves once the login process is complete and the "All gists" link is visible.
 */
export async function loginToGitHub(page) {
  await page.goto("/starred");  
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByLabel('Username or email address').fill(USERNAME);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForSelector('//a[text()="All gists"]');
  console.log('Login successful');

}

