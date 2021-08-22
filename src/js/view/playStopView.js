class PlayStopView {
  _parentElement = document.querySelector('.btn--play-stop');

  addHandlerCreateCtx(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  removeHandlerCreateCtx(handler) {
    this._parentElement.removeEventListener('click', handler);
  }

  addHandlerStartStop(handler) {
    this._parentElement.addEventListener('click', () => {
      this._parentElement.blur();
      handler();
    });
    this._parentElement.innerHTML = `<p class="btn__text">Play</p>`;
  }

  toggleBtnText(isPlaying) {
    const text = isPlaying ? 'Play' : 'Stop';
    this._parentElement.innerHTML = `<p class="btn__text">${text}</p>`;
  }

  beginAnimation() {
    this._parentElement.blur();
    this._parentElement.classList.remove('u-grow');
  }
}

export default new PlayStopView();
