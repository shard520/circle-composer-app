# Circle Composer

View the site [here](https://circle-composer.netlify.app/).

## Contents

- [Description](#Description)
- [Docs](#Docs)
- [Design](#Design)
- [Features](#Features)
- [Planned Features](#Planned)
- [License Details](#License)

---

## Description

The Circle Composer is a rhythm sequencer, designed to allow beginners and experienced musicians to explore rhythm. Using a series of circles which display the main beats and subdivisions in a bar, users can toggle each circle to programme a rhythm, then play that rhythm against a sound marking the pulse beats. The rhythm can be shifted backwards or forwards by one circle at a time by using the shift buttons.

---

## Docs

Documentation has been written using JSDoc and can be viewed [here](https://shard520.github.io/circle-composer-app/docs/). This is updated with each build so will always contain documentation for everything on the main branch.

---

## Design

The app has been refactored from the initial version and is inspired by [this tutorial project](https://github.com/shard520/forkify-app), it uses MVC architecture with OOP, and a version of the publisher/subscriber pattern to handle UI events.

---

## Features

The core functionality of the app revolves around the way it uses the Web Audio API. Rather than using the default methods like play which are available when using `new Audio(url)`, the [audioObj](https://github.com/shard520/circle-composer-app/blob/main/src/js/model/audioObj.js) is initialised with a url, then a reference to the Audio Context is passed as an argument to `createAudio(ctx)`, this method asynchronously fetches the data, storing it in an array buffer before decoding it, and creating and storing a gain node. The play method can then be called with a time parameter which defaults to the current time. Instead of being promised based, this play method creates a buffer source node each time it is called which is ideal for the nature of the app playing short samples in quick succession, preventing errors related to uncaught promises or when trying to pause and reset the time before playing a single audio object.

Timing is handled by a scheduler function adapted from [this artice](https://www.html5rocks.com/en/tutorials/audio/scheduling/). Instead of using `setTimeout()` or `setInterval()` to queue playback, the scheduler is called at an interval set with a config variable. Each time the scheduler is called, it checks to see if the next note is due. When a note is due, it queues it then updates the display and sets the time the next note is due. The combination of a short scheduler interval combined with a longer lookahead time allows for overlap which prevents timing issues which can arise when the callback in the native JS timers are delayed by other tasks on the main thread. This also allows seamless changes to the tempo and sequence to be made whilst the sequence is playing.

```javascript
while (state.nextNoteTime < state.ctx.currentTime + SCHEDULER_LOOKAHEAD) {
  controlSequence(state.nextNoteTime);

  circlesView.updateCurrentDisplay(state.currentNote);

  controlSetNextNote();
}
```

---

## Planned Features

- User selectable time signature - users will be able to select beats in a bar, beat (pulse) value, and beat subdivision.
- Choice of sounds - pulse and rhythm audio will each have a choice of sounds the user can choose from.

---

## License

Code is licensed under the [MIT License](https://opensource.org/licenses/mit-license.php)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
