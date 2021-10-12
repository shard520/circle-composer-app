/**
 * Module to export config variables.
 * @module config
 */

/**
 * @constant {Number} - Lookahead time for note scheduler - in seconds.
 */
export const SCHEDULER_LOOKAHEAD = 0.1;

/**
 * @constant {Number} - Interval time for scheduler interval - in ms.
 */
export const SCHEDULER_INTERVAL = 25;

/**
 * @constant {Number} - Initial gain value for audio objects.
 */
export const INITIAL_GAIN_VALUE = 0.5;

/**
 * @constant {Number} - Diameter of the main circle as a percentage of the circle container width.
 */
export const OUTER_CIRCLE_DIAMETER = 0.8;

/**
 * @constant {Number} - Diameter of the pulse beat circles as a percentage of the circle container width.
 */
export const PULSE_BEAT_CIRCLE_DIAMETER = 0.13;

/**
 * @constant {Number} - Diameter of the subdivision beat circles as a percentage of the circle container width.
 */
export const SUBDIVISION_CIRCLE_DIAMETER = 0.1;
