import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import circlesView from './view/circlesView';
import shiftView from './view/shiftView';

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

const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
  circlesView.addHandlerToggleOnOff(controlActiveCells);
  shiftView.addHandlerShiftForward(controlShiftForward);
  shiftView.addHandlerShiftBackward(controlShiftBackward);
};

init();
