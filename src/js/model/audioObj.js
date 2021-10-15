import { INITIAL_GAIN_VALUE } from '../config';

/**
 * Module which exports AudioObj class
 * @module AudioObj
 */

/**
 * Class which creates an audio object.
 */
export default class AudioObj {
  /**
   * @param {string} url - location of audio file
   */
  constructor(url) {
    this._url = url;
  }

  /**
   * Asynchronously fetch and decode audio data:
   *
   * The object stores a copy of the audio context then asynchronously loads and processes the audio ready to use.
   * A gain node is created and stored in the object with an initial gain value imported from config variables.
   *
   * @param {Object} ctx - a reference to the audio context object which must be created before calling this method
   * @returns {this}
   */
  async createAudio(ctx) {
    try {
      /**
       * @protected
       * @property {Object} - the audio context
       */
      this._ctx = ctx;

      /**
       * @protected
       * @property {Object} - the response from fetching the url
       */
      this._file = await fetch(this._url);

      /**
       * @protected
       * @property {Object} - the array buffer containing the response
       */
      this._buffer = await this._file.arrayBuffer();

      /**
       * @protected
       * @property {Object} - the decoded audio data from the array buffer
       */
      this._audio = await this._ctx.decodeAudioData(this._buffer);

      /**
       * @protected
       * @property {Object} - a gain node to store the desired volume
       */
      this._gainNode = this._ctx.createGain();

      this._gainNode.gain.value = INITIAL_GAIN_VALUE;

      return this;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Setter to set the gain (volume) on the audio object. This value is stored on the AudioParam node
   * as a 32-bit number so Math.fround is used to preserve precision when converting from 64-bit to 32-bit,
   * however the value set will not always be equal to the argument passed.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value#value_precision_and_variation}
   * @param {Number} value - a percentage value of gain
   * @returns Number - gain percentage as a number between 0-1
   */
  set gain(value) {
    return (this._gainNode.gain.value = Math.fround(value / 100));
  }

  /**
   * Getter which returns the current gain value. This value is returned as a rounded integer due to the imprecision
   * of the 32-bit value stored by the Web Audio API.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/value#value_precision_and_variation}
   * @returns {Number} - the current gain value as a percentage
   */
  get gain() {
    return Math.round(this._gainNode.gain.value * 100);
  }

  /**
   * Play audio at a given time according to the current gain value
   * @param {Number} time - the time in seconds that the audio should be played. Default is the current time.
   * @returns {this}
   */
  play(time = this._ctx.currentTime) {
    /**
     * @protected
     * @property {Object} - a buffer source node used to play the audio
     */
    this._source = this._ctx.createBufferSource();

    this._source.buffer = this._audio;

    this._source.connect(this._gainNode).connect(this._ctx.destination);

    this._source.start(time);

    return this;
  }
}
