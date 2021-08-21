export default class Control {
  constructor(name, min, max, label) {
    this._name = name;
    this._min = min;
    this._max = max;
    this._label = label;
  }

  setValue(value) {
    const input = this._parentElement.querySelector(`#${this._name}Input`);
    const slider = this._parentElement.querySelector(`#${this._name}Slider`);

    input.value = slider.value = value;
  }

  generateMarkup() {
    return `
			<div class="control u-hidden u-transparent" id="${this._name}">
				<label for="${this._name}Input" class="control__label">${this._label}:</label>
				<input
					id="${this._name}Input"
					type="text"
					placeholder="${this._max / 2}"
					class="control__input"
					data-control="${this._name}"
				/>
				<input
					aria-label="${this._label} range slider"
					type="range"
					min="${this._min}"
					max="${this._max}"
					step="1"
					id="${this._name}Slider"
					class="control__slider"
					data-control="${this._name}"
				/>
			</div>
		`;
  }
}
