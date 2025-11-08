import React, { useState } from 'react';
import { Player, GameMode } from '../types';
import { UsersIcon, ClockIcon, PlayIcon } from './icons';
import { playClickSound } from '../services/soundService';

interface PlayerSetupProps {
  onStartGame: (players: Player[], timeLimit: number, gameMode: GameMode) => void;
  t: any; // Translation object
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame, t }) => {
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(2).fill(''));
  const [timeLimit, setTimeLimit] = useState<number>(15);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Tap);
  const [error, setError] = useState<string>('');

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
    setPlayerNames(Array(count).fill(''));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (playerNames.some(name => name.trim() === '')) {
      setError(t.error);
      return;
    }
    setError('');
    const players: Player[] = playerNames.map(name => ({ name, score: 0 }));
    onStartGame(players, timeLimit, gameMode);
  };

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-slate-700">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-cyan-400">{t.title}</h1>
      <p className="text-center text-slate-400 mb-8">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-lg font-semibold text-slate-300 mb-2 block">{t.gameMode}</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { playClickSound(); setGameMode(GameMode.Tap); }}
              className={`p-3 rounded-lg text-center font-semibold transition-colors ${gameMode === GameMode.Tap ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              {t.tap}
            </button>
            <button
              type="button"
              onClick={() => { playClickSound(); setGameMode(GameMode.Classic); }}
              className={`p-3 rounded-lg text-center font-semibold transition-colors ${gameMode === GameMode.Classic ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              {t.classic}
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="numPlayers" className="flex items-center text-lg font-semibold text-slate-300 mb-2">
            <UsersIcon /> <span className="ml-2">{t.numPlayers}</span>
          </label>
          <select
            id="numPlayers"
            value={numPlayers}
            onChange={handleNumPlayersChange}
            className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          {playerNames.map((name, index) => (
            <div key={index} className="mb-3">
              <label htmlFor={`player-${index}`} className="block text-sm font-medium text-slate-400 mb-1">{t.player} {index + 1}</label>
              <input
                type="text"
                id={`player-${index}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`${t.playerNamePlaceholder} ${index + 1}`}
                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        
        <div>
           <label htmlFor="timeLimit" className="flex items-center text-lg font-semibold text-slate-300 mb-2">
            <ClockIcon /> <span className="ml-2">{t.timeLimit}</span>
          </label>
           <div className="flex items-center justify-between text-white bg-slate-700 p-3 rounded-lg border border-slate-600">
             <span>{timeLimit} {t.seconds}</span>
             <input
                id="timeLimit"
                type="range"
                min="5"
                max="30"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-1/2"
            />
           </div>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlayIcon /> <span className="ml-2">{t.start}</span>
        </button>
      </form>
    </div>
  );
};

export default PlayerSetup;