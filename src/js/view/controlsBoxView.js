/**
 * Module which exports an instance of the ControlsBox class.
 * @module ControlsBox
 */

/**
 * ControlsBox Class
 */
class ControlsBox {
  /**
   * @protected
   * @property {Object} - the HTML element which will contain the controls.
   */
  _parentElement = document.querySelector('.container__controls');

  /**
   * Function which calls a handler when a control input is changed.
   * See {@link controlControlValueChange}
   * @param {Function} handler - handler function called when the value of an input changes.
   * @returns {Void}
   */
  addHandlerValueChange(handler) {
    this._parentElement.addEventListener('input', handler);
  }

  /**
   * Function which calls a handler when a control button is clicked.
   * See {@link controlControlBtnClick}
   * @param {Function} handler - handler function called when a button is clicked.
   */
  addHandlerUpDownBtns(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  /**
   * This method finds the control to be updated then calls the setValue method on it, passing the value to be changed.
   * @param {String} controlName - the name of the control whose value will be updated.
   * @param {Number} value - the value to update to.
   * @returns {Void}
   */
  updateValue(controlName, value) {
    const ctrl = this._data.find(ctrlObj => controlName === ctrlObj._name);
    ctrl.setValue(value);
  }

  /**
   * Iterate through controls, removing the hidden class.
   * @returns {Void}
   */
  removeHidden() {
    const hidden = Array.from(
      this._parentElement.querySelectorAll('.u-hidden.control')
    );
    hidden.forEach(control =>
      control.classList.remove('u-hidden', 'u-transparent')
    );
  }

  /**
   * Function which render all the controls, then sets the _parentElement property on each control.
   * see {@link controlCreateControls}
   * @param {Array} data - Array containing the controls created.
   * @returns {Void}
   */
  render(data) {
    if (!data) return;

    this._data = data;

    const markup = this._generateMarkup();

    this._parentElement.innerHTML = markup;

    const controls = this._parentElement.querySelectorAll('.control');

    controls.forEach(control => {
      const ctrl = this._data.find(ctrlObj => control.id === ctrlObj._name);
      ctrl._parentElement = control;
    });
  }

  /**
   * This function calls generateMarkup on each individual control, then joins them all as a single markup string.
   * @returns {String} the markup string containing all controls.
   */
  _generateMarkup() {
    return this._data.map(control => control.generateMarkup(control)).join('');
  }
}

export default new ControlsBox();
