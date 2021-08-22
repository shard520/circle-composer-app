class ShiftView {
  _forwardBtn = document.querySelector('.btn--plus');
  _backwardBtn = document.querySelector('.btn--minus');

  addHandlerShiftForward(handler) {
    this._forwardBtn.addEventListener('click', handler);
  }
  addHandlerShiftBackward(handler) {
    this._backwardBtn.addEventListener('click', handler);
  }

  removeHidden() {
    this._forwardBtn.classList.remove('u-hidden', 'u-transparent');
    this._backwardBtn.classList.remove('u-hidden', 'u-transparent');
  }
}

export default new ShiftView();
