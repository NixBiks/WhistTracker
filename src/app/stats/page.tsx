'use client';

import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';
import ScoreChart from '@/components/ScoreChart';
import HeadToHead from '@/components/HeadToHead';
import { TRUMP_LABELS, TrumpType } from '@/lib/types';

const TRUMP_SUITS: Record<TrumpType, { symbol: string; color: string }> = {
  alm: { symbol: '♠', color: '#4A4A4A' },
  vip: { symbol: '♦', color: '#B85C5C' },
  gode: { symbol: '♥', color: '#B85C5C' },
  halve: { symbol: '♣', color: '#4A4A4A' },
  sans: { symbol: '—', color: '#5C4033' },
};

const TRUMP_COLORS: Record<TrumpType, string> = {
  alm: '#4A4A4A',
  vip: '#E6C86E',
  gode: '#B85C5C',
  halve: '#9CAF88',
  sans: '#A8C5D9',
};

export default function StatsPage() {
  const { state } = useGame();

  const completedGames = state.gameNights.filter((g) => !g.isActive);
  const allRounds = completedGames.flatMap((g) => g.rounds);

  // Calculate player statistics
  const playerStats = state.players.map((player) => {
    const playerRounds = allRounds.filter(
      (r) => r.bidder === player.id || r.partner === player.id
    );
    const bidderRounds = allRounds.filter((r) => r.bidder === player.id);
    const wins = playerRounds.filter((r) => r.success).length;
    const totalPoints = completedGames.reduce(
      (sum, g) => sum + (g.scores[player.id] || 0),
      0
    );

    return {
      id: player.id,
      name: player.name,
      roundsPlayed: playerRounds.length,
      roundsAsBidder: bidderRounds.length,
      wins,
      losses: playerRounds.length - wins,
      winRate: playerRounds.length > 0 ? Math.round((wins / playerRounds.length) * 100) : 0,
      totalPoints,
      gamesPlayed: completedGames.filter((g) => g.players.includes(player.id)).length,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  // Calculate trump popularity
  const trumpCounts: Record<TrumpType, number> = {
    alm: 0,
    vip: 0,
    gode: 0,
    halve: 0,
    sans: 0,
  };
  allRounds.forEach((r) => {
    trumpCounts[r.trumpType]++;
  });
  const trumpPopularity = Object.entries(trumpCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([trump, count]) => ({
      trump: trump as TrumpType,
      count,
      percentage: allRounds.length > 0 ? Math.round((count / allRounds.length) * 100) : 0,
    }));

  // Calculate bid level distribution
  const bidLevelCounts: Record<number, { total: number; wins: number }> = {};
  for (let i = 7; i <= 13; i++) {
    bidLevelCounts[i] = { total: 0, wins: 0 };
  }
  allRounds.forEach((r) => {
    bidLevelCounts[r.bidLevel].total++;
    if (r.success) bidLevelCounts[r.bidLevel].wins++;
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1
          className="text-2xl text-[#5C4033]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-[#B85C5C] mr-2">♦</span>Statistik
        </h1>

        {completedGames.length === 0 ? (
          <div className="card-container p-12 text-center">
            <div className="text-[#D4C5B0] text-4xl mb-4">♠ ♥ ♦ ♣</div>
            <p
              className="text-[#5C4033]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ingen afsluttede spil endnu
            </p>
            <p className="text-sm text-[#5C4033] opacity-70 mt-1 italic">
              Afslut et spil for at se statistik
            </p>
          </div>
        ) : (
          <>
            {/* Score Trends Chart */}
            <ScoreChart gameNights={completedGames} />

            {/* Player Statistics */}
            <div className="card-container overflow-hidden">
              <div className="px-5 py-4 bg-[#FDF6E3] border-b-2 border-[#D4C5B0]">
                <h3
                  className="text-lg text-[#5C4033]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span className="text-[#4A4A4A] mr-2">♠</span>Spiller Statistik
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FDF6E3] border-b border-[#D4C5B0]">
                    <tr>
                      <th
                        className="px-5 py-3 text-left text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Spiller
                      </th>
                      <th
                        className="px-5 py-3 text-right text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Point
                      </th>
                      <th
                        className="px-5 py-3 text-right text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Spil
                      </th>
                      <th
                        className="px-5 py-3 text-right text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Runder
                      </th>
                      <th
                        className="px-5 py-3 text-right text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Vundet
                      </th>
                      <th
                        className="px-5 py-3 text-right text-[#5C4033]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        Win%
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4C5B0]">
                    {playerStats.map((p, index) => (
                      <tr
                        key={p.id}
                        className={`transition-colors ${index === 0 ? 'bg-[#E6C86E]/20' : 'hover:bg-[#FDF6E3]'}`}
                      >
                        <td
                          className="px-5 py-3 text-[#5C4033]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {index === 0 && <span className="text-[#E6C86E] mr-1">★</span>}
                          {p.name}
                        </td>
                        <td
                          className={`px-5 py-3 text-right font-semibold ${
                            p.totalPoints > 0
                              ? 'text-[#9CAF88]'
                              : p.totalPoints < 0
                              ? 'text-[#B85C5C]'
                              : 'text-[#5C4033]'
                          }`}
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {p.totalPoints > 0 ? '+' : ''}{p.totalPoints}
                        </td>
                        <td className="px-5 py-3 text-right text-[#5C4033]">{p.gamesPlayed}</td>
                        <td className="px-5 py-3 text-right text-[#5C4033]">{p.roundsPlayed}</td>
                        <td className="px-5 py-3 text-right text-[#5C4033]">
                          {p.wins}/{p.roundsPlayed}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">
                          <span className={p.winRate >= 50 ? 'text-[#9CAF88]' : 'text-[#B85C5C]'}>
                            {p.winRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Head to Head */}
            <HeadToHead gameNights={completedGames} />

            {/* Trump Popularity */}
            <div className="card-container overflow-hidden">
              <div className="px-5 py-4 bg-[#FDF6E3] border-b-2 border-[#D4C5B0]">
                <h3
                  className="text-lg text-[#5C4033]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span className="text-[#B85C5C] mr-2">♥</span>Trumf Popularitet
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {trumpPopularity.map(({ trump, count, percentage }) => {
                  const suitInfo = TRUMP_SUITS[trump];
                  return (
                    <div key={trump}>
                      <div className="flex justify-between text-sm mb-2">
                        <span
                          className="font-medium text-[#5C4033]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          <span style={{ color: suitInfo.color }} className="mr-2">
                            {suitInfo.symbol}
                          </span>
                          {TRUMP_LABELS[trump]}
                        </span>
                        <span className="text-[#D4C5B0]">
                          {count} runder ({percentage}%)
                        </span>
                      </div>
                      <div className="bg-[#D4C5B0] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{ width: `${percentage}%`, backgroundColor: TRUMP_COLORS[trump] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bid Level Distribution */}
            <div className="card-container overflow-hidden">
              <div className="px-5 py-4 bg-[#FDF6E3] border-b-2 border-[#D4C5B0]">
                <h3
                  className="text-lg text-[#5C4033]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span className="text-[#4A4A4A] mr-2">♣</span>Meldings Niveau
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-7 gap-3">
                  {Object.entries(bidLevelCounts).map(([level, { total, wins }]) => {
                    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
                    return (
                      <div
                        key={level}
                        className="text-center p-3 border-2 border-[#D4C5B0] hover:border-[#D4A5A5] transition-colors"
                      >
                        <div
                          className="text-xl text-[#5C4033]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {level}
                        </div>
                        <div className="text-xs text-[#D4C5B0]">{total} runder</div>
                        {total > 0 && (
                          <div
                            className={`text-xs font-semibold mt-1 ${
                              winRate >= 50 ? 'text-[#9CAF88]' : 'text-[#B85C5C]'
                            }`}
                          >
                            {winRate}%
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card-container p-4 bg-[#FDF6E3] text-sm text-[#5C4033]">
              <span className="text-[#B85C5C] mr-2">♦</span>
              Baseret på {completedGames.length} afsluttede spil med {allRounds.length} runder
            </div>
          </>
        )}
      </main>
    </div>
  );
}
