import React, { useState, useEffect, useCallback } from 'react';
import { Player, GameState, GameMode, Language } from './types.ts';
import { ALPHABET } from './constants.ts';
import { getGameTheme } from './services/geminiService.ts';
import { playCountdownSound, playGameStartSound, playTimeoutSound, playNextTurnSound, playSuccessSound, playUrgentAlertSound } from './services/soundService.ts';
import { useTranslations } from './hooks/useTranslations.ts';
import LanguageSelector from './components/LanguageSelector.tsx';
import PlayerSetup from './components/PlayerSetup.tsx';
import GameScreen from './components/GameScreen.tsx';
import GameOver from './components/GameOver.tsx';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [gameState, setGameState] = useState<GameState>(GameState.LanguageSelection);
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(15);
  const [theme, setTheme] = useState<string>('');
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(false);
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isTurnActive, setIsTurnActive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Tap);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  
  const t = useTranslations(language);

  const resetGame = useCallback(() => {
    setGameState(GameState.LanguageSelection);
    setPlayers([]);
    setTimeLimit(15);
    setTheme('');
    setCurrentPlayerIndex(0);
    setCurrentLetter('');
    setIsTurnActive(false);
    setCountdown(3);
    setUsedLetters(new Set());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (gameState === GameState.Theme) {
      const fetchTheme = async () => {
        setIsLoadingTheme(true);
        try {
          const newTheme = await getGameTheme(language);
          setTheme(newTheme);
        } catch (error) {
          console.error("Failed to fetch theme, using a default.", error);
          setTheme("Animals");
        } finally {
          setIsLoadingTheme(false);
          setTimeout(() => {
            setGameState(GameState.Countdown);
          }, 3000); 
        }
      };
      fetchTheme();
    }
  }, [gameState, language]);

  useEffect(() => {
    if (gameState === GameState.Countdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        playCountdownSound();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === GameState.Countdown && countdown === 0) {
      playGameStartSound();
      setGameState(GameState.Playing);
    }
  }, [gameState, countdown]);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (gameState === GameState.Playing && isTurnActive && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      
      if (timeLeft <= 4 && timeLeft > 1) {
        playUrgentAlertSound();
      }

    } else if (gameState === GameState.Playing && isTurnActive && timeLeft === 0) {
      playTimeoutSound();
      setGameState(GameState.GameOver);
    }
    return () => clearTimeout(timerId);
  }, [gameState, isTurnActive, timeLeft]);


  const startGame = (newPlayers: Player[], newTimeLimit: number, newGameMode: GameMode) => {
    setPlayers(newPlayers);
    setTimeLimit(newTimeLimit);
    setTimeLeft(newTimeLimit);
    setGameMode(newGameMode);
    setGameState(GameState.Theme);
  };
  
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setGameState(GameState.Setup);
  };

  const handleGetLetter = () => {
    const availableLetters = ALPHABET.filter(l => !usedLetters.has(l));
    if (availableLetters.length === 0) {
      setGameState(GameState.GameOver);
      return;
    }
    const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    setUsedLetters(prev => new Set(prev).add(letter));
    setCurrentLetter(letter);
    setTimeLeft(timeLimit);
    setIsTurnActive(true);
    playNextTurnSound();
  };
  
  const handleTurnEnd = useCallback((wasCorrect: boolean) => {
    if (wasCorrect) {
      playSuccessSound();
      setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[currentPlayerIndex].score += 1;
        return updatedPlayers;
      });
    }
    
    if (gameMode === GameMode.Tap) {
      if (usedLetters.size >= ALPHABET.length - 1) {
        setGameState(GameState.GameOver);
        return;
      }
      
      const availableLetters = ALPHABET.filter(l => !usedLetters.has(l));
      const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
      
      setUsedLetters(prev => new Set(prev).add(letter));
      setCurrentLetter(letter);
      setTimeLeft(timeLimit);
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
      playNextTurnSound();
    } else {
      setIsTurnActive(false);
      setCurrentLetter('');
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
      playNextTurnSound();
    }
  }, [currentPlayerIndex, players, gameMode, timeLimit, usedLetters, setGameState]);

  const renderGameState = () => {
    switch (gameState) {
      case GameState.LanguageSelection:
        return <LanguageSelector onSelectLanguage={selectLanguage} />;

      case GameState.Setup:
        return <PlayerSetup onStartGame={startGame} t={t.setup} />;
      
      case GameState.Theme:
        return (
          <div className="flex flex-col items-center justify-center text-white text-center">
            {isLoadingTheme ? (
               <>
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-fuchsia-500"></div>
                <p className="mt-4 text-2xl tracking-wider">{t.theme.loading}</p>
               </>
            ) : (
              <>
                <p className="text-2xl text-gray-400">{t.theme.title}</p>
                <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(77,208,225,0.8)]">{theme}</h1>
              </>
            )}
          </div>
        );

      case GameState.Countdown:
        return (
            <div className="flex items-center justify-center">
              <p className="text-9xl font-bold text-white animate-ping">{countdown}</p>
              <p className="absolute text-9xl font-bold text-white">{countdown}</p>
            </div>
        );

      case GameState.Playing:
        return (
          <GameScreen
            players={players}
            currentPlayer={players[currentPlayerIndex]}
            currentLetter={currentLetter}
            timeLeft={timeLeft}
            timeLimit={timeLimit}
            isTurnActive={isTurnActive}
            onGetLetter={handleGetLetter}
            onTurnEnd={handleTurnEnd}
            onEndGame={() => setGameState(GameState.GameOver)}
            theme={theme}
            gameMode={gameMode}
            t={t.game}
          />
        );
      
      case GameState.GameOver:
        return <GameOver players={players} onPlayAgain={resetGame} t={t.gameOver} />;

      default:
        return null;
    }
  };

  return (
    <main className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderGameState()}
      </div>
    </main>
  );
};

export default App;