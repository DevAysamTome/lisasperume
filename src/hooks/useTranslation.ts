import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';

type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return { t };
}; 