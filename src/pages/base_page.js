import { expect } from '@playwright/test';


class BasePage {

  /**
   * Initializes a new instance of the GistPage class with required locators for gist creation.
   * 
   * The constructor sets up the Playwright page object and locators needed to interact 
   * with elements on the Gist creation page. It initializes locators for elements such 
   * as the gist description, file extension, and content areas.
   * 
   * @param {Page} page - The Playwright page object for interacting with the web page.
   
   */
  constructor(page) {
    this.page = page;
    this.gistDescription = this.page.getByPlaceholder('Gist description…');
    this.gistFileExtension = this.page.getByPlaceholder('Filename including extension…');
    this.gistContentSection = this.page.locator('//div[@class="CodeMirror cm-s-github-light"]');
    this.gistContentAddContent = this.page.locator('//div[@class="CodeMirror-code"]');
  }

  /**
 * Fills in the gist description field with the provided text.
 * 
 * This asynchronous method takes a string parameter `description` and uses it to 
 * populate the gist description input field. It assumes that the `gistDescription` 
 * locator has been properly initialized and is ready for interaction.
 * 
 * @async
 * @function
 * @param {string} description - The text to be entered as the gist description.
 * @returns {Promise<void>} Resolves once the description field has been filled.
 */
  async addGistDescription(description) {
    await this.gistDescription.fill(description);
  }

  /**
 * Adds a file extension to the gist file by filling in the appropriate input field.
 * 
 * This asynchronous method clicks on the file extension input field and then fills it 
 * with the provided `fileExtension` value. It allows the user to specify the filename 
 * along with its extension for the gist. It assumes that the `gistFileExtension` locator 
 * is properly initialized and points to an input field for file extensions.
 * 
 * 
 * @async
 * @function
 * @param {string} fileExtension - The file extension and filename to be entered, 
 *                                 such as "example.js" or "script.py".
 * @returns {Promise<void>} Resolves once the file extension has been entered.
 */

  async addFileExtension(fileExtension) {
    await this.gistFileExtension.click(fileExtension);
    await this.gistFileExtension.fill(fileExtension);
  }

  /**
   * Populates the gist content area with the specified text.
   * 
   * This asynchronous method fills the gist content section with the provided `content`. 
   * It assumes that the `gistContentAddContent` locator has been correctly initialized 
   * and points to an editable area where the gist content can be entered.
   * @async
   * @function
   * @param {string} content - The text content to be added to the gist, such as code or text.
   * @returns {Promise<void>} Resolves once the content has been successfully added.
   */

  async addGistContent(content) {
    await this.gistContentAddContent.fill(content);
  }

}

module.exports = BasePage;
