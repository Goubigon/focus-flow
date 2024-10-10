
const numberOfLines = 20; // Variable to dictate how many lines to display

const linesContainerElement = document.getElementById('linesContainer');
const answerInputTextArea = document.getElementById('answer-input');
let currentLine = 0;

// Create lines dynamically based on numberOfLines
for (let i = 1; i <= numberOfLines; i++) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'line';
    lineDiv.tabIndex = 0; // Make it focusable
    lineDiv.id = `line${i}`;
    lineDiv.textContent = ` 5 x 4 = `;
    linesContainerElement.appendChild(lineDiv);
}

function scrollToNextLine() {
    if (currentLine < numberOfLines - 1) {
        currentLine++;
        linesContainerElement.children[currentLine-1].classList.remove('current');
        linesContainerElement.children[currentLine-1].classList.add('answered');

        // Scroll to the next line
        linesContainerElement.children[currentLine - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        linesContainerElement.children[currentLine].classList.add('current');
        answerInputTextArea.value=''
        answerInputTextArea.focus()
    }
}

// Event listener for answering a line (using Enter key)
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        scrollToNextLine(); // Trigger scroll on pressing Enter
    }
});

// Focus on the first line initially
//
window.onload = () => {
    answerInputTextArea.focus()
    linesContainerElement.children[currentLine].classList.add('current');
};
