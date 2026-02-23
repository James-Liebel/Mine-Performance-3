/**
 * Start Here wizard recommendation logic.
 */

import type { WizardRecommendation } from './types.js';

export function getWizardRecommendation(goalId: string): WizardRecommendation {
  switch (goalId) {
    case 'velocity':
      return {
        program: 'Pitching Velo',
        coach: 'Travis Clark or Gavin Sunderman',
        reason:
          'Our pitching coaches specialize in velocity development and arm health.',
      };
    case 'hitting':
      return {
        program: 'Hitting Power',
        coach: 'Nick Gooden',
        reason:
          'Nick brings D1 experience and a focus on both the physical and mental game at the plate.',
      };
    case 'rehab':
      return {
        program: 'Rehab & Arm Care',
        coach: 'Braden Pickett',
        reason:
          'Braden specializes in return-to-play programs with a focus on long-term athlete health.',
      };
    case 'strength':
      return {
        program: 'Strength & Conditioning',
        coach: 'Marc Carney',
        reason:
          "Marc's collegiate background at UC and CMU drives his approach to athletic development.",
      };
    default:
      return {
        program: 'Evaluation',
        coach: 'Any coach — we\'ll match you',
        reason:
          "Start with an evaluation and we'll build a custom plan based on your needs.",
      };
  }
}
