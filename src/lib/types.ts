export type TrumpType = 'alm' | 'vip' | 'gode' | 'halve' | 'sans';

export type SpecialBid =
  | 'solo-nolo'
  | 'pure-nolo'
  | 'open-nolo'
  | 'sol'
  | 'ren-sol'
  | 'bordlaegger'
  | 'super-bordlaegger';

export interface Player {
  id: string;
  name: string;
  createdAt: string;
}

export interface Round {
  id: string;
  bidder: string;           // player id
  partner: string | null;   // player id (null for solo bids)
  bidLevel: number;         // 7-13
  trumpType: TrumpType;
  vipCount: number | null;  // 1, 2, or 3 cards looked at (only for vip)
  specialBid: SpecialBid | null;
  tricksWon: number;        // actual tricks won by declaring team
  success: boolean;         // did they make the bid?
  points: number;           // calculated points (+ or -)
}

export interface GameNight {
  id: string;
  date: string;
  players: string[];        // 4 player ids
  rounds: Round[];
  scores: Record<string, number>; // running totals per player
  isActive: boolean;
}

export interface AppState {
  players: Player[];
  gameNights: GameNight[];
  activeGameId: string | null;
}

export const TRUMP_LABELS: Record<TrumpType, string> = {
  alm: 'Alm.',
  vip: 'Vip',
  gode: 'Gode',
  halve: 'Halve',
  sans: 'Sans',
};

export const SPECIAL_BID_LABELS: Record<SpecialBid, string> = {
  'solo-nolo': 'Solo-nolo',
  'pure-nolo': 'Ren nolo',
  'open-nolo': 'Åben nolo',
  'sol': 'Sol',
  'ren-sol': 'Ren sol',
  'bordlaegger': 'Bordlægger',
  'super-bordlaegger': 'Super bordlægger',
};
