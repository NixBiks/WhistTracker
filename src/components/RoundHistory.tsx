'use client';

import { useGame } from '@/contexts/GameContext';
import { Round, TrumpType, TRUMP_LABELS, SPECIAL_BID_LABELS } from '@/lib/types';

interface RoundHistoryProps {
  gameId: string;
  rounds: Round[];
}

const TRUMP_SUITS: Record<TrumpType, { symbol: string; color: string }> = {
  alm: { symbol: '♠', color: '#4A4A4A' },
  vip: { symbol: '♦', color: '#B85C5C' },
  gode: { symbol: '♥', color: '#B85C5C' },
  halve: { symbol: '♣', color: '#4A4A4A' },
  sans: { symbol: '—', color: '#5C4033' },
};

export default function RoundHistory({ gameId, rounds }: RoundHistoryProps) {
  const { deleteRound, getPlayerName } = useGame();

  if (rounds.length === 0) {
    return (
      <div className="card-container p-6 text-center">
        <div className="text-[#D4C5B0] text-2xl mb-2">♠ ♥ ♦ ♣</div>
        <p className="text-[#5C4033] italic">Ingen runder endnu</p>
      </div>
    );
  }

  return (
    <div className="card-container overflow-hidden">
      <div className="px-5 py-4 border-b-2 border-[#D4C5B0] bg-[#FDF6E3]">
        <h3
          className="text-lg text-[#5C4033]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-[#B85C5C] mr-2">♥</span>Runde Historik
        </h3>
      </div>
      <div className="divide-y divide-[#D4C5B0] max-h-96 overflow-y-auto">
        {rounds.map((round, index) => {
          const trumpInfo = TRUMP_SUITS[round.trumpType];
          return (
            <div key={round.id} className="px-5 py-4 hover:bg-[#FDF6E3] transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[#D4C5B0] text-sm"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      #{index + 1}
                    </span>
                    <span
                      className="font-medium text-[#5C4033]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {getPlayerName(round.bidder)}
                      {round.partner && (
                        <span className="text-[#5C4033] opacity-70">
                          {' '}+ {getPlayerName(round.partner)}
                        </span>
                      )}
                      {!round.partner && (
                        <span className="text-[#6B3A3A] text-sm ml-1 italic">(solo)</span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-[#5C4033] mt-1 flex items-center flex-wrap gap-1">
                    <span style={{ color: trumpInfo.color }}>{trumpInfo.symbol}</span>
                    <span className="font-medium">{round.bidLevel} {TRUMP_LABELS[round.trumpType]}</span>
                    {round.trumpType === 'vip' && round.vipCount && (
                      <span className="text-[#E6C86E] font-medium">(x{round.vipCount})</span>
                    )}
                    {round.specialBid && (
                      <span className="text-[#6B3A3A] italic">
                        ({SPECIAL_BID_LABELS[round.specialBid]})
                      </span>
                    )}
                    <span className="text-[#D4C5B0]">—</span>
                    <span>{round.tricksWon} stik</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`font-semibold text-lg ${
                        round.success ? 'text-[#9CAF88]' : 'text-[#B85C5C]'
                      }`}
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {round.points > 0 ? '+' : ''}
                      {round.points}
                    </span>
                    <div
                      className="text-xs"
                      style={{ color: round.success ? '#9CAF88' : '#B85C5C' }}
                    >
                      {round.success ? '✓ Vundet' : '✗ Tabt'}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRound(gameId, round.id)}
                    className="text-[#D4C5B0] hover:text-[#B85C5C] transition p-1"
                    title="Slet runde"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
