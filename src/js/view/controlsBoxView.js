class ControlsBox {
  _parentElement = document.querySelector('.container__controls');
  _data;

  addHandlerValueChange(handler) {
    this._parentElement.addEventListener('input', handler);
  }

  updateValue(controlName, value) {
    const ctrl = this._data.find(ctrlObj => controlName === ctrlObj._name);
    ctrl.setValue(value);
  }

  removeHidden() {
    const hidden = Array.from(
      this._parentElement.querySelectorAll('.u-hidden.control')
    );
    hidden.forEach(control =>
      control.classList.remove('u-hidden', 'u-transparent')
    );
  }

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

  _generateMarkup() {
    return this._data.map(control => control.generateMarkup(control)).join('');
  }
}

export default new ControlsBox();
