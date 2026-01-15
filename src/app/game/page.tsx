'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';
import RoundForm from '@/components/RoundForm';
import ScoreTable from '@/components/ScoreTable';
import RoundHistory from '@/components/RoundHistory';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, endGameNight, getPlayerName } = useGame();

  const id = searchParams.get('id');
  const game = id ? state.gameNights.find((g) => g.id === id) : null;

  if (!game) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="card-container p-12 text-center">
            <div className="text-[#D4C5B0] text-4xl mb-4">♠ ♥ ♦ ♣</div>
            <p
              className="text-[#5C4033] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Spil ikke fundet
            </p>
            <button
              onClick={() => router.push('/')}
              className="text-[#6B3A3A] hover:text-[#D4A5A5] underline"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Gå til forsiden
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleEndGame = () => {
    if (confirm('Er du sikker på at du vil afslutte spillet?')) {
      endGameNight(game.id);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="text-2xl text-[#5C4033]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="text-[#B85C5C] mr-2">♥</span>
              Spil - {new Date(game.date).toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'short',
              })}
            </h1>
            <p className="text-[#5C4033] opacity-70 mt-1">
              {game.players.map((pid) => getPlayerName(pid)).join(', ')}
            </p>
          </div>
          {game.isActive && (
            <button
              onClick={handleEndGame}
              className="px-5 py-2.5 border-2 border-[#B85C5C] bg-[#B85C5C]/10 text-[#B85C5C] hover:bg-[#B85C5C] hover:text-[#FFFEF9] transition-all"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Afslut Spil
            </button>
          )}
        </div>

        {/* Score Table */}
        <ScoreTable playerIds={game.players} scores={game.scores} />

        {/* Round Form (only for active games) */}
        {game.isActive && <RoundForm gameId={game.id} playerIds={game.players} />}

        {/* Round History */}
        <RoundHistory gameId={game.id} rounds={game.rounds} />

        {/* Game completed message */}
        {!game.isActive && (
          <div className="card-container p-6 text-center bg-[#FDF6E3]">
            <div className="text-[#D4C5B0] text-xl mb-2">♠ ♥ ♦ ♣</div>
            <p
              className="text-[#5C4033] italic"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Dette spil er afsluttet
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)]">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="card-container p-12 text-center">
            <div className="text-[#D4C5B0] text-4xl animate-pulse">♠ ♥ ♦ ♣</div>
          </div>
        </main>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
