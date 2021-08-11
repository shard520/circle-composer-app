import {
  PULSE_BEAT_CIRCLE_DIAMETER,
  SUBDIVISION_CIRCLE_DIAMETER,
} from '../config';

class CirclesView {
  _parentElement = document.querySelector('.circle__box');
  _data;

  addHandlerRender(handler) {
    ['load', 'resize'].forEach(ev => window.addEventListener(ev, handler));
  }

  render(data) {
    if (!data) return;

    this._data = data;

    this._parentElement.style.width = `${this._data.boxSize}px`;
    this._parentElement.style.height = `${this._data.boxSize}px`;

    const markup = this._generateMarkup();

    this._parentElement.innerHTML = markup;
  }

  _generateMarkup() {
    const markup = this._data.cellCoords
      .map(([x, y], i) => {
        const radius =
          (this._data.boxSize / 2) *
          (i % this._data.pulseBeats === 0
            ? PULSE_BEAT_CIRCLE_DIAMETER
            : SUBDIVISION_CIRCLE_DIAMETER);
        return `
          <div class ="circle__cell" style="
            height: ${radius * 2}px;
            width: ${radius * 2}px;
            left: ${x - radius}px;
            top: ${y - radius}px;
          ">
          </div> `;
      })
      .join('');

    return markup;
  }
}

export default new CirclesView();
