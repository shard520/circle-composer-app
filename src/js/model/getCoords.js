import { OUTER_CIRCLE_DIAMETER } from '../config';

/**
 * Function to calculate the x/y coordinates of points around a circle, points are calculated from the center
 * of an element so any rendered elements will need a width and height offset to appear centered.
 * @param {Number} numOfBeats number of beats in a bar - this determines how many coordinates are returned
 * @param {Number} boxSize size in pixels of the container the coordinates will plot to
 * @returns Array of arrays containing all the x/y coordinates, outer array length is determined by numOfBeats
 */
export default function (numOfBeats, boxSize) {
  const centreX = boxSize / 2;
  const centreY = boxSize / 2;

  const radius = (boxSize / 2) * OUTER_CIRCLE_DIAMETER;

  const cellCoords = [];

  for (let i = 0; i < numOfBeats; i++) {
    const x = centreX + radius * Math.cos((2 * Math.PI * i) / numOfBeats);
    const y = centreY + radius * Math.sin((2 * Math.PI * i) / numOfBeats);

    cellCoords.push([x, y]);
  }

  return cellCoords;
}
