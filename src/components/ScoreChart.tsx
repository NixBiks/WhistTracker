'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGame } from '@/contexts/GameContext';
import { GameNight } from '@/lib/types';

// Wes Anderson inspired pastel palette
const COLORS = ['#D4A5A5', '#9CAF88', '#A8C5D9', '#E6C86E', '#C67B5C', '#6B3A3A'];

interface ScoreChartProps {
  gameNights: GameNight[];
}

export default function ScoreChart({ gameNights }: ScoreChartProps) {
  const { getPlayerName } = useGame();

  // Get all unique players across all games
  const allPlayerIds = [...new Set(gameNights.flatMap((g) => g.players))];

  // Sort games by date
  const sortedGames = [...gameNights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate cumulative scores over time
  const cumulativeScores: Record<string, number> = {};
  allPlayerIds.forEach((id) => (cumulativeScores[id] = 0));

  const chartData = sortedGames.map((game, index) => {
    // Update cumulative scores for players in this game
    game.players.forEach((playerId) => {
      cumulativeScores[playerId] += game.scores[playerId] || 0;
    });

    const dataPoint: Record<string, string | number> = {
      name: `Spil ${index + 1}`,
      date: new Date(game.date).toLocaleDateString('da-DK', {
        day: 'numeric',
        month: 'short',
      }),
    };

    allPlayerIds.forEach((playerId) => {
      dataPoint[playerId] = cumulativeScores[playerId];
    });

    return dataPoint;
  });

  if (chartData.length === 0) {
    return (
      <div className="card-container p-8 text-center">
        <div className="text-[#D4C5B0] text-2xl mb-2">♠ ♥ ♦ ♣</div>
        <p className="text-[#5C4033] italic">Ingen spildata at vise endnu</p>
      </div>
    );
  }

  return (
    <div className="card-container p-5">
      <h3
        className="text-lg text-[#5C4033] mb-4 border-b-2 border-[#D4C5B0] pb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        <span className="text-[#B85C5C] mr-2">♦</span>Point Over Tid
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D4C5B0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#5C4033', fontFamily: "'Crimson Text', serif" }}
            stroke="#D4C5B0"
          />
          <YAxis
            tick={{ fill: '#5C4033', fontFamily: "'Crimson Text', serif" }}
            stroke="#D4C5B0"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFEF9',
              border: '2px solid #D4C5B0',
              borderRadius: '4px',
              fontFamily: "'Crimson Text', serif",
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: "'Playfair Display', serif",
            }}
          />
          {allPlayerIds.map((playerId, index) => (
            <Line
              key={playerId}
              type="monotone"
              dataKey={playerId}
              name={getPlayerName(playerId)}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 5, fill: COLORS[index % COLORS.length], strokeWidth: 2, stroke: '#FFFEF9' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
