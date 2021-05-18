'use strict';

// Play button
const playStopBtn = document.querySelector('.btn--play-stop');
// Plus and Minus buttons
const plusBtn = document.querySelector('.btn--plus');
const minusBtn = document.querySelector('.btn--minus');
// DOM circles arranged in a wheel of 16 beats
const cells = document.querySelectorAll('.cell');

// Controls container
const controls = document.querySelector('.control__container');

// Wood Block audio element
const woodBlock = document.querySelector('#woodBlock');
woodBlock.load();

// Array of booleans used by loop to determine whether to sound each beat when playing
const cellsArray = new Array(16).fill(false);

// Create new audio context
const audioContext = new AudioContext();

// Pass wood block element into the audio context
const woodBlockNode = audioContext.createMediaElementSource(woodBlock);

// Create new gain node for pattern
const patternGainNode = audioContext.createGain();
// Set initial pattern gain value
patternGainNode.gain.value = 0.5;
// Connect woodBlock to gain node then audio output
woodBlockNode.connect(patternGainNode).connect(audioContext.destination);

// Create new gain node for pulse
const pulseGainNode = audioContext.createGain();
// Set initial pulse gain value
pulseGainNode.gain.value = 0.5;

// Tempo and Gain controls
class Control {
  constructor(slider, input, error, min, max, type) {
    this.slider = slider;
    this.input = input;
    this.error = error;
    this.min = min;
    this.max = max;
    this.type = type;
  }
}

class GainControl extends Control {
  constructor(slider, input, error, min, max, type, gainNode) {
    super(slider, input, error, min, max, type);
    this.gainNode = gainNode;
  }
}

const tempoControl = new Control(
  document.querySelector('#tempoSlider'),
  document.querySelector('#tempoInput'),
  document.querySelector('#tempoErrorMsg'),
  60,
  240,
  'tempo'
);

const pulseGainControl = new GainControl(
  document.querySelector('#pulseGainSlider'),
  document.querySelector('#pulseGainInput'),
  document.querySelector('#pulseGainErrorMsg'),
  0,
  100,
  'gain',
  pulseGainNode
);

const patternGainControl = new GainControl(
  document.querySelector('#patternGainSlider'),
  document.querySelector('#patternGainInput'),
  document.querySelector('#patternGainErrorMsg'),
  0,
  100,
  'gain',
  patternGainNode
);

// Current note position in sequence
let currentNote = 0;

// Initial BPM value
const initialBpmValue = 60;

// BPM used by timer to play 16th notes according to current BPM
let BPM = parseInt(((60 / initialBpmValue) * 1000) / 4);

// Variable used to stop and start the timer
let timer;

// FUNCTIONS
function playPulseNote(pitch) {
  // Create oscillator
  const oscillator = audioContext.createOscillator();
  // Connect oscillator to pulse gain node then audio output
  oscillator.connect(pulseGainNode).connect(audioContext.destination);
  // Change frequency of oscillator note to pitch specified in function argument
  oscillator.detune.value = pitch;
  // Play oscillator for the length of 1/16th at current tempo
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + BPM / 1000);
}

// Check if sequence is currently playing then stop or start sequence accordingly and update button text and styles
function playOrStop() {
  if (timer) {
    // If sequence is playing, clear the current timer
    clearTimeout(timer);
    // Remove current style from the last note playing when sequence is stopped
    cells[(currentNote || cells.length) - 1].classList.remove('current');
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
    // Play 1 octave above middle C for the first pulse beat of the bar
    if (currentNote === 0) {
      playPulseNote(1500);
    }
    // Play middle C for other pulse notes
    else if (currentNote !== 0 && currentNote % 4 === 0) {
      playPulseNote(300);
    }

    // Play wood block sound if current cell is on
    if (cellsArray[currentNote]) {
      woodBlock.pause();
      woodBlock.currentTime = 0;
      woodBlock.play();
    }

    // Add current note style and remove from previous note
    cells[currentNote].classList.add('current');
    cells[(currentNote || cells.length) - 1].classList.remove('current');

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

// When sequence is stopped, play confirmation sound if cell has been changed to on
function playConfirmationSound(cell) {
  if (!timer && cells[cell].classList.contains('on')) {
    woodBlock.load();
    woodBlock.play();
  }
}

// Toggle a cell on or off, store the new value in cellsArray and call playConfirmationSound
function toggleOnOff(cell) {
  cells[cell].classList.toggle('on');
  storeCellValue(cell);
  playConfirmationSound(cell);
}

function updateTempo(newTempo) {
  // Update BPM variable used in playSequence timer and playPulseNote note length
  BPM = parseInt(((60 / newTempo) * 1000) / 4);
}

// Update cellsArray with new values
function updateArray(oldArr, newArr) {
  cellsArray.forEach((_, index) => {
    oldArr[index] = newArr[index];
  });
  updateDisplay();
}

// Update on or off display of cells
function updateDisplay() {
  cells.forEach((_, i) => {
    if (cellsArray[i]) cells[i].classList.add('on');
    else cells[i].classList.remove('on');
  });
}

// Update gain or tempo from slider input and set as the value of text input
function controlSliderChange(input, control) {
  control.type === 'tempo'
    ? updateTempo(input)
    : (control.gainNode.gain.value = input / 100);
  control.input.value = Math.round(input);
}

// Update gain or tempo from text input
function controlTextInputChange(input, control) {
  input = Number(input);

  // check input is within valid range,
  // update control and slider value if so, show error message if not
  if (input >= control.min && input <= control.max) {
    control.type === 'tempo'
      ? updateTempo(input)
      : (control.gainNode.gain.value = input / 100);

    control.slider.value = input;
  } else {
    control.error.textContent = `Please enter a value between ${control.min} and ${control.max}`;
    control.error.classList.remove('u-hidden');
  }
}

// EVENT LISTENERS
// Add event listener to each cell to toggle on or off when clicked
for (let cell = 0; cell < cells.length; cell++) {
  cells[cell].addEventListener('click', () => toggleOnOff(cell));
}

playStopBtn.addEventListener('click', playOrStop);

// Shift pattern forward
plusBtn.addEventListener('click', () => {
  // Create new array with values from the first to the last but one values from cellsArray
  const tempCellsArr = cellsArray.slice(0, cellsArray.length - 1);
  // Add the last value of cellsArray to the start of the new array
  tempCellsArr.unshift(cellsArray[cellsArray.length - 1]);

  // Update values of cellsArray
  updateArray(cellsArray, tempCellsArr);
});

// Shift pattern backward
minusBtn.addEventListener('click', () => {
  // Create new array with values from the second to the last values from cellsArray
  const tempCellsArr = cellsArray.slice(1);
  // Add the first value of cellsArray to the end of the new array
  tempCellsArr.push(cellsArray[0]);

  // Update values of cellsArray
  updateArray(cellsArray, tempCellsArr);
});

// Change gain or tempo controls
controls.oninput = function (e) {
  const input = e.target.value.trim();
  const control = e.target.dataset.control;
  const type = e.target.type;
  let controlObj;

  if (control === 'tempo') controlObj = tempoControl;
  else if (control === 'pulse') controlObj = pulseGainControl;
  else if (control === 'pattern') controlObj = patternGainControl;

  controlObj.error.classList.add('u-hidden');

  if (type === 'range') {
    controlSliderChange(input, controlObj);
  } else if (type === 'text') {
    controlTextInputChange(input, controlObj);
  }
};
