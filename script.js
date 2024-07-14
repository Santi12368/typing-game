// Set up the array of quotes
const quotes = [];
const authors = [];
// Store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;
// Set up timer variables
let timerStarted = false;
let timerInterval = null;
let startTime;
// Page elements
const quoteElement = document.getElementById('quote');
const typedValueElement = document.getElementById('typed-value');
const instructionsElement = document.getElementById('instructions-screen');

// Load quotes from CSV file
function loadQuotesFromCSV() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './quotes/quotes.csv', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const lines = xhr.responseText.split('\n');
            lines.forEach(line => {
                const parts = line.split(';'); // Split each line by semicolon
                if (parts.length === 2) { // Ensure there are two parts: quote and author
                    const quote = parts[0].trim().replace(/^"|"$/g, ''); // Remove leading and trailing quotes
                    const author = parts[1].trim().replace(/^"|"$/g, '');
                    quotes.push(quote);
                    authors.push(author);
                }
            });
        }
    };
    xhr.send();
}

// Function to start the timer
function startTimer() {
    if (!timerStarted) {
        startTime = Date.now(); // Reset start time
        timerStarted = true;
        timerInterval = setInterval(updateTimer, 1);
    }
}

// Function to update the timer display
function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime);
    document.getElementById('timer').innerText = seconds / 1000;
}

// Load quotes from CSV when the page loads
document.addEventListener('DOMContentLoaded', loadQuotesFromCSV);

// Activates when the player clicks the start button
document.getElementById('start').addEventListener('click', () => {
    // Allow typing in the input box
    typedValueElement.disabled = false;
    document.getElementById('author-screen').style.display = 'none';

    // Show the text input and hide instructions
    typedValueElement.style.display = 'inline-block';
    instructionsElement.style.display = 'none';

    // Make the start button smaller and change the text
    document.getElementById('start').style.fontSize = '16px';
    document.getElementById('start').innerText = 'Restart';

    // Reset timer
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('timer').innerText = '0.000';
    timerStarted = false;

    // Get and prepare quote and author
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    const author = authors[quoteIndex];
    document.getElementById("author").innerText = `- ${author}`;
    words = quote.split(' ');
    wordIndex = 0;

    // UI updates
    const spanWords = words.map(function (word) { return `<span>${word} </span>` });
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';

    // Set up the textbox
    typedValueElement.value = '';
    typedValueElement.focus();

    // Start the timer
    startTime = new Date().getTime();
});

// Activates when the player types in the textbox
typedValueElement.addEventListener('input', () => {
    // Start the timer on the first keypress and make it grey
    if (typedValueElement.value.length === 1) {
        startTimer();
        document.getElementById('timer').style.color = '#404040';
    }

    // Get the current word and the current value
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // End of quote, display success
        typedValueElement.value = '';
        typedValueElement.disabled = true;
        document.getElementById('author-screen').style.display = 'flex';
        clearInterval(timerInterval);
        document.getElementById('timer').style.color = 'black';
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // End of word, clear the typedValueElement for the new word
        typedValueElement.value = '';
        wordIndex++;
        // Reset the class name for all elements in quote
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        // Highlight the new word
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        // Currently correct, highlight the next word
        typedValueElement.className = '';
    } else {
        // Incorrect, set the typed value to be red
        typedValueElement.className = 'error';
    }
});