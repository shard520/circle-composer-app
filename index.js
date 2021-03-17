'use strict';

// Create new audio context
const audioContext = new AudioContext();

// Play button
const playStopBtn = document.querySelector('.play-stop-btn');

// DOM circles arranged in a wheel of 16 beats
const cells = document.querySelectorAll('.cell');

// Array of booleans used by loop to determine whether to sound each beat when playing
const cellsArray = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
];

// Current note position in sequence
let currentNote = 0;

// Initial BPM value
let bpmValue = 60;

// BPM used by timer to play 16th notes according to current BPM
let BPM = parseInt(((60 / bpmValue) * 1000) / 4);

// Variable used to stop and start the timer
let timer;

function playNote() {
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  // Connect oscillator to audio output
  oscillator.connect(audioContext.destination);
  // Change frequency of oscillator note to middle C from the default 440Hz
  oscillator.detune.value = 300;
  // Play oscillator for 150ms
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
}

// Check if sequence is currently playing then stop or start sequence accordingly and update button text and styles
function playOrStop() {
  if (timer) {
    // If sequence is playing, clear the current timer
    clearTimeout(timer);
    // Reset currentNote to start next sequence from the beginning
    currentNote = 0;
    // Reset timer ID to allow sequence to be restarted
    timer = 0;
    playStopBtn.textContent = 'Play';
    playStopBtn.classList.toggle('btn--on');
  } else {
    playSequence();
    playStopBtn.textContent = 'Stop';
    playStopBtn.classList.toggle('btn--on');
  }
}

function playSequence() {
  // Set timer based on current bpm to play a note if a cell is on
  timer = setTimeout(function () {
    if (cellsArray[currentNote]) {
      playNote();
    }

    // Advance sequence to the next note
    currentNote++;

    // Reset currentNote at the end of the sequence
    if (currentNote >= cellsArray.length) currentNote = 0;

    // Call sequence recursively
    playSequence();
  }, BPM);
}

// Update cellsArray by checking if on class is present on the current cell
function storeCellValue(cell) {
  cells[cell].classList.contains('on')
    ? (cellsArray[cell] = true)
    : (cellsArray[cell] = false);
}

// Play confirmation sound if cell has been changed to on
function playConfirmationSound(cell) {
  if (cells[cell].classList.contains('on')) playNote();
}

// Toggle a cell on or off, store the new value in cellsArray and call playConfirmationSound
function toggleOnOff(cell) {
  cells[cell].classList.toggle('on');
  storeCellValue(cell);
  playConfirmationSound(cell);
}

// Add event listener to each cell to toggle on or off when clicked
for (let cell = 0; cell < cells.length; cell++) {
  cells[cell].addEventListener('click', () => toggleOnOff(cell));
}

// Add event listener to play/stop button to call playOrStop when clicked
playStopBtn.addEventListener('click', playOrStop);
