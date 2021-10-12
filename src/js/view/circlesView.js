import {
  PULSE_BEAT_CIRCLE_DIAMETER,
  SUBDIVISION_CIRCLE_DIAMETER,
} from '../config';

/**
 * Module which exports an instance of the CirclesView class.
 * @module CirclesView
 */

/**
 * CirclesView Class
 */
class CirclesView {
  /**
   * @protected
   * @property {Object} - the HTML element which will contain the main circle cells.
   */
  _parentElement = document.querySelector('.circle__box');

  /**
   * Function which calls a handler on page load and window resize events.
   * See {@link controlCircleDisplay}
   * @param {Function} handler - handler function to be called on page load and page resize.
   * @returns {Void}
   */
  addHandlerRender(handler) {
    ['load', 'resize'].forEach(ev => window.addEventListener(ev, handler));
  }

  /**
   * Function which calls a handler when the parent element is clicked.
   * See {@link controlActiveCells}
   * @param {Function} handler - handler function to be called when the parent element is clicked.
   * @returns {Void}
   */
  addHandlerToggleOnOff(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  /**
   * Add the active CSS class to the current cell.
   * @protected
   * @param {Number} cellNum - the index position of the current cell.
   * @returns {Void}
   */
  _addActiveClass(cellNum) {
    this._circles[cellNum].classList.add('circle__cell--on');
  }

  /**
   * Remove the active CSS class on the current cell.
   * @protected
   * @param {Number} cellNum - the index position of the current cell.
   * @returns {Void}
   */
  _removeActiveClass(cellNum) {
    this._circles[cellNum].classList.remove('circle__cell--on');
  }

  /**
   * This method iterates over each element in the circles array and adds the active CSS class to all cells
   * where the corresponding value in the cellsArray is true, and removes the active class where the value is false.
   * @param {Array} cellsArray - an array of boolean values containing the current sequence
   * @returns {Void}
   */
  updateActiveDisplay(cellsArray) {
    this._circles.forEach((_, i) => {
      if (cellsArray[i]) this._addActiveClass(i);
      if (!cellsArray[i]) this._removeActiveClass(i);
    });
  }

  /**
   * This method is used to add or remove the current note CSS class.
   * If the sequence is playing then the current CSS class is added to the cell that corresponds to the index position of the current note,
   * then the current class is removed from the previous note by subtracting 1 from the current note, or if the current note is 0 then by subtracting 1 from the array length.
   * @param {Number} currentNote - the current note in the sequence.
   * @param {Boolean} isPlaying = boolean representing whether or not the sequence is playing, default value is true.
   * @returns {Void}
   */
  updateCurrentDisplay(currentNote, isPlaying = true) {
    // Add current note style if sequence is playing
    if (isPlaying)
      this._circles[currentNote].classList.add('circle__cell--current');

    // Remove current note style from previous beat, either the currentNote - 1,
    // or when the currentNote is 0 then the last array element - 1
    this._circles[(currentNote || this._circles.length) - 1].classList.remove(
      'circle__cell--current'
    );
  }

  /**
   * Function to animate the circle cells when the user initiates the program.
   * Whilst iterating over each cell, a setTimeout is called to remove the hidden class and add the active class,
   * with the timer delay set to a multiple of the index in the forEach method called on the circle cells.
   * Once the index reaches the final iteration a second function is called which iterates over the circle cells and removes the active class,
   * using another setTimeout function with the timer delay set to a multiple of the index.
   * @returns {Void}
   */
  revealAnimation() {
    this._circles.forEach((cell, i) => {
      setTimeout(() => {
        cell.classList.remove('u-hidden', 'u-transparent');
        this._addActiveClass(i);
        if (i === this._circles.length - 1) animPart2();
      }, i * 50);
    });

    const animPart2 = () => {
      this._circles.forEach((_, i) => {
        setTimeout(() => {
          this._removeActiveClass(i);
        }, i * 75);
      });
    };
  }

  /**
   * Function which renders the circles used to program the sequence according to the current display dimensions stored on the state object,
   * then updates the active display according to the values in the cellsArray.
   * @param {Object} data - state object which contains dimension values.
   * @returns {Void}
   */
  render(data) {
    if (!data) return;

    this._data = data;

    this._parentElement.style.width = `${this._data.boxSize}px`;
    this._parentElement.style.height = `${this._data.boxSize}px`;

    const markup = this._generateMarkup();

    this._parentElement.innerHTML = markup;

    this._circles = document.querySelectorAll('.circle__cell');

    this.updateActiveDisplay(this._data.cellsArray);
  }

  /**
   * Function which generates a markup string containing all the cell button elements.
   * For each element in the cellCoords array, the x/y values are used to position the left and top values of the button.
   * The radius of each circle is determined in proportion to the containing element. If the cell is an accented pulse beat,
   * the radius is larger than for regular subdivision beats. This ratio is determined via a config variable.
   * If the audio context has not been created when the cells are rendered, a hidden and transparent utility CSS class is added.
   * @returns {String} markup string with button elements.
   */
  _generateMarkup() {
    return this._data.cellCoords
      .map(([x, y], i) => {
        const radius =
          (this._data.boxSize / 2) *
          (i % this._data.pulseBeats === 0
            ? PULSE_BEAT_CIRCLE_DIAMETER
            : SUBDIVISION_CIRCLE_DIAMETER);
        return `
          <button data-cell-num="${i}" aria-label="Toggle beat ${
          i + 1
        } on or off" 
            class="btn circle__cell ${
              this._data.ctx ? '' : 'u-hidden u-transparent'
            }" 
            style="
              height: ${radius * 2}px;
              width: ${radius * 2}px;
              left: ${x - radius}px;
              top: ${y - radius}px;
            ">
          </button> `;
      })
      .join('');
  }
}

export default new CirclesView();
