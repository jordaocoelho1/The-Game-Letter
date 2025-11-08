import { Language } from '../types.ts';
import { en } from '../locales/en.ts';
import { pt } from '../locales/pt.ts';

export const useTranslations = (lang: Language) => {
  if (lang === 'pt') {
    return pt;
  }
  return en;
};