/**
 * Module which exports an instance of the PlayStopView class.
 * @module PlayStopView
 */

/**
 * PlayStopView Class
 */
class PlayStopView {
  /**
   * @protected
   * @property {Object} - the HTML element containing the button which creates the audio context then controls the sequence playing and stopping.
   */
  _parentElement = document.querySelector('.btn--play-stop');

  /**
   * Function to add a handler which is called the first time the button is clicked.
   * See {@link controlCreateCtx}
   * @param {Function} handler - the handler to be called when the button is clicked.
   * @returns {Void}
   */
  addHandlerCreateCtx(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  /**
   * Function to remove the handler which creates the audio context.
   * See {@link controlCreateCtx}
   * @param {Function} handler - the handler to be removed after context has been created.
   * @returns {Void}
   */
  removeHandlerCreateCtx(handler) {
    this._parentElement.removeEventListener('click', handler);
  }

  /**
   * Function to add a click event listener, which removes focus from the button and calls a handler function.
   * The function then sets the text inside the button to 'Play'.
   * See {@link controlStartStop}
   * @param {Function} handler - the handler funciton to be called when the button is clicked.
   * @returns {Void}
   */
  addHandlerStartStop(handler) {
    this._parentElement.addEventListener('click', () => {
      this._parentElement.blur();
      handler();
    });
    this._parentElement.innerHTML = `<p class="btn__text">Play</p>`;
  }

  /**
   * This method sets the text inside the button to either 'Play' or 'Stop', depending on the value of the argument passed.
   * @param {Number|Undefined} isPlaying - either the ID of the sequence timer, or undefined to represent a falsey value
   * @returns {Void}
   */
  toggleBtnText(isPlaying) {
    const text = isPlaying ? 'Play' : 'Stop';
    this._parentElement.innerHTML = `<p class="btn__text">${text}</p>`;
  }

  /**
   * Function to remove focus and the grow CSS class when the button is clicked for the first time.
   * @returns {Void}
   */
  beginAnimation() {
    this._parentElement.blur();
    this._parentElement.classList.remove('u-grow');
  }
}

export default new PlayStopView();
