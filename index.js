'use strict';

// Play button
const playStopBtn = document.querySelector('.play-stop-btn');
// DOM circles arranged in a wheel of 16 beats
const cells = document.querySelectorAll('.cell');

// Tempo controls
const tempoSlider = document.querySelector('#tempoSlider');
const tempoInput = document.querySelector('#tempoInput');
const tempoError = document.querySelector('#tempoErrorMsg');

// Gain controls
const gainSlider = document.querySelector('#gainSlider');
const gainInput = document.querySelector('#gainInput');
const gainError = document.querySelector('#gainErrorMsg');

// Array of booleans used by loop to determine whether to sound each beat when playing
const cellsArray = new Array(16).fill(false);

// Create new audio context
const audioContext = new AudioContext();
// Create new gain node
const gainNode = audioContext.createGain();
// Set initial gain value
gainNode.gain.value = 0.5;

// Current note position in sequence
let currentNote = 0;

// Initial BPM value
const initialBpmValue = 60;

// BPM used by timer to play 16th notes according to current BPM
let BPM = parseInt(((60 / initialBpmValue) * 1000) / 4);

// Variable used to stop and start the timer
let timer;

function playNote(pitch) {
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  // Connect oscillator to gain node then audio output
  oscillator.connect(gainNode).connect(audioContext.destination);
  // Change frequency of oscillator note to pitch specified in function argument
  oscillator.detune.value = pitch;
  // Play oscillator for 90% of the length of current note (90% to avoid overlaps)
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + (BPM / 1000) * 0.9);
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
    // Play 1 octave above middle C for the first beat of the bar
    if (cellsArray[0] && currentNote === 0) {
      playNote(1500);
    }
    // Play middle C for other notes
    else if (cellsArray[currentNote]) {
      playNote(300);
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
  if (cells[cell].classList.contains('on')) playNote(300);
}

// Toggle a cell on or off, store the new value in cellsArray and call playConfirmationSound
function toggleOnOff(cell) {
  cells[cell].classList.toggle('on');
  storeCellValue(cell);
  playConfirmationSound(cell);
}

function updateTempo(newTempo) {
  // Update BPM variable used in playSequence timer and playNote note length
  BPM = parseInt(((60 / newTempo) * 1000) / 4);
}

// Add event listener to each cell to toggle on or off when clicked
for (let cell = 0; cell < cells.length; cell++) {
  cells[cell].addEventListener('click', () => toggleOnOff(cell));
}

// Add event listener to play/stop button to call playOrStop when clicked
playStopBtn.addEventListener('click', playOrStop);

// Detect tempo change on range slider and update current tempo
tempoSlider.oninput = function (event) {
  const input = event.target.value;
  updateTempo(input);
  tempoInput.value = input;
};

// Detect tempo change on tempo text input, check if it's a valid tempo and either display error message or update current tempo
tempoInput.oninput = function (event) {
  const input = Number(event.target.value.trim());

  if (input >= 40 && input <= 240) {
    tempoError.classList.add('u-hidden');
    updateTempo(input);
    tempoSlider.value = input;
  } else tempoError.classList.remove('u-hidden');
};

// Detect gain change and update gainNode on oscillator
gainSlider.oninput = function (event) {
  const input = event.target.value / 100;
  gainNode.gain.value = input;
  gainInput.value = Math.round(input * 100);
};

// Detect gain change on gain text input, check if it's a valid gain and either display error message or update current gain
gainInput.oninput = function (event) {
  const input = Number(event.target.value.trim()) / 100;

  if (input >= 0 && input <= 1) {
    gainError.classList.add('u-hidden');
    gainNode.gain.value = input;
    gainSlider.value = input;
  } else gainError.classList.remove('u-hidden');
};
