let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const modeToggle = document.getElementById('mode-toggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// GSAP animations setup
gsap.set('.container', { opacity: 0, y: 30 });
gsap.set('h1', { opacity: 0, y: -30 });

// Initial page load animation
const tl = gsap.timeline();
tl.to('h1', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
})
.to('.container', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.5");

// Timer number change animation
function animateNumber(element) {
    gsap.from(element, {
        scale: 1.2,
        opacity: 0.7,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        clearProps: "scale"
    });
}

console.log('Elements found:', {
    minutesDisplay,
    secondsDisplay,
    startButton,
    resetButton,
    modeText
});

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const newMinutes = minutes.toString().padStart(2, '0');
    const newSeconds = seconds.toString().padStart(2, '0');
    
    if (minutesDisplay.textContent !== newMinutes) {
        minutesDisplay.textContent = newMinutes;
        animateNumber(minutesDisplay);
    }
    if (secondsDisplay.textContent !== newSeconds) {
        secondsDisplay.textContent = newSeconds;
        animateNumber(secondsDisplay);
    }
}

function switchMode() {
    isWorkTime = !isWorkTime;
    modeToggle.checked = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    
    gsap.to('.container', {
        backgroundColor: isWorkTime ? '#fff9f0' : '#f7f7f7',
        duration: 0.5,
        ease: "back.inOut"
    });
    
    gsap.to(modeText, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
            modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
            gsap.to(modeText, {
                opacity: 1,
                y: 0,
                duration: 0.3
            });
        }
    });
    
    updateDisplay(timeLeft);
}

function startTimer() {
    console.log('Timer started');
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
            switchMode();
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    modeToggle.checked = false;
    modeText.textContent = 'Work Time';

    // Capture the current timer value (in seconds)
    const currentTime = timeLeft;

    // Create an object for tweening
    const obj = { time: currentTime };

    // Animate from the current time back to WORK_TIME (25 minutes)
    gsap.to(obj, {
        time: WORK_TIME,
        duration: 1, // adjust the duration as needed
        ease: "power2.inOut",
        onUpdate: () => {
            // Update the display with the rounded time value
            updateDisplay(Math.round(obj.time));
        },
        onComplete: () => {
            // Ensure the global timeLeft variable is updated
            timeLeft = WORK_TIME;
        }
    });

    startButton.textContent = 'Start';
}

startButton.addEventListener('click', () => {
    gsap.from(startButton, {
        scale: 0.95,
        backgroundColor: "#4a6353",
        duration: 0.3,
        ease: "back.out"
    });
    console.log('Start button clicked');
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', () => {
    gsap.from(resetButton, {
        rotate: 360,
        scale: 0.95,
        duration: 0.5,
        ease: "back.out"
    });
    resetTimer();
});

modeToggle.addEventListener('change', () => {
    gsap.to('.toggle-label', {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
    clearInterval(timerId);
    timerId = null;
    isWorkTime = !modeToggle.checked;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
});

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 