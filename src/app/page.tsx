'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';

const PLAYER_SUITS = ['♠', '♥', '♦', '♣'];

export default function Home() {
  const { state, createGameNight, deleteGameNight, getPlayerName } = useGame();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showNewGame, setShowNewGame] = useState(false);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : prev.length < 4
        ? [...prev, playerId]
        : prev
    );
  };

  const handleCreateGame = () => {
    if (selectedPlayers.length === 4) {
      createGameNight(selectedPlayers);
      setSelectedPlayers([]);
      setShowNewGame(false);
    }
  };

  const activeGames = state.gameNights.filter((g) => g.isActive);
  const completedGames = state.gameNights.filter((g) => !g.isActive);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Active Games */}
        {activeGames.length > 0 && (
          <section>
            <h2
              className="text-lg text-[#5C4033] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="text-[#9CAF88] mr-2">♣</span>Aktive Spil
            </h2>
            <div className="space-y-3">
              {activeGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/game?id=${game.id}`}
                  className="block card-container p-5 hover:bg-[#FDF6E3] transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#D4C5B0]">
                        {new Date(game.date).toLocaleDateString('da-DK', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p
                        className="font-medium text-[#5C4033] mt-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {game.players.map((id) => getPlayerName(id)).join(', ')}
                      </p>
                      <p className="text-sm text-[#5C4033] opacity-70">{game.rounds.length} runder</p>
                    </div>
                    <div
                      className="bg-[#9CAF88] text-[#FFFEF9] px-4 py-1.5 text-sm border-2 border-[#9CAF88]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Aktiv
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Game Button/Form */}
        <section>
          {!showNewGame ? (
            <button
              onClick={() => setShowNewGame(true)}
              className="w-full py-4 px-6 border-2 transition-all bg-[#D4A5A5] border-[#6B3A3A] text-[#FFFEF9] hover:bg-[#C89595]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.1em' }}
            >
              <span className="mr-2">♠</span>NYT SPIL<span className="ml-2">♥</span>
            </button>
          ) : (
            <div className="card-container p-6">
              <h3
                className="text-lg text-[#5C4033] mb-4 border-b-2 border-[#D4C5B0] pb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span className="text-[#B85C5C] mr-2">♦</span>Vælg 4 Spillere
              </h3>

              {state.players.length < 4 ? (
                <div className="text-center py-6">
                  <div className="text-[#D4C5B0] text-2xl mb-3">♠ ♥ ♦ ♣</div>
                  <p className="text-[#5C4033] mb-4">
                    Du skal have mindst 4 spillere for at starte et spil.
                  </p>
                  <Link
                    href="/players"
                    className="text-[#6B3A3A] hover:text-[#D4A5A5] font-medium underline"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Tilføj spillere
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {state.players.map((player, index) => {
                      const suit = PLAYER_SUITS[index % PLAYER_SUITS.length];
                      const suitColor = suit === '♥' || suit === '♦' ? '#B85C5C' : '#4A4A4A';
                      const isSelected = selectedPlayers.includes(player.id);

                      return (
                        <button
                          key={player.id}
                          onClick={() => handlePlayerToggle(player.id)}
                          className={`p-4 border-2 text-left transition-all ${
                            isSelected
                              ? 'bg-[#D4A5A5] border-[#6B3A3A] text-[#FFFEF9]'
                              : 'bg-[#FFFEF9] border-[#D4C5B0] text-[#5C4033] hover:border-[#D4A5A5] hover:bg-[#FDF6E3]'
                          }`}
                        >
                          <span style={{ color: isSelected ? '#FFFEF9' : suitColor }} className="mr-2">
                            {suit}
                          </span>
                          <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {player.name}
                          </span>
                          {isSelected && (
                            <span className="ml-2 text-[#E6C86E]">
                              #{selectedPlayers.indexOf(player.id) + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowNewGame(false);
                        setSelectedPlayers([]);
                      }}
                      className="flex-1 py-2.5 px-4 border-2 border-[#D4C5B0] text-[#5C4033] hover:bg-[#FDF6E3] transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Annuller
                    </button>
                    <button
                      onClick={handleCreateGame}
                      disabled={selectedPlayers.length !== 4}
                      className="flex-1 py-2.5 px-4 border-2 transition-all bg-[#9CAF88] border-[#9CAF88] text-[#FFFEF9] hover:bg-[#8A9D78] disabled:bg-[#D4C5B0] disabled:border-[#D4C5B0] disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Start Spil ({selectedPlayers.length}/4)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Completed Games */}
        {completedGames.length > 0 && (
          <section>
            <h2
              className="text-lg text-[#5C4033] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="text-[#4A4A4A] mr-2">♠</span>Tidligere Spil
            </h2>
            <div className="space-y-3">
              {completedGames
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((game) => {
                  const sortedScores = game.players
                    .map((id) => ({ id, score: game.scores[id] || 0 }))
                    .sort((a, b) => b.score - a.score);
                  const winner = sortedScores[0];

                  return (
                    <div key={game.id} className="card-container p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-[#D4C5B0]">
                            {new Date(game.date).toLocaleDateString('da-DK', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p
                            className="text-[#5C4033] mt-1"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            <span className="text-[#E6C86E] mr-1">★</span>
                            Vinder: {getPlayerName(winner.id)}{' '}
                            <span className={winner.score >= 0 ? 'text-[#9CAF88]' : 'text-[#B85C5C]'}>
                              ({winner.score > 0 ? '+' : ''}{winner.score} point)
                            </span>
                          </p>
                          <p className="text-sm text-[#5C4033] opacity-70">{game.rounds.length} runder</p>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href={`/game?id=${game.id}`}
                            className="text-[#6B3A3A] hover:text-[#D4A5A5] text-sm"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            Se detaljer
                          </Link>
                          <button
                            onClick={() => deleteGameNight(game.id)}
                            className="text-[#B85C5C] hover:text-[#D4A5A5] text-sm"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            Slet
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {state.gameNights.length === 0 && !showNewGame && (
          <div className="card-container p-12 text-center">
            <div className="text-[#D4C5B0] text-4xl mb-4">♠ ♥ ♦ ♣</div>
            <p
              className="text-[#5C4033] text-lg mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ingen spil endnu
            </p>
            <p className="text-[#5C4033] opacity-70 italic">
              Tryk på &quot;Nyt spil&quot; for at starte
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
