'use client';

import { useGame } from '@/contexts/GameContext';

interface ScoreTableProps {
  playerIds: string[];
  scores: Record<string, number>;
}

const RANK_SUITS = ['♠', '♥', '♦', '♣'];

export default function ScoreTable({ playerIds, scores }: ScoreTableProps) {
  const { getPlayerName } = useGame();

  // Sort players by score (highest first)
  const sortedPlayers = [...playerIds].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  return (
    <div className="card-container overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#FDF6E3] border-b-2 border-[#D4C5B0]">
          <tr>
            <th
              className="px-5 py-4 text-left text-sm text-[#5C4033]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
            >
              <span className="text-[#4A4A4A] mr-2">♠</span>Spiller
            </th>
            <th
              className="px-5 py-4 text-right text-sm text-[#5C4033]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.05em' }}
            >
              Point<span className="text-[#B85C5C] ml-2">♥</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D4C5B0]">
          {sortedPlayers.map((playerId, index) => {
            const score = scores[playerId] || 0;
            const isLeading = index === 0 && score > (scores[sortedPlayers[1]] || 0);
            const suit = RANK_SUITS[index % RANK_SUITS.length];
            const suitColor = suit === '♥' || suit === '♦' ? '#B85C5C' : '#4A4A4A';

            return (
              <tr
                key={playerId}
                className={`transition-colors ${isLeading ? 'bg-[#E6C86E]/20' : 'hover:bg-[#FDF6E3]'}`}
              >
                <td className="px-5 py-4 text-[#5C4033]">
                  <span
                    className="mr-3 text-lg"
                    style={{ color: suitColor }}
                  >
                    {suit}
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {getPlayerName(playerId)}
                  </span>
                  {isLeading && (
                    <span className="ml-2 text-[#E6C86E]">★</span>
                  )}
                </td>
                <td
                  className={`px-5 py-4 text-right font-semibold text-lg ${
                    score > 0 ? 'text-[#9CAF88]' : score < 0 ? 'text-[#B85C5C]' : 'text-[#5C4033]'
                  }`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {score > 0 ? '+' : ''}
                  {score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
