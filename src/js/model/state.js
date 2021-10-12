import getCoords from './getCoords';

/**
 * Module to export the state object
 * @module State
 */
export default class State {
  /**
   * @property {Number} - the timer used to call the note scheduler.
   */
  timer;
  /**
   * @property {Number} - the current note in the sequence.
   */
  currentNote = 0;

  /**
   * Constructor to initialise with given arguments, then initialise array of booleans to store the sequence, then calculate display information.
   * @param {Number} numOfBeats - the number of beats in 1 bar of the sequence.
   * @param {Number} pulseBeats - the number of pulse beats in 1 bar of the sequence.
   * @param {Number} BPM - the tempo of the sequence measured in beats per minute.
   * @returns {Void}
   */
  constructor(numOfBeats, pulseBeats, BPM) {
    this.numOfBeats = numOfBeats;
    this.pulseBeats = pulseBeats;
    this.BPM = this.setBPM(BPM);

    /**
     * @property {Array} - an array of booleans with length equal to the number of beats, initialised to false.
     * When a cell is activated in the UI the controller sets the array value at the corresponding index position to true.
     */
    this.cellsArray = new Array(this.numOfBeats).fill(false);

    this.updateDimensions();
  }

  /**
   * This method is called in the updateDimensions method, it sets the value used for the height and width of the circle container.
   * If the window inner width is more than 800px the method returns 800, otherwise the method returns 90% of the current window width.
   * @protected
   * @returns {Number} the new size of the circle container.
   */
  _setBoxSize() {
    return window.innerWidth > 800 ? 800 : window.innerWidth * 0.9;
  }

  /**
   * Function to convert the tempo in beats per minute and return the length of time 1 subdivision beat takes at that tempo.
   * @param {Number} BPM - the tempo of the sequence measured in beats per minute.
   * @returns {Number} the time in milliseconds for 1 subdivision beat at the current tempo.
   */
  setBPM(BPM) {
    return (this.BPM = parseInt(((60 / BPM) * 1000) / this.pulseBeats));
  }

  /**
   * Set the current note in the sequence.
   * @param {Number} num - the new current note.
   * @returns {Number} the new current note.
   */
  setCurrentNote(num) {
    return (this.currentNote = num);
  }

  /**
   * Set the time that the next note should be played.
   * @param {Number} time - the time in seconds that the audio context should play the next note.
   * @returns {Number} the time in seconds that the audio context should play the next note.
   */
  setNextNoteTime(time) {
    return (this.nextNoteTime = time);
  }

  /**
   * Set the timer property with the ID of the interval timer currently used in the note scheduler.
   * @param {Number} timer - the ID of the timer currently used in the note scheduler.
   * @returns {Object} the current timer.
   */
  setTimer(timer) {
    return (this.timer = timer);
  }

  /**
   * Update all the values in the sequence array when a shift button is pressed.
   * @param {Array} newArray - the new sequence after being shifted.
   * @returns {Array} the new sequence.
   */
  updateCellsArray(newArray) {
    return (this.cellsArray = [...newArray]);
  }

  /**
   * Update all dimension measurements.
   * @returns {Void}
   */
  updateDimensions() {
    /**
     * @property {Number} - the current viewport width in pixels.
     */
    this.viewportWidth = window.innerWidth;

    /**
     * @property {Number} - the current width and height of the circles container in pixels.
     */
    this.boxSize = this._setBoxSize();
    /**
     * The x/y coordinates for the cell buttons that display the subdivision and pulse beats.
     * See {@link module:getCoords}
     * @property {Array} - an array of arrays, with each inner array containing an x/y coordinate represented as 2 numbers.
     */
    this.cellCoords = getCoords(this.numOfBeats, this.boxSize);
  }

  /**
   * Reset the interval timer to a falsey value to allow a conditional check to see the sequence has stopped.
   * @returns {Undefined} - used in conditional check when the sequence has stopped playing.
   */
  resetTimer() {
    return (this.timer = undefined);
  }
}
