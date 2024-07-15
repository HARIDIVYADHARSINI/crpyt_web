// script.js

// Function to encrypt the input text based on the selected technique
function encrypt() {
    const inputText = document.getElementById('inputText').value;
    const technique = document.getElementById('technique').value;
    const key = document.getElementById('key').value;
    let outputText = '';

    switch (technique) {
        case 'caesar':
            outputText = caesarCipher(inputText, key, true);
            break;
        case 'atbash':
            outputText = atbashCipher(inputText);
            break;
        case 'vigenere':
            outputText = vigenereCipher(inputText, key, true);
            break;
        case 'monoalphabetic':
            outputText = monoalphabeticCipher(inputText, key, true);
            break;
        case 'playfair':
            outputText = playfairCipher(inputText, key, true);
            break;
        case 'hill':
            outputText = hillCipher(inputText, key, true);
            break;
        case 'oneTimePad':
            outputText = oneTimePadCipher(inputText, key, true);
            break;
        case 'railFence':
            outputText = railFenceCipher(inputText, key, true);
            break;
        case 'columnar':
            outputText = columnarTransposition(inputText, key, true);
            break;
        case 'scytale':
            outputText = scytaleCipher(inputText, key, true);
            break;
        case 'doubleColumnar':
            outputText = doubleColumnarTransposition(inputText, key, true);
            break;
        default:
            outputText = 'Invalid technique selected';
    }

    document.getElementById('outputText').value = outputText;
}

// Function to decrypt the input text based on the selected technique
function decrypt() {
    const inputText = document.getElementById('inputText').value;
    const technique = document.getElementById('technique').value;
    const key = document.getElementById('key').value;
    let outputText = '';

    switch (technique) {
        case 'caesar':
            outputText = caesarCipher(inputText, key, false);
            break;
        case 'atbash':
            outputText = atbashCipher(inputText);
            break;
        case 'vigenere':
            outputText = vigenereCipher(inputText, key, false);
            break;
        case 'monoalphabetic':
            outputText = monoalphabeticCipher(inputText, key, false);
            break;
        case 'playfair':
            outputText = playfairCipher(inputText, key, false);
            break;
        case 'hill':
            outputText = hillCipher(inputText, key, false);
            break;
        case 'oneTimePad':
            outputText = oneTimePadCipher(inputText, key, false);
            break;
        case 'railFence':
            outputText = railFenceCipher(inputText, key, false);
            break;
        case 'columnar':
            outputText = columnarTransposition(inputText, key, false);
            break;
        case 'scytale':
            outputText = scytaleCipher(inputText, key, false);
            break;
        case 'doubleColumnar':
            outputText = doubleColumnarTransposition(inputText, key, false);
            break;
        default:
            outputText = 'Invalid technique selected';
    }

    document.getElementById('outputText').value = outputText;
}

// Caesar Cipher
function caesarCipher(text, shift, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    shift = parseInt(shift);
    if (!encrypt) shift = -shift;
    return text.toUpperCase().split('').map(char => {
        const index = alphabet.indexOf(char);
        if (index === -1) return char;
        return alphabet[(index + shift + 26) % 26];
    }).join('');
}

// Atbash Cipher
function atbashCipher(text) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const reversed = alphabet.split('').reverse().join('');
    return text.toUpperCase().split('').map(char => {
        const index = alphabet.indexOf(char);
        if (index === -1) return char;
        return reversed[index];
    }).join('');
}

// Vigenère Cipher
function vigenereCipher(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    let keyIndex = 0;
    return text.toUpperCase().split('').map(char => {
        const index = alphabet.indexOf(char);
        if (index === -1) return char;
        const shift = alphabet.indexOf(key[keyIndex]);
        keyIndex = (keyIndex + 1) % key.length;
        if (!encrypt) return alphabet[(index - shift + 26) % 26];
        return alphabet[(index + shift) % 26];
    }).join('');
}

// Monoalphabetic Cipher
function monoalphabeticCipher(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyMap = key.toUpperCase().split('');
    return text.toUpperCase().split('').map(char => {
        const index = alphabet.indexOf(char);
        if (index === -1) return char;
        return encrypt ? keyMap[index] : alphabet[keyMap.indexOf(char)];
    }).join('');
}

