const randomstring = require('randomstring');

/**
 * Generates a random string with specified options.
 *
 * This function generates a random string of a fixed length (2 characters)
 * using an alphanumeric character set. The resulting string is in uppercase.
 *
 * @returns {string} A random string with 2 uppercase alphanumeric characters.
 */
export function generateRandomString() {
    return randomstring.generate({
        length: 2,
        charset: "alphanumeric",
        capitalization: "uppercase",
    });
}