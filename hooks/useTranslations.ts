import { Language } from '../types';
import { en } from '../locales/en';
import { pt } from '../locales/pt';

export const useTranslations = (lang: Language) => {
  if (lang === 'pt') {
    return pt;
  }
  return en;
};