import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import circlesView from './view/circlesView';
import shiftView from './view/shiftView';
import playStopView from './view/playStopView';

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

  const { cellsArray } = model.state;
  const { cellNum } = cell.dataset;

  cellsArray[cellNum] = !cellsArray[cellNum];

  circlesView.updateActiveDisplay(cellsArray);
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
    // Play wood block sound if current cell is on
    if (state.cellsArray[state.currentNote]) {
      state.rhythmAudio.play();
    }

    circlesView.addCurrentDisplay(state.currentNote);

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
  clearTimeout(model.state.timer);
  model.state.setCurrentNote(0);
  model.state.resetTimer();
};

const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
  circlesView.addHandlerToggleOnOff(controlActiveCells);
  shiftView.addHandlerShiftForward(controlShiftForward);
  shiftView.addHandlerShiftBackward(controlShiftBackward);
  playStopView.addHandlerCreateCtx(controlCreateCtx);
};

init();
