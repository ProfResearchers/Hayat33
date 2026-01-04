export enum AppView {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  COMMUNITY = 'COMMUNITY',
  COACH = 'COACH',
  PROFILE = 'PROFILE',
  MALLATHON = 'MALLATHON',
  NUTRIGUARD = 'NUTRIGUARD',
  PRIVACY = 'PRIVACY'
}

export interface UserStats {
  steps: number;
  stepsGoal: number;
  vitalityScore: number; // 0-100
  moaiRank: string;
}

export interface MoaiGroup {
  id: string;
  name: string;
  members: number;
  nextWalk: string; // ISO String or description
  location: string;
  tags: string[];
}

export interface IndoorRoute {
  id: string;
  name: string;
  location: string;
  distance: string;
  duration: string;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  features: string[];
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface NutriScanResult {
  foodName: string;
  agingScore: number;
  glycemicLoad: string;
  preservatives: string[];
  analysis: string;
  suggestion: {
    name: string;
    reason: string;
    location: string;
  };
}