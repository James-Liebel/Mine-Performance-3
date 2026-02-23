/**
 * Metric definitions for "Explain this metric" tooltips.
 */

export const METRIC_DEFINITIONS: Record<string, string> = {
  'Pitching Velo':
    'Peak throwing velocity in mph. Measured by radar or TrackMan. Used by scouts and for program placement. Higher velo with command is the goal.',
  'Spin Rate':
    'Rate of spin on the ball in revolutions per minute (rpm). Affects movement and perceived velocity. Varies by pitch type.',
  'Exit Velo':
    'Exit velocity in mph off the bat. Measures raw hitting power. Often tracked for tee and live BP.',
  'Spin Direction':
    'Axis of spin in degrees. Determines pitch movement (run, cut, drop). Used in pitch design.',
  Carry:
    'How much the pitch "carries" through the zone (reduced drop). Important for fastballs and some breakers.',
};

export function getMetricDefinition(metricKey: string): string {
  return (
    METRIC_DEFINITIONS[metricKey] ??
    `${metricKey}: performance metric used for assessment and comparison.`
  );
}
