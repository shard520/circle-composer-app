import getCoords from './getCoords';

export class State {
  timer;
  currentNote = 0;

  constructor(numOfBeats, pulseBeats, BPM) {
    this.numOfBeats = numOfBeats;
    this.pulseBeats = pulseBeats;
    this.BPM = this.setBPM(BPM);

    this.cellsArray = new Array(this.numOfBeats).fill(false);

    this.updateDimensions();
  }

  getBoxSize() {
    return window.innerWidth > 800 ? 800 : window.innerWidth * 0.9;
  }

  setBPM(BPM) {
    return (this.BPM = parseInt(((60 / BPM) * 1000) / this.pulseBeats));
  }

  updateDimensions() {
    this.viewportWidth = window.innerWidth;
    this.boxSize = this.getBoxSize();
    this.cellCoords = getCoords(this.numOfBeats, this.boxSize);
  }
}
