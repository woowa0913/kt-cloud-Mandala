export interface GoalItem {
  text: string;
  isDraft: boolean;
  isAccepted: boolean;
}

// 9 cells make a block
export type BlockData = GoalItem[];

// 9 blocks make the whole chart
export type MandalaData = BlockData[];

export interface User {
  id: string;
  name: string;
  avatarColor: string;
  mainGoal: string; // Added for the dashboard preview
}

export interface CheeringMessage {
  id: string;
  text: string;
  author: string;
  style: {
    left: string;
    top: string;
    animationDelay: string;
  };
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  MANDALA = 'MANDALA'
}
