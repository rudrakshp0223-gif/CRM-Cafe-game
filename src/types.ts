
export enum Quadrant {
  STAR = 'STAR',
  BUTTERFLY = 'BUTTERFLY',
  BARNACLE = 'BARNACLE',
  STRANGER = 'STRANGER'
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface Customer {
  id: number;
  name: string;
  visitCount: number;
  avgSpend: number;
  lastVisit: string;
  mood: string;
  notes: string;
  quadrant: Quadrant;
  order: MenuItem[];
  dialogue: string;
  exitBehavior: string;
  tip: number;
}

export interface GameState {
  round: number;
  totalRevenue: number;
  crmScore: number;
  accuracy: number;
  loyaltyPointsSold: number;
  phase: 'START' | 'ENCOUNTER' | 'TRANSACTION' | 'GUESSING' | 'REVEAL' | 'LEDGER' | 'SUMMARY';
  currentCustomer: Customer | null;
  lastGuessCorrect: boolean | null;
  roundRevenue: number;
  history: { quadrant: Quadrant; correct: boolean }[];
}
