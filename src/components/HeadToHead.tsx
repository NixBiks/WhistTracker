'use client';

import { useGame } from '@/contexts/GameContext';
import { GameNight } from '@/lib/types';

interface HeadToHeadProps {
  gameNights: GameNight[];
}

interface PartnershipStats {
  player1: string;
  player2: string;
  gamesPlayed: number;
  roundsTogether: number;
  wins: number;
  losses: number;
  totalPoints: number;
}

export default function HeadToHead({ gameNights }: HeadToHeadProps) {
  const { getPlayerName } = useGame();

  // Calculate partnership statistics
  const partnershipMap = new Map<string, PartnershipStats>();

  gameNights.forEach((game) => {
    game.rounds.forEach((round) => {
      if (!round.partner) return; // Skip solo rounds

      // Create a consistent key for the partnership
      const [p1, p2] = [round.bidder, round.partner].sort();
      const key = `${p1}-${p2}`;

      const existing = partnershipMap.get(key) || {
        player1: p1,
        player2: p2,
        gamesPlayed: 0,
        roundsTogether: 0,
        wins: 0,
        losses: 0,
        totalPoints: 0,
      };

      existing.roundsTogether++;
      if (round.success) {
        existing.wins++;
      } else {
        existing.losses++;
      }
      existing.totalPoints += round.points;

      partnershipMap.set(key, existing);
    });
  });

  // Convert to array and sort by rounds played
  const partnerships = Array.from(partnershipMap.values())
    .sort((a, b) => b.roundsTogether - a.roundsTogether);

  if (partnerships.length === 0) {
    return (
      <div className="card-container p-8 text-center">
        <div className="text-[#D4C5B0] text-2xl mb-2">♠ ♥ ♦ ♣</div>
        <p className="text-[#5C4033] italic">Ingen makker-statistik endnu</p>
      </div>
    );
  }

  return (
    <div className="card-container overflow-hidden">
      <div className="px-5 py-4 bg-[#FDF6E3] border-b-2 border-[#D4C5B0]">
        <h3
          className="text-lg text-[#5C4033]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-[#4A4A4A] mr-2">♣</span>Makker-statistik
        </h3>
      </div>
      <div className="divide-y divide-[#D4C5B0]">
        {partnerships.map(({ player1, player2, roundsTogether, wins, losses, totalPoints }, index) => {
          const winRate = roundsTogether > 0 ? Math.round((wins / roundsTogether) * 100) : 0;
          const suit = index % 2 === 0 ? '♥' : '♦';

          return (
            <div key={`${player1}-${player2}`} className="p-5 hover:bg-[#FDF6E3] transition-colors">
              <div className="flex justify-between items-center mb-3">
                <span
                  className="font-medium text-[#5C4033]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span className="text-[#B85C5C] mr-2">{suit}</span>
                  {getPlayerName(player1)} & {getPlayerName(player2)}
                </span>
                <span
                  className="text-sm text-[#D4C5B0] border border-[#D4C5B0] px-2 py-0.5 rounded"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {roundsTogether} runder
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm mb-3">
                <span className="text-[#9CAF88]">
                  <span className="font-semibold">{wins}</span> vundne
                </span>
                <span className="text-[#B85C5C]">
                  <span className="font-semibold">{losses}</span> tabte
                </span>
                <span
                  className={`font-semibold ${totalPoints >= 0 ? 'text-[#9CAF88]' : 'text-[#B85C5C]'}`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {totalPoints > 0 ? '+' : ''}{totalPoints} point
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#D4C5B0] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${winRate >= 50 ? 'bg-[#9CAF88]' : 'bg-[#B85C5C]'}`}
                    style={{ width: `${winRate}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${winRate >= 50 ? 'text-[#9CAF88]' : 'text-[#B85C5C]'}`}
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {winRate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
