import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import circlesView from './view/circlesView';

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

  const { cellNum } = cell.dataset;
  if (model.state.cellsArray[cellNum]) circlesView.removeActiveClass(cellNum);
  if (!model.state.cellsArray[cellNum]) circlesView.addActiveClass(cellNum);

  model.state.cellsArray[cellNum] = !model.state.cellsArray[cellNum];
};

const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
  circlesView.addHandlerToggleOnOff(controlActiveCells);
};

init();
