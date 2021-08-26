import getCoords from './getCoords';

export default class State {
  timer;
  currentNote = 0;

  constructor(numOfBeats, pulseBeats, BPM) {
    this.numOfBeats = numOfBeats;
    this.pulseBeats = pulseBeats;
    this.BPM = this.setBPM(BPM);

    this.cellsArray = new Array(this.numOfBeats).fill(false);

    this.updateDimensions();
  }

  _getBoxSize() {
    return window.innerWidth > 800 ? 800 : window.innerWidth * 0.9;
  }

  setBPM(BPM) {
    return (this.BPM = parseInt(((60 / BPM) * 1000) / this.pulseBeats));
  }

  setCurrentNote(num) {
    return (this.currentNote = num);
  }

  setNextNoteTime(time) {
    return (this.nextNoteTime = time);
  }

  setTimer(timer) {
    return (this.timer = timer);
  }

  updateCellsArray(newArray) {
    this.cellsArray = [...newArray];
  }

  updateDimensions() {
    this.viewportWidth = window.innerWidth;
    this.boxSize = this._getBoxSize();
    this.cellCoords = getCoords(this.numOfBeats, this.boxSize);
  }

  resetTimer() {
    return (this.timer = 0);
  }
}
