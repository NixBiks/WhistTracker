'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import Navigation from '@/components/Navigation';

const PLAYER_SUITS = ['♠', '♥', '♦', '♣'];

export default function PlayersPage() {
  const { state, addPlayer, updatePlayer, deletePlayer } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updatePlayer(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeletePlayer = (id: string, name: string) => {
    // Check if player is in any active games
    const inActiveGame = state.gameNights.some(
      (g) => g.isActive && g.players.includes(id)
    );

    if (inActiveGame) {
      alert(`${name} er med i et aktivt spil og kan ikke slettes.`);
      return;
    }

    if (confirm(`Er du sikker på at du vil slette ${name}?`)) {
      deletePlayer(id);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1
          className="text-2xl text-[#5C4033]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-[#B85C5C] mr-2">♥</span>Spillere
        </h1>

        {/* Add Player Form */}
        <form onSubmit={handleAddPlayer} className="card-container p-5">
          <div className="flex gap-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Indtast spillernavn..."
              className="flex-1"
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim()}
              className="px-5 py-2 border-2 transition-all bg-[#9CAF88] border-[#9CAF88] text-[#FFFEF9] hover:bg-[#8A9D78] disabled:bg-[#D4C5B0] disabled:border-[#D4C5B0] disabled:cursor-not-allowed"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Tilføj
            </button>
          </div>
        </form>

        {/* Player List */}
        <div className="card-container overflow-hidden">
          {state.players.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-[#D4C5B0] text-3xl mb-3">♠ ♥ ♦ ♣</div>
              <p
                className="text-[#5C4033]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Ingen spillere endnu
              </p>
              <p className="text-sm text-[#5C4033] opacity-70 mt-1 italic">
                Tilføj spillere ovenfor for at komme i gang
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#D4C5B0]">
              {state.players.map((player, index) => {
                const suit = PLAYER_SUITS[index % PLAYER_SUITS.length];
                const suitColor = suit === '♥' || suit === '♦' ? '#B85C5C' : '#4A4A4A';

                return (
                  <li key={player.id} className="p-5 hover:bg-[#FDF6E3] transition-colors">
                    {editingId === player.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-1.5 border-2 bg-[#9CAF88] border-[#9CAF88] text-[#FFFEF9] hover:bg-[#8A9D78] text-sm"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          Gem
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-1.5 border-2 border-[#D4C5B0] text-[#5C4033] hover:bg-[#FDF6E3] text-sm"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          Annuller
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="mr-3 text-lg" style={{ color: suitColor }}>
                            {suit}
                          </span>
                          <span
                            className="font-medium text-[#5C4033]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            {player.name}
                          </span>
                          <span className="text-sm text-[#D4C5B0] ml-3">
                            Tilføjet {new Date(player.createdAt).toLocaleDateString('da-DK')}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStartEdit(player.id, player.name)}
                            className="text-[#6B3A3A] hover:text-[#D4A5A5] text-sm"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            Rediger
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                            className="text-[#B85C5C] hover:text-[#D4A5A5] text-sm"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            Slet
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Stats summary */}
        {state.players.length > 0 && (
          <div className="card-container p-4 bg-[#FDF6E3] text-sm text-[#5C4033]">
            <span className="text-[#4A4A4A] mr-2">♣</span>
            {state.players.length} spiller{state.players.length !== 1 ? 'e' : ''} registreret
          </div>
        )}
      </main>
    </div>
  );
}
