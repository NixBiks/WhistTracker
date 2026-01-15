'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { TrumpType, SpecialBid, TRUMP_LABELS, SPECIAL_BID_LABELS } from '@/lib/types';
import { getPointsPreview } from '@/lib/scoring';

interface RoundFormProps {
  gameId: string;
  playerIds: string[];
}

const TRUMP_TYPES: TrumpType[] = ['alm', 'vip', 'gode', 'halve', 'sans'];
const TRUMP_SUITS: Record<TrumpType, string> = {
  alm: '♠',
  vip: '♦',
  gode: '♥',
  halve: '♣',
  sans: '—',
};
const SPECIAL_BIDS: SpecialBid[] = [
  'sol',
  'ren-sol',
  'bordlaegger',
  'super-bordlaegger',
  'solo-nolo',
  'pure-nolo',
  'open-nolo',
];

export default function RoundForm({ gameId, playerIds }: RoundFormProps) {
  const { addRound, getPlayerName } = useGame();

  const [bidder, setBidder] = useState<string>('');
  const [partner, setPartner] = useState<string | null>(null);
  const [isSolo, setIsSolo] = useState(false);
  const [bidLevel, setBidLevel] = useState(7);
  const [trumpType, setTrumpType] = useState<TrumpType>('alm');
  const [vipCount, setVipCount] = useState<number>(1);
  const [specialBid, setSpecialBid] = useState<SpecialBid | null>(null);
  const [tricksWon, setTricksWon] = useState(7);

  const effectiveVipCount = trumpType === 'vip' ? vipCount : null;
  const pointsPreview = getPointsPreview(bidLevel, trumpType, specialBid, isSolo || !partner, effectiveVipCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidder) return;

    addRound(gameId, bidder, isSolo ? null : partner, bidLevel, trumpType, effectiveVipCount, specialBid, tricksWon);

    // Reset form
    setBidder('');
    setPartner(null);
    setIsSolo(false);
    setBidLevel(7);
    setTrumpType('alm');
    setVipCount(1);
    setSpecialBid(null);
    setTricksWon(7);
  };

  const availablePartners = playerIds.filter((id) => id !== bidder);

  return (
    <form onSubmit={handleSubmit} className="card-container p-6 space-y-5">
      {/* Header with decorative suits */}
      <div className="flex items-center justify-between border-b-2 border-[#D4C5B0] pb-3">
        <h3
          className="text-xl text-[#5C4033]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Ny Runde
        </h3>
        <div className="flex gap-1 text-lg">
          <span className="text-[#4A4A4A]">♠</span>
          <span className="text-[#B85C5C]">♥</span>
          <span className="text-[#B85C5C]">♦</span>
          <span className="text-[#4A4A4A]">♣</span>
        </div>
      </div>

      {/* Bidder Selection */}
      <div>
        <label
          className="block text-sm font-medium text-[#5C4033] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
        >
          <span className="text-[#B85C5C] mr-2">♦</span>Melder
        </label>
        <select
          value={bidder}
          onChange={(e) => {
            setBidder(e.target.value);
            setPartner(null);
          }}
          required
        >
          <option value="">Vælg melder...</option>
          {playerIds.map((id) => (
            <option key={id} value={id}>
              {getPlayerName(id)}
            </option>
          ))}
        </select>
      </div>

      {/* Solo Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="solo"
          checked={isSolo}
          onChange={(e) => {
            setIsSolo(e.target.checked);
            if (e.target.checked) setPartner(null);
          }}
        />
        <label htmlFor="solo" className="text-[#5C4033] cursor-pointer">
          Solo (ingen makker)
        </label>
      </div>

      {/* Partner Selection */}
      {!isSolo && bidder && (
        <div>
          <label
            className="block text-sm font-medium text-[#5C4033] mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
          >
            <span className="text-[#B85C5C] mr-2">♥</span>Makker
          </label>
          <select
            value={partner || ''}
            onChange={(e) => setPartner(e.target.value || null)}
          >
            <option value="">Vælg makker...</option>
            {availablePartners.map((id) => (
              <option key={id} value={id}>
                {getPlayerName(id)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bid Level */}
      <div>
        <label
          className="block text-sm font-medium text-[#5C4033] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
        >
          <span className="text-[#4A4A4A] mr-2">♠</span>Melding: <span className="text-[#6B3A3A] text-lg">{bidLevel}</span> stik
        </label>
        <input
          type="range"
          min="7"
          max="13"
          value={bidLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value);
            setBidLevel(level);
            setTricksWon(Math.max(tricksWon, level));
          }}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#5C4033] mt-1">
          <span>7</span>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          <span>13</span>
        </div>
      </div>

      {/* Trump Type */}
      <div>
        <label
          className="block text-sm font-medium text-[#5C4033] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
        >
          <span className="text-[#4A4A4A] mr-2">♣</span>Trumf
        </label>
        <div className="flex flex-wrap gap-2">
          {TRUMP_TYPES.map((t) => {
            const suitColor = t === 'vip' || t === 'gode' ? '#B85C5C' : '#4A4A4A';
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTrumpType(t)}
                className={`px-4 py-2 border-2 transition-all ${
                  trumpType === t
                    ? 'bg-[#D4A5A5] border-[#6B3A3A] text-[#FFFEF9]'
                    : 'bg-[#FFFEF9] border-[#D4C5B0] text-[#5C4033] hover:border-[#D4A5A5] hover:bg-[#FDF6E3]'
                }`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span style={{ color: trumpType === t ? '#FFFEF9' : suitColor }} className="mr-1">
                  {TRUMP_SUITS[t]}
                </span>
                {TRUMP_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vip Count - only show when trump type is vip */}
      {trumpType === 'vip' && (
        <div className="bg-[#FDF6E3] border-2 border-[#E6C86E] p-4 rounded">
          <label
            className="block text-sm font-medium text-[#5C4033] mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
          >
            <span className="text-[#E6C86E] mr-2">★</span>Kort set i kat (x{vipCount} multiplier)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setVipCount(count)}
                className={`flex-1 py-2 border-2 transition-all ${
                  vipCount === count
                    ? 'bg-[#E6C86E] border-[#C67B5C] text-[#5C4033]'
                    : 'bg-[#FFFEF9] border-[#D4C5B0] text-[#5C4033] hover:border-[#E6C86E]'
                }`}
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {count} kort
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Special Bid */}
      <div>
        <label
          className="block text-sm font-medium text-[#5C4033] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
        >
          Special melding (valgfri)
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSpecialBid(null)}
            className={`px-3 py-1.5 border-2 text-sm transition-all ${
              specialBid === null
                ? 'bg-[#5C4033] border-[#5C4033] text-[#FFFEF9]'
                : 'bg-[#FFFEF9] border-[#D4C5B0] text-[#5C4033] hover:border-[#5C4033]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ingen
          </button>
          {SPECIAL_BIDS.map((sb) => (
            <button
              key={sb}
              type="button"
              onClick={() => setSpecialBid(sb)}
              className={`px-3 py-1.5 border-2 text-sm transition-all ${
                specialBid === sb
                  ? 'bg-[#6B3A3A] border-[#6B3A3A] text-[#FFFEF9]'
                  : 'bg-[#FFFEF9] border-[#D4C5B0] text-[#5C4033] hover:border-[#6B3A3A]'
              }`}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {SPECIAL_BID_LABELS[sb]}
            </button>
          ))}
        </div>
      </div>

      {/* Tricks Won */}
      <div>
        <label
          className="block text-sm font-medium text-[#5C4033] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
        >
          Vundne stik: <span className="text-[#6B3A3A] text-lg">{tricksWon}</span>
        </label>
        <input
          type="range"
          min="0"
          max="13"
          value={tricksWon}
          onChange={(e) => setTricksWon(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#5C4033] mt-1">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>

      {/* Points Preview */}
      <div className="bg-[#FDF6E3] border-2 border-[#D4C5B0] p-4 rounded">
        <p className="text-sm text-[#5C4033]">
          Point preview:{' '}
          <span className="text-[#9CAF88] font-semibold">
            Vundet: +{pointsPreview.ifMade}
          </span>{' '}
          /{' '}
          <span className="text-[#B85C5C] font-semibold">Tabt: {pointsPreview.ifFailed}</span>
        </p>
        <p className="text-sm mt-2">
          {tricksWon >= bidLevel ? (
            <span className="text-[#9CAF88] font-semibold flex items-center gap-1">
              <span>✓</span> Melding opnået!
            </span>
          ) : (
            <span className="text-[#B85C5C]">
              Mangler {bidLevel - tricksWon} stik
            </span>
          )}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!bidder}
        className="w-full py-3 px-4 border-2 transition-all bg-[#9CAF88] border-[#9CAF88] text-[#FFFEF9] hover:bg-[#8A9D78] disabled:bg-[#D4C5B0] disabled:border-[#D4C5B0] disabled:cursor-not-allowed"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.1em' }}
      >
        REGISTRER RUNDE
      </button>
    </form>
  );
}
