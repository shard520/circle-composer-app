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

/**
 * Handler function which first checks if the current window width is equal to the viewportWidth property stored in the state.
 * If the values do not match, the updateDimensions method is called. The render method is then called on the circlesView.
 * See [addHandlerRender method in CirclesView class.]{@link module:CirclesView~CirclesView#addHandlerRender}
 * @returns {Void}
 */
const controlCircleDisplay = function () {
  if (state.viewportWidth !== window.innerWidth) state.updateDimensions();
  circlesView.render(state);
};

/**
 * Handler function used to toggle the active state of a cell when clicked.
 * The function first toggles the boolean value in the cellsArray using the dataset cellNum property of the event target as the index position.
 * Then the updateActiveDisplay method is called on the circlesView using the cellsArray as the argument. Finally, if the context has been created,
 * and the current cell is active then a confirmation sound is played with the rhythmAudio object.
 * See [addHandlerToggleOnOff method in CirclesView class.]{@link module:CirclesView~CirclesView#addHandlerToggleOnOff}
 * @param {Object} e - the event that called the handler.
 * @returns {Void}
 */
const controlActiveCells = function (e) {
  const cell = e.target;
  if (!cell.classList.contains('circle__cell')) return;

  // Remove focus from button
  cell.blur();

  const { cellsArray, rhythmAudio } = state;
  const { cellNum } = cell.dataset;

  cellsArray[cellNum] = !cellsArray[cellNum];

  circlesView.updateActiveDisplay(cellsArray);

  // Once the context has been created, if the current cell is active then play the rhythm audio.
  if (state.ctx) cellsArray[cellNum] && rhythmAudio.play();
};

/**
 * Handler function which calls the shiftForward function in the model,
 * then updates the active display in the CirclesView with the new values.
 * See [addHandlerShiftForward method in ShiftView class.]{@link module:ShiftView~ShiftView#addHandlerShiftForward}
 * @returns {Void}
 */
const controlShiftForward = function () {
  model.shiftForward();
  circlesView.updateActiveDisplay(state.cellsArray);
};

/**
 * Handler function which calls the shiftBackward function in the model,
 * then updates the active display in the CirclesView with the new values.
 * See [addHandlerShiftBackward method in ShiftView class.]{@link module:ShiftView~ShiftView#addHandlerShiftBackward}
 * @returns {Void}
 */
const controlShiftBackward = function () {
  model.shiftBackward();
  circlesView.updateActiveDisplay(state.cellsArray);
};

/**
 * Handler function which first creates the audio context after the required user interaction (clicking the playStopBtn),
 * then removes the handler and replaces it with one which controls the sequence starting/stopping,
 * finally the function calls {@link controlInitDisplay} to initialise the display.
 * See [addHandlerCreateCtx]{@link module:PlayStopView~PlayStopView#addHandlerCreateCtx}
 * and [removeHandlerCreateCtx]{@link module:PlayStopView~PlayStopView#removeHandlerCreateCtx}
 * methods in the PlayStopView class.
 * @returns {Void}
 */
const controlCreateCtx = function () {
  model.createContext();
  playStopView.removeHandlerCreateCtx(controlCreateCtx);
  playStopView.addHandlerStartStop(controlStartStop);
  controlInitDisplay();
};

/**
 * Handler function which checks if the sequence is currently playing or not. If it's playing,
 * then set the button text from 'Stop' to 'Play' and call {@link controlStopSequence}.
 * If the sequence isn't playing, set the button text from 'Play' to 'Stop',
 * then set the next note time in the state to the current time on the audio context, then call {@link controlScheduleSequence}.
 * See [addHandlerStartStop]{@link module:PlayStopView~PlayStopView#addHandlerStartStop}.
 * @returns {Void}
 */
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

/**
 * This function takes the scheduled time for the next note, then checks if the current note is a pulse beat,
 * and calls the play method on either the accented or regular pulse sounds, as well as the rhythm sound if the current note is active.
 * @param {Number} time - the time in relation to the audio context time that the next note should be played.
 * @returns {Void}
 */
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

/**
 * Sets the next note time according to the current time signature and beat subdivision, then
 * advances the sequence to the next note. If the sequence has completed then the current note is reset to 0.
 * @returns {Void}
 */
const controlSetNextNote = function () {
  const secondsPerBeat = 60 / state.BPM;

  // Set the next note time according to the current time signature and beat subdivision
  state.setNextNoteTime(
    state.nextNoteTime + (state.pulseBeats / state.numOfBeats) * secondsPerBeat
  );

  // Advance sequence to the next note
  state.setCurrentNote(state.currentNote + 1);

  // Reset currentNote at the end of the sequence
  if (state.currentNote >= state.cellsArray.length) state.setCurrentNote(0);
};

