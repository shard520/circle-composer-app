import State from './model/state';
import AudioObj from './model/audioObj';

import woodBlockWAV from 'url:../audio/wood_block.wav';

export const state = new State(16, 4, 60);

export const shiftForward = function () {
  const { cellsArray } = state;

  // Create new array with values from the first to the penultimate values from cellsArray
  const newCellsArr = cellsArray.slice(0, cellsArray.length - 1);
  // Add the last value of cellsArray to the start of the new array
  newCellsArr.unshift(cellsArray[cellsArray.length - 1]);

  // Update values of cellsArray
  state.updateCellsArray(newCellsArr);
};

export const shiftBackward = function () {
  const { cellsArray } = state;

  // Create new array with values from the second to the penultimate values from cellsArray
  const newCellsArr = cellsArray.slice(1);
  // Add the first value of cellsArray to the end of the new array
  newCellsArr.push(cellsArray[0]);

  // Update values of cellsArray
  state.updateCellsArray(newCellsArr);
};

export const createContext = async function () {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  state.ctx = new AudioContext();

  state.rhythmAudio = new AudioObj(woodBlockWAV);

  await state.rhythmAudio.createAudio(state.ctx);
};
