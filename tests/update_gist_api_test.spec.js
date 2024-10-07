import { test, expect } from '@playwright/test';
import { API_BASE_URL, TOKEN, UPDATE_API_URL } from '../src/config/constants.js';  // Import the constants

test.describe('Tests for Update Gist', () => {
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
     * Test to update a gist successfully using a PATCH request.
     * 
     * This test retrieves a specific gist using a GET request, extracts its ID, 
     * and then sends a PATCH request to update the gist's description and 
     * files with new content. The test asserts that the response status is 
     * 200 (OK), indicating a successful update, and verifies that the updated 
     * files are reflected in the response body.
     * 
     * Steps:
     * 1. Retrieve the existing gist to obtain its ID.
     * 2. Construct the endpoint URL for the PATCH request using the gist ID.
     * 3. Send the PATCH request with updated description and files.
     * 4. Verify that the response status is 200.
     * 5. Assert that the actual filenames returned in the response match the expected filenames.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the test completes its execution.
     */

    test('PATCH request - update a gist successfully', async () => {
        const getAPIResponse = await request.get(API_BASE_URL,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                },
            });

        const responseIdJson = await getAPIResponse.json();
        const ids = responseIdJson.map(item => item.id);
        const randomIndex = Math.floor(Math.random() * ids.length);
        const randomGistId = ids[randomIndex];
        const endPoint = API_BASE_URL + "/" + randomGistId;
        // Send the POST request with headers and body
        const response = await request.post(endPoint, {
            data: {
                "description": "UPDATED GIST",
                "files": {
                    "FIRST_UPDATED_GIST.md": {
                        "content": "The content of the first gist has been updated"
                    },
                    "SECOND_UPDATED_GIST.py": {
                        "content": "The content of the second gist has been updated"
                    }
                }

            },
            headers: {
                'Authorization': `Bearer ${token}`, // Authorization header
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        const actualFilenames = Object.keys(responseBody.files);
        const expectedFilenames = ['FIRST_UPDATED_GIST.md', 'SECOND_UPDATED_GIST.py',];
        expect(actualFilenames).toEqual(expect.arrayContaining(expectedFilenames));

    });

});