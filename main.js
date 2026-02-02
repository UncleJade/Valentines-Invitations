// Variables for easy changing
const questions = [
    "Do you like surprises?",
    "Do you enjoy spending time together?",
    "Are you free this Valentine’s Day?"
];
const finalQuestion = "Can you be my Valentine date? 💖";
const playfulMsgs = ["Are you sure? 🥺", "Think again 💕", "I’ll wait 😘"];
let currentQuestionIndex = 0;
let noClickCount = 0; // For final question logic
let musicStarted = false;

// DOM elements (with checks)
const landing = document.getElementById('landing');
const questionsScreen = document.getElementById('questions');
const celebration = document.getElementById('celebration');
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const playfulMsg = document.getElementById('playful-msg');
const musicControl = document.getElementById('music-control');
const bgMusic = document.getElementById('bg-music');

// Check if elements exist
if (!landing || !questionsScreen || !celebration || !questionText || !yesBtn || !noBtn || !playfulMsg || !musicControl || !bgMusic) {
    console.error('One or more DOM elements not found. Check IDs in HTML.');
    alert('Error: Some page elements are missing. Please refresh or check the code.');
}

// Function to start music (called on user interaction)
function startMusic() {
    console.log('Attempting to start music...');
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => {
            musicStarted = true;
            musicControl.textContent = '⏸️'; // Set to pause icon after starting
            console.log('Music started successfully.');
        }).catch((error) => {
            console.error('Audio play failed:', error); // Log error if autoplay is blocked
            alert('Music couldn\'t start. Check your browser settings or MP3 file.');
        });
    }
}

// Music control toggle (starts music if not started, then toggles play/pause)
musicControl.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Music control clicked. Music started:', musicStarted, 'Paused:', bgMusic.paused);
    if (!musicStarted) {
        startMusic(); // Start music on first click
    } else if (bgMusic) {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicControl.textContent = '⏸️';
                console.log('Music resumed.');
            }).catch((error) => {
                console.error('Resume failed:', error);
            });
        } else {
            bgMusic.pause();
            musicControl.textContent = '🎵';
            console.log('Music paused.');
        }
    }
});

// Function to show next question
function showNextQuestion() {
    console.log('Showing question index:', currentQuestionIndex);
    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex];
        playfulMsg.classList.add('hidden');
        noClickCount = 0; // Reset for each question
        resetButtons();
    } else {
        // Final question
        questionText.textContent = finalQuestion;
        playfulMsg.classList.add('hidden');
        noClickCount = 0;
        resetButtons();
    }
}

// Reset button styles
function resetButtons() {
    if (yesBtn && noBtn) {
        yesBtn.style.transform = 'scale(1)';
        noBtn.style.transform = 'scale(1)';
        noBtn.style.opacity = '1';
        noBtn.style.display = 'inline-block'; // Ensure NO is visible
        console.log('Buttons reset.');
    }
}

// Transition to questions screen and start music
if (landing) {
    landing.addEventListener('click', () => {
        console.log('Landing clicked. Starting music and transitioning to questions.');
        startMusic(); // Start music on landing click
        landing.classList.remove('active');
        questionsScreen.classList.add('active');
        showNextQuestion();
    });
}

// YES button logic
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        console.log('YES button clicked. Current index:', currentQuestionIndex);
        if (currentQuestionIndex < questions.length) {
            // Regular question: Move to next
            currentQuestionIndex++;
            showNextQuestion();
        } else {
            // Final question: Celebrate
            console.log('Final YES clicked. Showing celebration.');
            questionsScreen.classList.remove('active');
            celebration.classList.add('active');
        }
    });
}

// NO button logic
if (noBtn) {
    noBtn.addEventListener('click', () => {
        console.log('NO button clicked. Current index:', currentQuestionIndex);
        if (currentQuestionIndex < questions.length) {
            // Regular question: Show playful message and allow progression
            playfulMsg.textContent = "Aww, but let's keep going! 😊";
            playfulMsg.classList.remove('hidden');
            setTimeout(() => {
                currentQuestionIndex++;
                showNextQuestion();
            }, 2000); // Delay before next question
        } else {
            // Final question: Special logic
            noClickCount++;
            playfulMsg.textContent = playfulMsgs[Math.min(noClickCount - 1, playfulMsgs.length - 1)];
            playfulMsg.classList.remove('hidden');
            // Grow YES button, shrink/move NO button
            yesBtn.style.transform = `scale(${1 + noClickCount * 0.2})`;
            noBtn.style.transform = `scale(${1 - noClickCount * 0.1})`;
            noBtn.style.opacity = `${Math.max(0.1, 1 - noClickCount * 0.1)}`; // Prevent opacity from going negative
            if (noClickCount > 5) {
                noBtn.style.display = 'none'; // Hide NO after many clicks
            }
            console.log('NO clicked on final question. Count:', noClickCount);
        }
    });
}