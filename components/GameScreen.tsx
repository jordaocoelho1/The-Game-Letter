import React from 'react';
import { Player, GameMode } from '../types.ts';
import { CheckIcon, XIcon } from './icons/index.tsx';
import { playClickSound } from '../services/soundService.ts';

interface GameScreenProps {
  players: Player[];
  currentPlayer: Player;
  currentLetter: string;
  timeLeft: number;
  timeLimit: number;
  isTurnActive: boolean;
  theme: string;
  gameMode: GameMode;
  onGetLetter: () => void;
  onTurnEnd: (wasCorrect: boolean) => void;
  onEndGame: () => void;
  t: any;
}

const Scoreboard: React.FC<{ players: Player[], currentPlayerName: string, t: any }> = ({ players, currentPlayerName, t }) => (
    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-slate-800/80 backdrop-blur-sm p-3 md:p-4 rounded-lg border border-slate-700">
        <h3 className="text-base md:text-lg font-bold text-cyan-400 mb-2">{t.scores}</h3>
        <ul className="space-y-1">
            {players.map((p) => (
                <li key={p.name} className={`flex justify-between items-center transition-all duration-300 text-sm md:text-base ${p.name === currentPlayerName ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                    <span>{p.name}</span>
                    <span className="ml-4 font-mono bg-slate-700 px-2 py-0.5 rounded">{p.score}</span>
                </li>
            ))}
        </ul>
    </div>
);

const TimerCircle: React.FC<{ timeLeft: number, timeLimit: number }> = ({ timeLeft, timeLimit }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / timeLimit;
    const offset = circumference - progress * circumference;

    const timeColor = progress > 0.5 ? 'text-green-400' : progress > 0.25 ? 'text-yellow-400' : 'text-red-500';

    return (
        <div className="relative w-24 h-24 md:w-32 md:h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <circle
                    className={`transform -rotate-90 origin-center ${timeColor}`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold ${timeColor}`}>{timeLeft}</span>
        </div>
    );
};

const GameScreen: React.FC<GameScreenProps> = ({
  players,
  currentPlayer,
  currentLetter,
  timeLeft,
  timeLimit,
  isTurnActive,
  theme,
  gameMode,
  onGetLetter,
  onTurnEnd,
  onEndGame,
  t,
}) => {
  return (
    <div className="relative w-full text-center flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        <Scoreboard players={players} currentPlayerName={currentPlayer.name} t={t} />
        
        <p className="text-xl md:text-2xl text-slate-400">{t.theme} <span className="font-semibold text-slate-300">{theme}</span></p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold my-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {gameMode === GameMode.Tap ? `${currentPlayer.name}` : `${t.turn} ${currentPlayer.name}`}
        </h2>
        
        <div className="my-6 sm:my-8 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-slate-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-700">
            {isTurnActive ? (
                gameMode === GameMode.Tap ? (
                    <button 
                        onClick={() => { playClickSound(); onTurnEnd(true); }}
                        className="w-full h-full rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                        aria-label={`Tap to complete turn for letter ${currentLetter}`}
                    >
                        <p className="text-8xl sm:text-9xl font-bold text-cyan-400 animate-pulse">{currentLetter}</p>
                    </button>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                       <p className="text-8xl sm:text-9xl font-bold text-cyan-400 animate-pulse">{currentLetter}</p>
                    </div>
                )
            ) : (
                <button
                    onClick={() => { playClickSound(); onGetLetter(); }}
                    className="text-xl sm:text-2xl font-bold bg-slate-700 hover:bg-slate-600 rounded-full w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                >
                    {t.getLetter}
                </button>
            )}
        </div>
        
        <div className="h-40 flex flex-col items-center justify-center">
            {isTurnActive && (
                <>
                    <TimerCircle timeLeft={timeLeft} timeLimit={timeLimit} />
                    {gameMode === GameMode.Classic && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-6 mt-6">
                            <button 
                                onClick={() => { playClickSound(); onTurnEnd(true); }} 
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 text-lg sm:py-4 sm:px-8 sm:text-xl rounded-lg flex items-center gap-2 transition-transform transform hover:scale-110"
                            >
                                <CheckIcon /> {t.correct}
                            </button>
                            <button 
                                onClick={() => { playClickSound(); onTurnEnd(false); }} 
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 text-lg sm:py-4 sm:px-8 sm:text-xl rounded-lg flex items-center gap-2 transition-transform transform hover:scale-110"
                            >
                                <XIcon /> {t.incorrect}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>

        <button 
            onClick={() => { playClickSound(); onEndGame(); }} 
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
        >
            {t.endGame}
        </button>
    </div>
  );
};

export default GameScreen;