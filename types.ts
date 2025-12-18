
export interface Scripture {
  reference: string;
  text: string;
  category: 'anger' | 'peace' | 'listening' | 'praise' | 'forgiveness';
}

export interface ConversationStats {
  wordCount: number;
  timeSpent: number;
  iStatements: number;
  youStatements: number;
  praiseCount: number;
  tensionPhrases: number;
}

export enum SessionState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  ANALYZING = 'ANALYZING'
}

export interface TurnConfig {
  maxWords: number;
  maxSeconds: number;
}
