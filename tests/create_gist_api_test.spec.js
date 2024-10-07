import { test, expect } from '@playwright/test';
import { TOKEN, API_BASE_URL, FINE_GRAINED_TOKEN } from '../src/config/constants.js';

test.describe('Tests for Create Gists API', () => {
    let request;

    /**
     * Setup function that runs before all tests in the suite.
     * 
     * This asynchronous function creates a new context for API requests using Playwright's 
     * request functionality. The new context can be used for making HTTP requests 
     * independently of the browser context, allowing for isolated API testing.
     * 
     * 
     * @async
     * @function
     * @param {Object} context - The context object provided by Playwright, containing various utilities.
     * @param {Playwright} context.playwright - The Playwright object used to create a new request context.
     * @returns {Promise<void>} Resolves once the new request context has been created.
     */
    test.beforeAll(async ({ playwright }) => {
        request = await playwright.request.newContext({
        });
    });

    /**
     * Cleanup function that runs after all tests in the suite.
     * 
     * This asynchronous function disposes of the request context created in the 
     * `beforeAll` setup. Disposing the context ensures that any resources used 
     * during the tests are properly released, preventing potential memory leaks 
     * or resource exhaustion.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the request context has been successfully disposed of.
     */
    test.afterAll(async () => {
        await request.dispose();
    });

    /**
     * Test case for creating a new gist using a POST request.
     * 
     * This test sends a POST request to the GitHub API to create a new gist with 
     * specified files and checks that the response status is 201 (Created). It 
     * also verifies that the filenames returned in the response match the expected 
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the test assertions have been executed.
     */

    test('POST request - create a new gist', async () => {
        // Send the POST request with headers and body
        const response = await request.post(API_BASE_URL, {
            data: {

                "description": "Example of a gist",
                "public": "true",
                "files": {
                    "FIRST_FILE.md": {
                        "content": "Hello World First File"
                    },
                    "SECOND_FILE.py": {
                        "content": "Hello World Second File"
                    }
                }
            }, // Request body
            headers: {
                'Authorization': `Bearer ${TOKEN}`, // Authorization header
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        const actualFilenames = Object.keys(responseBody.files);
        const expectedFilenames = ['FIRST_FILE.md', 'SECOND_FILE.py'];
        expect(actualFilenames).toEqual(expect.arrayContaining(expectedFilenames));

    });

    /**
     * Test case for unauthorized user trying to create a new gist using a POST request.
     * 
     * This test sends a POST request to the GitHub API with a fine-grained token that
     * lacks the necessary permissions to create a gist. It checks that the response 
     * status is 403 (Forbidden) to confirm that the API correctly enforces authorization. 
     * This verifies that unauthorized users cannot perform the gist creation operation.
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once the test assertions have been executed.
     */

    test('Test that authenticated but unathorised user cannot create a new gist', async () => {
        // Send the POST request with headers and body
        const response = await request.post(API_BASE_URL, {
            data: {

                "description": "Example of a gist",
                "public": "true",
                "files": {
                    "FIRST_FILE.md": {
                        "content": "Hello World First File"
                    },
                    "SECOND_FILE.py": {
                        "content": "Hello World Second File"
                    }
                }
            }, // Request body
            headers: {
                'Authorization': `Bearer ${FINE_GRAINED_TOKEN}`, // Authorization header
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
        });

        expect(response.status()).toBe(403);
    });

    /**
 * Test case for creating a gist with empty content using a POST request.
 * 
 * This test sends a POST request to the GitHub API to create a new gist with an empty 
 * content field for each file. The test checks that the response status is 422 
 * (Unprocessable Entity), indicating that the request is invalid due to missing content.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves once the test assertions have been executed.
 */

    test('Test that gist cannot be created if content is not provided', async () => {
        // Send the POST request with headers and body
        const response = await request.post(API_BASE_URL, {
            data: {

                "description": "Example of a gist",
                "public": "true",
                "files": {
                    "FIRST_FILE.md": {
                        "content": ""
                    },
                    "SECOND_FILE.py": {
                        "content": ""
                    }
                }
            }, // Request body
            headers: {
                'Authorization': `Bearer ${TOKEN}`, // Authorization header
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
        });
        expect(response.status()).toBe(422);
    });
    /**
     * Test case for verifying the content of files in a newly created gist.
     * 
     * This test sends a POST request to the GitHub API to create a new gist with 
     * two files, each containing specified content. After the creation request, 
     * it checks that the response status is 201, indicating successful creation. 
     * Then, it verifies that the content of each file in the created gist matches 
     * the expected string "This is the content of the gist".
     * 
     * @async
     * @function
     * @returns {Promise<void>} Resolves once all assertions have been executed.
     */
    test('Test that in the created gist content is correct', async () => {
        // Send the POST request with headers and body
        const response = await request.post(API_BASE_URL, {
            data: {

                "description": "Automated Gist",
                "public": "true",
                "files": {
                    "FIRST_FILE.md": {
                        "content": "This is the content of the gist"
                    },
                    "SECOND_FILE.py": {
                        "content": "This is the content of the gist"
                    }
                }
            }, // Request body
            headers: {
                'Authorization': `Bearer ${TOKEN}`, // Authorization header
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
            },
        });
        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        const fileObjects = Object.values(responseBody.files)
        const contentArray = fileObjects.map(item => item.content)
        console.log(contentArray);
        for (let i = 0; i < contentArray.length; i++) {
            expect(contentArray[i]).toEqual("This is the content of the gist");
        }
    });
});