// Playfair Cipher
function playfairCipher(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is omitted
    key = key.toUpperCase().replace(/J/g, 'I');
    let matrix = [];
    let used = new Set();
    for (let char of key + alphabet) {
        if (!used.has(char)) {
            matrix.push(char);
            used.add(char);
        }
    }
    matrix = Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, i * 5 + 5));

    const digraphs = text.toUpperCase().replace(/J/g, 'I').match(/.{1,2}/g).map(d => d.length === 1 ? d + 'X' : d);
    return digraphs.map(d => {
        const [a, b] = d.split('');
        const [ax, ay] = findPosition(matrix, a);
        const [bx, by] = findPosition(matrix, b);
        if (ax === bx) {
            return matrix[ax][(ay + (encrypt ? 1 : 4)) % 5] + matrix[bx][(by + (encrypt ? 1 : 4)) % 5];
        } else if (ay === by) {
            return matrix[(ax + (encrypt ? 1 : 4)) % 5][ay] + matrix[(bx + (encrypt ? 1 : 4)) % 5][by];
        } else {
            return matrix[ax][by] + matrix[bx][ay];
        }
    }).join('');
}

function findPosition(matrix, char) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (matrix[x][y] === char) return [x, y];
        }
    }
}

// Hill Cipher
function hillCipher(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const size = Math.sqrt(key.length);
    if (size % 1 !== 0) return 'Invalid key length';
    const matrix = Array.from({ length: size }, (_, i) => key.slice(i * size, i * size + size).split('').map(char => alphabet.indexOf(char)));
    const inverseMatrix = encrypt ? matrix : invertMatrix(matrix);
    const textVectors = text.toUpperCase().match(new RegExp(`.{1,${size}}`, 'g')).map(v => v.split('').map(char => alphabet.indexOf(char)));
    const resultVectors = textVectors.map(v => multiplyMatrix(inverseMatrix, v));
    return resultVectors.map(v => v.map(i => alphabet[(i + 26) % 26]).join('')).join('');
}

function invertMatrix(matrix) {
    // Implementation of matrix inversion
    // This is a placeholder function. Implement the matrix inversion logic here.
    return matrix;
}

function multiplyMatrix(matrix, vector) {
    return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
}

// One-Time Pad Cipher
function oneTimePadCipher(text, key, encrypt = true) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    return text.toUpperCase().split('').map((char, index) => {
        const textIndex = alphabet.indexOf(char);
        const keyIndex = alphabet.indexOf(key[index % key.length]);
        if (textIndex === -1) return char;
        return encrypt ? alphabet[(textIndex + keyIndex) % 26] : alphabet[(textIndex - keyIndex + 26) % 26];
    }).join('');
}

// Rail Fence Cipher
// Rail Fence Cipher
function railFenceCipher(text, key, encrypt = true) {
    const numRails = parseInt(key);
    if (encrypt) {
        const rails = Array.from({ length: numRails }, () => []);
        let rail = 0;
        let direction = 1;
        for (const char of text) {
            rails[rail].push(char);
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }
        return rails.flat().join('');
    } else {
        const length = text.length;
        const rails = Array.from({ length: numRails }, () => []);
        let railLengths = Array(numRails).fill(0);
        let rail = 0;
        let direction = 1;
        for (let i = 0; i < length; i++) {
            railLengths[rail]++;
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }
        let index = 0;
        for (let r = 0; r < numRails; r++) {
            for (let j = 0; j < railLengths[r]; j++) {
                rails[r].push(text[index++]);
            }
        }
        let result = '';
        rail = 0;
        direction = 1;
        for (let i = 0; i < length; i++) {
            result += rails[rail].shift();
            rail += direction;
            if (rail === 0 || rail === numRails - 1) direction *= -1;
        }
        return result;
    }
}

// Columnar Transposition
function columnarTransposition(text, key, encrypt = true) {
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);
    const grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));
    if (encrypt) {
        let index = 0;
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                if (index < text.length) {
                    grid[r][c] = text[index++];
                }
            }
        }
        const sortedKey = key.split('').map((char, i) => [char, i]).sort();
        return sortedKey.map(([_, i]) => grid.map(row => row[i]).join('')).join('');
    } else {
        const sortedKey = key.split('').map((char, i) => [char, i]).sort();
        let index = 0;
        for (const [_, i] of sortedKey) {
            for (let r = 0; r < numRows; r++) {
                if (index < text.length) {
                    grid[r][i] = text[index++];
                }
            }
        }
        return grid.flat().join('');
    }
}

// Scytale Cipher
function scytaleCipher(text, key, encrypt = true) {
    const numCols = parseInt(key);
    const numRows = Math.ceil(text.length / numCols);
    const grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));
    if (encrypt) {
        let index = 0;
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                if (index < text.length) {
                    grid[r][c] = text[index++];
                }
            }
        }
        return grid.flat().join('');
    } else {
        let index = 0;
        for (let c = 0; c < numCols; c++) {
            for (let r = 0; r < numRows; r++) {
                if (index < text.length) {
                    grid[r][c] = text[index++];
                }
            }
        }
        return grid.flat().join('');
    }
}

// Double Columnar Transposition
function doubleColumnarTransposition(text, key, encrypt = true) {
    return columnarTransposition(columnarTransposition(text, key, encrypt), key, encrypt);
}