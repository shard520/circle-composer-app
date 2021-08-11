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

const init = function () {
  circlesView.addHandlerRender(controlCircleDisplay);
};

init();
