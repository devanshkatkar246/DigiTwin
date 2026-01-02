
export interface StudentMetrics {
  studyHours: number;
  sleepHours: number;
  attendance: number;
  stressLevel: number;
  revisionFrequency: 'Daily' | 'Weekly';
  screenTime: number;
  timestamp?: number;
}

export interface SimulationResult {
  score: number;
  future7: number;
  future30: number;
  metrics: StudentMetrics;
  id?: string;
  createdAt?: any;
}

export interface Suggestion {
  text: string;
  type: 'warning' | 'info' | 'success';
}
