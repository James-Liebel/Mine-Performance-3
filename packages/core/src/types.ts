/**
 * Shared types for Mine Performance Academy logic layer.
 */

export interface LeaderboardRow {
  rank?: number;
  name: string;
  value: number;
  percentile?: number;
  isDemo?: boolean;
  ageBand?: string;
  position?: string;
}

export interface LeaderboardData {
  metric: string;
  unit: string;
  ageBand: string;
  lastUpdated: string;
  rows: LeaderboardRow[];
  demoAthlete?: DemoAthlete;
}

export interface DemoAthlete {
  name: string;
  metrics: MetricValue[];
  progress?: { date: string; pitchingVelo: number; exitVelo: number }[];
  nextSession?: { date: string; time: string; coach: string; type: string };
  recommendedAction?: { label: string; reason: string };
}

export interface MetricValue {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend?: string;
  vsLast?: string;
}

export interface Program {
  id: string;
  name: string;
  desc: string;
  coach: string;
}

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: string;
  program?: string;
  location: string;
  featured: boolean;
  capacity: number;
  bookedCount: number;
  subscriptionTier: string;
}

export type SubscriptionTier = 'basic' | 'premium' | 'all';

export interface FilterOption {
  value: string;
  label: string;
}

export interface WizardRecommendation {
  program: string;
  coach: string;
  reason: string;
}
