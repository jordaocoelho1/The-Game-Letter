import React from 'react';
import { Language } from '../types';
import { playClickSound } from '../services/soundService';

interface LanguageSelectorProps {
  onSelectLanguage: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
  
  const handleSelect = (lang: Language) => {
    playClickSound();
    onSelectLanguage(lang);
  };
  
  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-center border border-slate-700">
      <h1 className="text-3xl font-bold text-cyan-400 mb-2">Select Language</h1>
      <p className="text-slate-400 mb-8">Escolha o Idioma</p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => handleSelect('en')}
          className="w-full bg-slate-700 hover:bg-cyan-500 hover:text-slate-900 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
        >
          English
        </button>
        <button
          onClick={() => handleSelect('pt')}
          className="w-full bg-slate-700 hover:bg-cyan-500 hover:text-slate-900 text-white font-bold py-4 px-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
        >
          Português (Brasil)
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;