import { expect } from '@playwright/test';
import { GIST_DESCRIPTION, GIST_FILE_EXTENSION, GIST_CONTENT } from '../config/constants.js';  // Import the constants

class CreateGistPage {

/**
 * Initializes a new instance of the GistPage class.
 * 
 * This constructor sets up the Playwright page object and locators for 
 * various elements required to interact with the Gist creation page. 
 * The `page` parameter represents the current Playwright page context, 
 * allowing the class to interact with the web page. Specific locators 
 * for the 'Create Page' icon and the 'Add Gist' button are also defined.
 * 
 * @param {Page} page - The Playwright page object for interacting with the web page.
 */
  constructor(page) {
    this.page = page;
    this.createPageIcon = this.page.locator('div.Header-item.mr-0.mr-md-1 a');
    this.addGistButton = page.getByRole('button', { name: 'Create secret gist' });
  }

  /**
 * Navigates to the Create Gist page.
 * 
 * This asynchronous method clicks on the 'Create Page' icon, which triggers
 * navigation to the page where a new gist can be created. It assumes that the
 * 'createPageIcon' selector has already been located and is ready for interaction.
 * 
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the navigation has been triggered.
 */
  async clickCreateGistPage() {
    await this.createPageIcon.click();
  }

  /**
 * Clicks the 'Add Gist' button after a brief delay.
 * 
 * This asynchronous method introduces a 2-second delay before clicking the 
 * 'Add Gist' button. The delay allows for any potential page load or 
 * transition animations to complete, ensuring that the button is ready 
 * for interaction. It assumes that the 'addGistButton' selector has been 
 * correctly initialized and is available.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the button has been clicked.
 */
  async clickAddGistButton() {
    await this.page.waitForTimeout(2000);
    await this.addGistButton.click();
  }

}
module.exports = CreateGistPage;
