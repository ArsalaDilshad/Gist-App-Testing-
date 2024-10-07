import { test, expect } from '@playwright/test';
import { API_BASE_URL, TOKEN, UPDATE_API_URL } from '../src/config/constants.js';  // Import the constants
import { generateRandomString } from "../src/utils/random_generator_util";

test.describe('Tests for Cet Gist Lists', () => {
    let request;
    const token = TOKEN;

    /**
 * Setup hook that runs before all tests in the suite.
 * 
 * This hook is executed once before any tests are run. It creates a new 
 * context for handling HTTP requests using the Playwright API. This 
 * context can be used to send requests to the API endpoints being tested.
 * 
 * @async
 * @function
 * @param {Object} context - The context object provided by Playwright.
 * @param {Playwright} context.playwright - The Playwright API, which allows creating new contexts for requests.
 * @returns {Promise<void>} Resolves once the request context has been created.
 */
    test.beforeAll(async ({ playwright }) => {
        request = await playwright.request.newContext({
        });
    });

    /**
    * Teardown hook that runs after all tests in the suite.
    * 
    * This hook is executed once after all tests have completed. It disposes of 
    * the request context created in the `beforeAll` hook. Disposing of the context 
    * is essential for freeing up resources and preventing potential memory leaks.
    * 
    * 
    * @async
    * @function
    * @returns {Promise<void>} Resolves once the request context has been disposed of.
    */
    test.afterAll(async () => {
        await request.dispose();
    });

    /**
     * Test case for retrieving all gists of the authenticated user.
     * 
     * This test sends a GET request to the GitHub API to fetch all gists created by the authenticated user. 
     * It then maps over the response to extract the 'login' property of each gist's owner into an array. 
     * For each entry in the array, the test asserts that the 'login' matches the expected username, 
     * indicating that all gists belong to the authenticated user.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once all assertions have been executed.
     */
    test('Get all the gists of authenticated user', async () => {
        const response = await request.get(API_BASE_URL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        const responseBody = await response.json();
        const ownerArray = responseBody.map(item => item.owner.login);

        for (let i = 0; i < ownerArray.length; i++) {
            expect(ownerArray[i]).toEqual("ArsalaDilshad");
        }


    });

    /**
 * Test case for retrieving all public gists regardless of the authenticated user.
 * 
 * This test sends a GET request to the GitHub API to retrieve a list of all public gists. 
 * It does not use authentication headers, as it is designed to access publicly available 
 * data. The test verifies that the response status is 200 (OK), indicating a successful 
 * request.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the test assertion has been executed.
 */

    test('Get all public gists', async () => {
        const response = await request.get(API_BASE_URL,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        expect(response.status()).toBe(200);
    });

    /**
 * Test case for fetching gists filtered on the `since` query parameter.
 * 
 * This test sends a GET request to the GitHub API to retrieve gists created 
 * since a specified date and checks that the created date of a random gist 
 * returned in the response is greater than or equal to the specified `since` 
 * date. It verifies that the API correctly filters gists based on the 
 * provided date.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the test assertions have been executed.
 */
    test('Get gists filtered on since query paramteter', async () => {
        const queryParams = "?since=2024-10-04T15:58:03Z";
        const response = await request.get(API_BASE_URL + queryParams,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        const responseBody = await response.json();
        const createdDateArray = responseBody.map(item => item.created_at);
        const randomIndex = Math.floor(Math.random() * createdDateArray.length);
        const createdDate = createdDateArray[randomIndex];
        const date1 = new Date(createdDate);
        const date2 = new Date("2024-10-04T15:58:03Z");
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    });

    /**
 * Test case for fetching gists filtered on the `per_page` query parameter.
 * 
 * This test sends a GET request to the GitHub API to retrieve a limited 
 * number of gists based on the `per_page` query parameter. It checks that 
 * the response contains the expected number of gists as specified in the 
 * query parameter. In this case, it verifies that the API returns exactly 
 * two gists when the `per_page` parameter is set to 2.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the test assertions have been executed.
 */

    test('Get gists filtered on per_page query paramteter', async () => {
        const queryParams = "?per_page=2";
        const response = await request.get(API_BASE_URL + queryParams,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        const responseBody = await response.json();
        const idsArray = responseBody.map(item => item.id);
        expect(idsArray.length).toEqual(2);
    });
    /**
     * Test case for fetching gists using a specific page number as a query parameter.
     * 
     * This test sends a GET request to the GitHub API with a specified `page` 
     * query parameter to retrieve the gists on that page. It verifies that the 
     * API responds with a status of 200, indicating that the request was successful 
     * and the specified page is valid. In this case, it requests page number 100.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the test assertions have been executed.
     */
    test('Get gists of page number provided as query paramteter', async () => {
        const queryParams = "?page=100";
        const response = await request.get(API_BASE_URL + queryParams,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        expect(response.status()).toBe(200);
    });

    /**
     * Test case for listing all public gists.
     * 
     * This test sends a GET request to the GitHub API endpoint for listing all public gists. 
     * It then extracts the 'public' property from each gist in the response, 
     * storing these values in an array. The test asserts that each gist is public 
     * by checking that each entry in the array is `true`, indicating the gist's visibility status.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once all assertions have been executed.
     */
    test('List all public gists', async () => {
        const response = await request.get(API_BASE_URL + "/public",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });
        const responseBody = await response.json();
        const publicFlagArray = responseBody.map(item => item.public);
        for (let i = 0; i < publicFlagArray.length; i++) {
            expect(publicFlagArray[i]).toEqual(true);
        }
    });

    /**
  * Test case for listing gists of a specific username.
  * 
  * This test sends a GET request to the GitHub API endpoint to retrieve all gists 
  * associated with the provided username ('Arsala92'). It then extracts the 'login' 
  * property of each gist owner from the response and stores these values in an array.
  * The test asserts that each gist in the response belongs to the specified username by 
  * checking that each entry in the array matches the username 'Arsala92'.
  * 
  * @async
  * @function
  * @returns {Promise<void>} Resolves once all assertions have been executed.
  */
    test('List gists of provided username', async () => {
        const response = await request.get("https://api.github.com/users/Arsala92/gists",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',1
                },
            });
        const responseBody = await response.json();
        const ownerArray = responseBody.map(item => item.owner.login);
        for (let i = 0; i < ownerArray.length; i++) {
            expect(ownerArray[i]).toEqual("Arsala92");
        }


    });
});