/**
 * This function schedules the next note to be played by setting an interval timer which calls this function
 * with the interval time set by the config variable [SCHEDULER_INTERVAL]{@link module:config.SCHEDULER_INTERVAL}. When the function is called,
 * a while loop is used which executes while the nextNoteTime is less than the current time + a lookahead time
 * set by the config variable [SCHEDULER_LOOKAHEAD]{@link module:config.SCHEDULER_LOOKAHEAD}. When the code in the while block executes, the next note
 * is cued by passing the nextNoteTime to the {@link controlSequence} function, then the display is updated with the current
 * note style before the nextNoteTime is updated by calling {@link controlSetNextNote}. Before each timer is set,
 * the previous timer is cleared. Due to the the interval timer calling itself regularly to schedule future notes,
 * the timing of the application is much more robust because of the overlap which accomodates for the timer call
 * being blocked on the main thread. This is adapted from [this article]{@link https://www.html5rocks.com/en/tutorials/audio/scheduling/}
 * which contains a more detailed explanation.
 * @returns {Void}
 */
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

/**
 * When the sequence is stopped, the [updateCurrentDisplay]{@link module:CirclesView~CirclesView#updateCurrentDisplay}
 * is called setting the isPlaying parameter to false, which will remove the current note style without adding it to the
 * next cell. Then the timer is cleared and the current note is reset to 0.
 * @returns {Void}
 */
const controlStopSequence = function () {
  circlesView.updateCurrentDisplay(state.currentNote, false);
  clearInterval(state.timer);
  state.setCurrentNote(0);
  state.resetTimer();
};

/**
 * This creates all controls as instances of the [Control class]{@link module:Control},
 * then passes an array of the controls to the render method on the [controlsBoxView]{@link module:ControlsBox~ControlsBox#render}
 * @returns {Void}
 */
const controlCreateControls = function () {
  const controls = [];
  const tempo = new Control(
    'tempo',
    40,
    240,
    'Tempo',
    'metronome',
    'minus-circle',
    'add-circle'
  );
  const pulseGain = new Control(
    'pulseGain',
    0,
    100,
    'Pulse volume',
    'pulse',
    'speaker-quieter',
    'speaker-louder'
  );
  const rhythmGain = new Control(
    'rhythmGain',
    0,
    100,
    'Rhythm volume',
    'drumsticks',
    'speaker-quieter',
    'speaker-louder'
  );

  controls.push(tempo, pulseGain, rhythmGain);

  controlsBoxView.render(controls);
};

/**
 * Handler function which updates the state with the value of the control which
 * has been changed, then updates the display with the new value.
 * @param {Object} e - the event which called the handler
 * @returns {Void}
 */
const controlControlValueChange = function (e) {
  const ctrl = e.target;
  const value = +ctrl.value;

  const controlName = ctrl.closest('.control').id;

  switch (ctrl.dataset.control) {
    case 'tempo':
      state.BPM = value;
      break;
    case 'rhythmGain':
      state.rhythmAudio.gain = value;
      break;
    case 'pulseGain':
      state.pulseAudioHigh.gain = value;
      state.pulseAudioLow.gain = value;
      break;
  }

  controlsBoxView.updateValue(controlName, value);
};

/**
 * Handler function which increments or decrements the value of the control
 * depending on which button was clicked, then updates the control display.
 * @param {Object} e - the event which called the handler
 * @returns {Void}
 */
const controlControlBtnClick = function (e) {
  const ctrl = e.target;
  const btn = ctrl.dataset.btn;

  if (!btn) return;

  const controlName = ctrl.closest('.control').id;

  let value = 0;

  if (controlName === 'tempo') value = state.BPM;
  if (controlName === 'rhythmGain') value = state.rhythmAudio.gain;
  if (controlName === 'pulseGain') {
    value = state.pulseAudioHigh.gain;
  }

  value = btn === 'up' ? ++value : --value;

  if (controlName === 'tempo') state.BPM = value;
  if (controlName === 'rhythmGain') state.rhythmAudio.gain = value;
  if (controlName === 'pulseGain') {
    state.pulseAudioHigh.gain = state.pulseAudioLow.gain = value;
  }

  controlsBoxView.updateValue(controlName, value);
};

/**
 * This function is called when {@link controlCreateCtx} is executed, and
 * initialises the display by triggering the animations on the circles and play/stop
 * button, and removing the hidden style for the shift buttons and the controls.
 * @returns {Void}
 */
const controlInitDisplay = function () {
  circlesView.revealAnimation();
  playStopView.beginAnimation();
  shiftView.removeHidden();
  controlsBoxView.removeHidden();
};

/**
 * The entry point into the program, this adds handlers using the publisher/subscriber pattern
 * which allow the views to interact with the model, as well as creating the control objects,
 * @returns {Void}
 */
const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
  circlesView.addHandlerToggleOnOff(controlActiveCells);
  shiftView.addHandlerShiftForward(controlShiftForward);
  shiftView.addHandlerShiftBackward(controlShiftBackward);
  playStopView.addHandlerCreateCtx(controlCreateCtx);
  controlCreateControls();
  controlsBoxView.addHandlerValueChange(controlControlValueChange);
  controlsBoxView.addHandlerUpDownBtns(controlControlBtnClick);
  console.log(state);
};

init();
