import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import circlesView from './view/circlesView';
import shiftView from './view/shiftView';
import playStopView from './view/playStopView';
import controlsBoxView from './view/controlsBoxView';
import Control from './view/controlView';

import { SCHEDULER_LOOKAHEAD, SCHEDULER_INTERVAL } from './config';

const { state } = model;

console.log(state);

const controlCircleDisplay = function () {
  if (state.viewportWidth !== window.innerWidth) state.updateDimensions();
  circlesView.render(state);
};

const controlActiveCells = function (e) {
  const cell = e.target;
  if (!cell.classList.contains('circle__cell')) return;

  // Remove focus from button
  cell.blur();

  const { cellsArray, rhythmAudio } = state;
  const { cellNum } = cell.dataset;

  cellsArray[cellNum] = !cellsArray[cellNum];

  circlesView.updateActiveDisplay(cellsArray);

  if (state.ctx) cellsArray[cellNum] && rhythmAudio.play();
};

const controlShiftForward = function () {
  model.shiftForward();
  circlesView.updateActiveDisplay(state.cellsArray);
};

const controlShiftBackward = function () {
  model.shiftBackward();
  circlesView.updateActiveDisplay(state.cellsArray);
};

const controlCreateCtx = function () {
  model.createContext();
  playStopView.removeHandlerCreateCtx(controlCreateCtx);
  playStopView.addHandlerStartStop(controlStartStop);
  controlInitDisplay();
};

const controlStartStop = function () {
  const isPlaying = state.timer;

  if (isPlaying) {
    playStopView.toggleBtnText(isPlaying);
    controlStopSequence();
  } else {
    playStopView.toggleBtnText(isPlaying);

    state.setNextNoteTime(state.ctx.currentTime);

    controlScheduleSequence();
  }
};

const controlSequence = function (time) {
  // Play accented pulse sound for the first pulse beat of the bar
  if (state.currentNote === 0) {
    state.pulseAudioHigh.play(time);
  }
  // Play regular pulse sound for other pulse notes
  else if (
    state.currentNote !== 0 &&
    state.currentNote % state.pulseBeats === 0
  ) {
    state.pulseAudioLow.play(time);
  }

  // Play wood block sound if current cell is on
  if (state.cellsArray[state.currentNote]) {
    state.rhythmAudio.play(time);
  }
};

const controlSetNextNote = function () {
  const secondsPerBeat = (state.BPM * state.pulseBeats) / 1000;

  // Set the next note time according to the current time signature and beat subdivision
  state.setNextNoteTime(
    state.nextNoteTime + (state.pulseBeats / state.numOfBeats) * secondsPerBeat
  );

  // Advance sequence to the next note
  state.setCurrentNote(state.currentNote + 1);

  // Reset currentNote at the end of the sequence
  if (state.currentNote >= state.cellsArray.length) state.setCurrentNote(0);
};

const controlScheduleSequence = function () {
  while (state.nextNoteTime < state.ctx.currentTime + SCHEDULER_LOOKAHEAD) {
    controlSequence(state.nextNoteTime);

    circlesView.updateCurrentDisplay(state.currentNote);

    controlSetNextNote();
  }

  clearInterval(state.timer);
  const timer = setInterval(controlScheduleSequence, SCHEDULER_INTERVAL);

  state.setTimer(timer);
};

const controlStopSequence = function () {
  circlesView.updateCurrentDisplay(state.currentNote, false);
  clearInterval(state.timer);
  state.setCurrentNote(0);
  state.resetTimer();
};

const controlCreateControls = function () {
  const controls = [];
  const pulseGain = new Control('pulseGain', 0, 100, 'Pulse Volume', 'pulse');
  const rhythmGain = new Control(
    'rhythmGain',
    0,
    100,
    'Rhythm Volume',
    'drumsticks'
  );
  const tempo = new Control('tempo', 40, 240, 'Tempo', 'metronome');

  controls.push(pulseGain, rhythmGain, tempo);

  controlsBoxView.render(controls);
};

const controlControlValueChange = function (e) {
  const ctrl = e.target;
  const value = +ctrl.value;

  const controlName = ctrl.closest('.control').id;

  switch (ctrl.dataset.control) {
    case 'tempo':
      state.setBPM(value);
      break;
    case 'rhythmGain':
      state.rhythmAudio.setGain(value);
      break;
    case 'pulseGain':
      state.pulseAudioHigh.setGain(value);
      state.pulseAudioLow.setGain(value);
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
