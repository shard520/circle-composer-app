export default class AudioObj {
  _file;
  _buffer;
  _audio;
  _ctx;
  _source;

  constructor(url) {
    this._url = url;
  }

  async createAudio(ctx) {
    try {
      this._ctx = ctx;

      this._file = await fetch(this._url);

      this._buffer = await this._file.arrayBuffer();

      this._audio = await this._ctx.decodeAudioData(this._buffer);
    } catch (err) {
      console.error(err);
    }
  }

  play() {
    this._source = this._ctx.createBufferSource();

    this._source.buffer = this._audio;

    this._source.connect(this._ctx.destination);

    this._source.start();
  }
}
