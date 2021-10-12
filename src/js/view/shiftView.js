/**
 * Module which exports an instance of the ShiftView class.
 * @module ShiftView
 */

/**
 * ShiftView Class
 */
class ShiftView {
  /**
   * @protected
   * @property {Object} - the HTML element containing the forward button
   */
  _forwardBtn = document.querySelector('.btn--plus');
  /**
   * @protected
   * @property {Object} - the HTML element containing the backward button
   */
  _backwardBtn = document.querySelector('.btn--minus');

  /**
   * Function which calls a handler when the forward button is clicked.
   * See {@link controlShiftForward}
   * @param {Function} handler - handler function called when the button is clicked.
   * @returns {Void}
   */
  addHandlerShiftForward(handler) {
    this._forwardBtn.addEventListener('click', handler);
  }

  /**
   * Function which calls a handler when the backward button is clicked.
   * See {@link controlShiftBackward}
   * @param {Function} handler - handler function called when the button is clicked.
   * @returns {Void}
   */
  addHandlerShiftBackward(handler) {
    this._backwardBtn.addEventListener('click', handler);
  }

  /**
   * Function which removes the hidden class on the forward and backward buttons.
   * @returns {Void}
   */
  removeHidden() {
    this._forwardBtn.classList.remove('u-hidden', 'u-transparent');
    this._backwardBtn.classList.remove('u-hidden', 'u-transparent');
  }
}

export default new ShiftView();
