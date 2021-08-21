import { INITIAL_GAIN_VALUE } from '../config';

export default class AudioObj {
  constructor(url) {
    this._url = url;
  }

  async createAudio(ctx) {
    try {
      this._ctx = ctx;

      this._file = await fetch(this._url);

      this._buffer = await this._file.arrayBuffer();

      this._audio = await this._ctx.decodeAudioData(this._buffer);

      this._gainNode = this._ctx.createGain();

      this._gainNode.gain.value = INITIAL_GAIN_VALUE;
    } catch (err) {
      console.error(err);
    }
  }

  setGain(value) {
    return (this._gainNode.gain.value = value / 100);
  }

  play() {
    this._source = this._ctx.createBufferSource();

    this._source.buffer = this._audio;

    this._source.connect(this._gainNode).connect(this._ctx.destination);

    this._source.start();
  }
}
