import { expect } from '@playwright/test';

class UpdateGistPage {

/**
 * Initializes a new instance of the GistManager class with required locators 
 * for managing gists, including viewing user profiles and updating gists.
 * 
 * The constructor sets up the Playwright page object and locators needed to 
 * interact with elements on the user profile and gists management interface. 
 * It initializes locators for buttons and menu items related to gists.
 * 
 * @param {Page} page - The Playwright page object for interacting with the web page.
 * 
 */
  constructor(page) {
    this.page = page;
    this.userProfile = page.getByRole('button', { name: 'View profile and more' });
    this.viewYourGists = page.getByRole('menuitem', { name: 'Your gists' });
    this.updateGist = this.page.locator('//*[@id="gist-pjax-container"]/div/div/div[2]/div[2]/div[1]/div/div[2]/span[1]/a[2]/strong');
    this.editGist = this.page.getByLabel('Edit this Gist');
    this.updateGistButton = page.getByRole('button', { name: 'Update secret gist' });
  }

  /**
 * Clicks the user profile button to view profile options and waits for the 
 * "Your gists" menu item to become visible.
 * 
 * This asynchronous method simulates a click on the user profile button 
 * and then waits for the "Your gists" menu item to appear in the interface, 
 * indicating that the profile options are now available. This is useful for 
 * ensuring that the subsequent actions related to gists can be performed 
 * only after the profile menu has loaded.

 * @async
 * @function
 * @returns {Promise<void>} Resolves once the profile button has been clicked 
 * and the "Your gists" menu item is visible.
 */
  async clickViewProfile() {
    await this.userProfile.click();
    await this.page.waitForSelector('//span[contains(text(), "Your gists")]');
  }

/**
 * Clicks on the "Your gists" menu item to navigate to the user's gists page 
 * and waits for the "All gists" section to become visible.
 * 
 * This asynchronous method simulates a click on the "Your gists" menu item 
 * and then waits for the "All gists" section to appear in the interface, 
 * indicating that the navigation to the user's gists page has been completed. 
 * This ensures that subsequent actions can be performed on the gists displayed 
 * on that page.
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the "Your gists" menu item has been clicked 
 * and the "All gists" section is visible.
 */
  async clickViewYourGists() {
    await this.viewYourGists.click();
    await this.page.waitForSelector('//span[contains(text(), "All gists")]');
  }

  /**
 * Clicks on the update button for a specific gist to initiate the update process.
 * 
 * This asynchronous method simulates a click on the update link or button associated 
 * with a gist. This action is typically used to navigate to the update form or interface 
 * where the user can modify the content of the selected gist.
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the update button for the gist has been clicked.
 */
  async clickUpdateGist() {
    await this.updateGist.click();
  }
  
  /**
 * Clicks the edit button for a specific gist to open the editing interface.
 * 
 * This asynchronous method simulates a click on the edit button associated with 
 * a gist. This action allows the user to modify the content, description, or other 
 * properties of the selected gist. 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the edit button for the gist has been clicked.
 */
  async clickEditButton() {
    await this.editGist.click();
  }

  /**
 * Clicks the update button for the gist after waiting for the page to be ready.
 * 
 * This asynchronous method first waits for a specified timeout to ensure that the 
 * page has fully loaded or stabilized before simulating a click on the update button 
 * associated with a gist. This action typically initiates the update process for 
 * the selected gist, applying any changes made by the user.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the update button for the gist has been clicked.
 */
  async clickUpdateGistButton() {
    await this.page.waitForTimeout(2000);
    await this.updateGistButton.click();
  }

}
module.exports = UpdateGistPage;
