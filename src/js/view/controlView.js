import icons from 'url:../../icons.svg';

/**
 * Module which exports the Control class.
 * @module Control
 */
export default class Control {
  /**
   * Constructor function to set the initial values for each control.
   * @param {String} name - the name of the control.
   * @param {Number} min - the minimum value of the control.
   * @param {Number} max - the maximum value of the control.
   * @param {String} label - the label to be displayed.
   * @param {String} icon - the name of the icon.
   * @returns {Void}
   */
  constructor(name, min, max, label, icon) {
    this._name = name;
    this._min = min;
    this._max = max;
    this._label = label;
    this._icon = icon;
  }

  /**
   * Sets the value on the control's input field and range slider.
   * @param {Number} value - the value to be set.
   * @returns {Void}
   */
  setValue(value) {
    const input = this._parentElement.querySelector(`#${this._name}Input`);
    const slider = this._parentElement.querySelector(`#${this._name}Slider`);

    input.value = slider.value = value;
  }

  /**
   * Generates the markup string for a control with the attributes set to the values contained on the instance of the control.
   * @returns {String} a string containing the markup for a control.
   */
  generateMarkup() {
    return `
			<div class="control u-hidden u-transparent" id="${this._name}">
				<label for="${this._name}Input" aria-label="${
      this._label
    } input" class="control__label">
					<svg class="icon icon__control">
						<use href="${icons}#icon-${this._icon}"></use>
					</svg>
				</label>
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
