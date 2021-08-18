import {
  PULSE_BEAT_CIRCLE_DIAMETER,
  SUBDIVISION_CIRCLE_DIAMETER,
} from '../config';

class CirclesView {
  _parentElement = document.querySelector('.circle__box');
  _circles;
  _data;

  addHandlerRender(handler) {
    ['load', 'resize'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerToggleOnOff(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  addActiveClass(cellNum) {
    this._circles[cellNum].classList.add('circle__cell--on');
  }

  removeActiveClass(cellNum) {
    this._circles[cellNum].classList.remove('circle__cell--on');
  }

  updateActiveDisplay(cellsArray) {
    this._circles.forEach((_, i) => {
      if (cellsArray[i]) this.addActiveClass(i);
      if (!cellsArray[i]) this.removeActiveClass(i);
    });
  }

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
            class="btn circle__cell" 
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
