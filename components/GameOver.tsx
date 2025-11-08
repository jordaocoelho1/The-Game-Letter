import React, { useEffect } from 'react';
import { Player } from '../types.ts';
import { TrophyIcon, PlayIcon } from './icons/index.tsx';
import { playGameOverSound, playClickSound } from '../services/soundService.ts';

interface GameOverProps {
  players: Player[];
  onPlayAgain: () => void;
  t: any;
}

const GameOver: React.FC<GameOverProps> = ({ players, onPlayAgain, t }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.length > 1 && sortedPlayers[0].score === sortedPlayers[1].score;

  useEffect(() => {
    playGameOverSound();
  }, []);

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto text-center border border-slate-700">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">{t.title}</h1>

      <div className="my-8">
        <div className="flex flex-col items-center justify-center text-yellow-400">
            <TrophyIcon />
            <p className="text-xl md:text-2xl font-semibold mt-2">{isTie ? t.tie : t.winner}</p>
            {!isTie && <p className="text-3xl md:text-4xl font-bold">{winner?.name}</p>}
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-slate-300 mb-4">{t.scores}</h2>
      <ul className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.name}
            className="flex justify-between items-center bg-slate-700 p-3 md:p-4 rounded-lg text-base md:text-lg"
          >
            <span className="font-semibold text-slate-200">
                {index + 1}. {player.name}
            </span>
            <span className="font-mono font-bold text-cyan-300 bg-slate-900 px-3 py-1 rounded">
                {player.score}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => { playClickSound(); onPlayAgain(); }}
        className="mt-10 w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-4 px-4 rounded-lg text-lg md:text-xl transition-all duration-300 transform hover:scale-105"
      >
        <PlayIcon /> <span className="ml-2">{t.playAgain}</span>
      </button>
    </div>
  );
};

export default GameOver;