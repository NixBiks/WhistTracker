import { TrumpType, SpecialBid, Round } from './types';

// Point values based on kortdrengene.dk schema
// Points are awarded for making the bid, negative for failing
// Format: [bidLevel][trumpType] = { made: points, failed: points }

const BASE_POINTS: Record<number, Record<TrumpType, { made: number; failed: number }>> = {
  7: {
    alm: { made: 1, failed: -1 },
    vip: { made: 2, failed: -2 },
    gode: { made: 2, failed: -2 },
    halve: { made: 2, failed: -2 },
    sans: { made: 3, failed: -3 },
  },
  8: {
    alm: { made: 2, failed: -2 },
    vip: { made: 4, failed: -4 },
    gode: { made: 4, failed: -4 },
    halve: { made: 4, failed: -4 },
    sans: { made: 6, failed: -6 },
  },
  9: {
    alm: { made: 4, failed: -4 },
    vip: { made: 8, failed: -8 },
    gode: { made: 8, failed: -8 },
    halve: { made: 8, failed: -8 },
    sans: { made: 12, failed: -12 },
  },
  10: {
    alm: { made: 8, failed: -8 },
    vip: { made: 16, failed: -16 },
    gode: { made: 16, failed: -16 },
    halve: { made: 16, failed: -16 },
    sans: { made: 24, failed: -24 },
  },
  11: {
    alm: { made: 16, failed: -16 },
    vip: { made: 32, failed: -32 },
    gode: { made: 32, failed: -32 },
    halve: { made: 32, failed: -32 },
    sans: { made: 48, failed: -48 },
  },
  12: {
    alm: { made: 32, failed: -32 },
    vip: { made: 64, failed: -64 },
    gode: { made: 64, failed: -64 },
    halve: { made: 64, failed: -64 },
    sans: { made: 96, failed: -96 },
  },
  13: {
    alm: { made: 64, failed: -64 },
    vip: { made: 128, failed: -128 },
    gode: { made: 128, failed: -128 },
    halve: { made: 128, failed: -128 },
    sans: { made: 192, failed: -192 },
  },
};

// Special bid bonuses (added to base points when successful)
const SPECIAL_BID_BONUS: Record<SpecialBid, number> = {
  'solo-nolo': 6,
  'pure-nolo': 12,
  'open-nolo': 24,
  'sol': 3,
  'ren-sol': 6,
  'bordlaegger': 12,
  'super-bordlaegger': 24,
};

// Solo bids (no partner) - multiplied points
const SOLO_MULTIPLIER = 2;

export function calculatePoints(
  bidLevel: number,
  trumpType: TrumpType,
  success: boolean,
  specialBid: SpecialBid | null,
  isSolo: boolean,
  vipCount: number | null = null
): number {
  const basePointsForBid = BASE_POINTS[bidLevel]?.[trumpType];

  if (!basePointsForBid) {
    console.warn(`No points defined for bid level ${bidLevel} with trump ${trumpType}`);
    return 0;
  }

  let points = success ? basePointsForBid.made : basePointsForBid.failed;

  // Apply vip multiplier (1x, 2x, or 3x based on cards looked at in kat)
  if (trumpType === 'vip' && vipCount && vipCount >= 1 && vipCount <= 3) {
    points *= vipCount;
  }

  // Apply solo multiplier (playing without a partner)
  if (isSolo) {
    points *= SOLO_MULTIPLIER;
  }

  // Add special bid bonus (only if successful)
  if (specialBid && success) {
    points += SPECIAL_BID_BONUS[specialBid];
  }

  return points;
}

export function calculateRoundPoints(round: Omit<Round, 'points' | 'success'>): {
  success: boolean;
  points: number;
} {
  const success = round.tricksWon >= round.bidLevel;
  const isSolo = round.partner === null;
  const points = calculatePoints(
    round.bidLevel,
    round.trumpType,
    success,
    round.specialBid,
    isSolo,
    round.vipCount
  );

  return { success, points };
}

export function getPointsPreview(
  bidLevel: number,
  trumpType: TrumpType,
  specialBid: SpecialBid | null,
  isSolo: boolean,
  vipCount: number | null = null
): { ifMade: number; ifFailed: number } {
  return {
    ifMade: calculatePoints(bidLevel, trumpType, true, specialBid, isSolo, vipCount),
    ifFailed: calculatePoints(bidLevel, trumpType, false, specialBid, isSolo, vipCount),
  };
}
