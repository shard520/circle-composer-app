import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import circlesView from './view/circlesView';
import shiftView from './view/shiftView';
import playStopView from './view/playStopView';
import controlsBoxView from './view/controlsBoxView';
import Control from './view/controlView';

console.log(model.state);

const controlCircleDisplay = function () {
  if (model.state.viewportWidth !== window.innerWidth)
    model.state.updateDimensions();
  circlesView.render(model.state);
};

const controlActiveCells = function (e) {
  const cell = e.target;
  if (!cell.classList.contains('circle__cell')) return;

  // Remove focus from button
  cell.blur();

  const { cellsArray, rhythmAudio } = model.state;
  const { cellNum } = cell.dataset;

  cellsArray[cellNum] = !cellsArray[cellNum];

  circlesView.updateActiveDisplay(cellsArray);

  if (model.state.ctx) cellsArray[cellNum] && rhythmAudio.play();
};

const controlShiftForward = function () {
  model.shiftForward();
  circlesView.updateActiveDisplay(model.state.cellsArray);
};

const controlShiftBackward = function () {
  model.shiftBackward();
  circlesView.updateActiveDisplay(model.state.cellsArray);
};

const controlCreateCtx = function () {
  model.createContext();
  playStopView.removeHandlerCreateCtx(controlCreateCtx);
  playStopView.addHandlerStartStop(controlStartStop);
  controlInitDisplay();
};

const controlStartStop = function () {
  const isPlaying = model.state.timer;

  if (isPlaying) {
    playStopView.toggleBtnText(isPlaying);
    controlStopSequence();
  } else {
    playStopView.toggleBtnText(isPlaying);
    controlPlaySequence();
  }
};

const controlPlaySequence = function () {
  const { state } = model;

  const sequence = setTimeout(() => {
    // Play accented pulse sound for the first pulse beat of the bar
    if (state.currentNote === 0) {
      state.pulseAudioHigh.play();
    }
    // Play regular pulse sound for other pulse notes
    else if (
      state.currentNote !== 0 &&
      state.currentNote % state.pulseBeats === 0
    ) {
      state.pulseAudioLow.play();
    }

    // Play wood block sound if current cell is on
    if (state.cellsArray[state.currentNote]) {
      state.rhythmAudio.play();
    }

    circlesView.updateCurrentDisplay(state.currentNote);

    // Advance sequence to the next note
    state.setCurrentNote(state.currentNote + 1);

    // Reset currentNote at the end of the sequence
    if (state.currentNote >= state.cellsArray.length) state.setCurrentNote(0);

    // Call sequence recursively
    controlPlaySequence();
  }, state.BPM);

  state.setTimer(sequence);
};

const controlStopSequence = function () {
  const { state } = model;
  circlesView.updateCurrentDisplay(state.currentNote, false);
  clearTimeout(state.timer);
  state.setCurrentNote(0);
  state.resetTimer();
};

const controlCreateControls = function () {
  const controls = [];
  const pulseGain = new Control('pulseGain', 0, 100, 'Pulse Volume');
  const rhythmGain = new Control('rhythmGain', 0, 100, 'Rhythm Volume');
  const tempo = new Control('tempo', 40, 240, 'Tempo');

  controls.push(pulseGain, rhythmGain, tempo);

  controlsBoxView.render(controls);
};

const controlControlValueChange = function (e) {
  const ctrl = e.target;
  const value = +ctrl.value;

  const controlName = ctrl.closest('.control').id;

  switch (ctrl.dataset.control) {
    case 'tempo':
      model.state.setBPM(value);
      break;
    case 'rhythmGain':
      model.state.rhythmAudio.setGain(value);
      break;
    case 'pulseGain':
      model.state.pulseAudioHigh.setGain(value);
      model.state.pulseAudioLow.setGain(value);
      break;
  }

  controlsBoxView.updateValue(controlName, value);
};

const controlInitDisplay = function () {
  circlesView.revealAnimation();
  playStopView.beginAnimation();
  shiftView.removeHidden();
  controlsBoxView.removeHidden();
};

const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
  circlesView.addHandlerToggleOnOff(controlActiveCells);
  shiftView.addHandlerShiftForward(controlShiftForward);
  shiftView.addHandlerShiftBackward(controlShiftBackward);
  playStopView.addHandlerCreateCtx(controlCreateCtx);
  controlCreateControls();
  controlsBoxView.addHandlerValueChange(controlControlValueChange);
};

init();
