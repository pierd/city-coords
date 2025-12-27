import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import type { City } from '../data/capitals';
import {
  getTranslatedCityName,
  getTranslatedCountryName,
  type SupportedLang,
} from '../data/cityTranslations';

export interface TranslatedCity extends City {
  translatedName: string;
  translatedCountry: string;
}

export function useTranslatedCity() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.substring(0, 2) || 'en') as SupportedLang;

  const translateCity = useCallback(
    (city: City): TranslatedCity => ({
      ...city,
      translatedName: getTranslatedCityName(city.name, currentLang),
      translatedCountry: getTranslatedCountryName(city.country, currentLang),
    }),
    [currentLang]
  );

  const getDisplayName = useCallback(
    (city: City) => getTranslatedCityName(city.name, currentLang),
    [currentLang]
  );

  const getDisplayCountry = useCallback(
    (city: City) => getTranslatedCountryName(city.country, currentLang),
    [currentLang]
  );

  return {
    currentLang,
    translateCity,
    getDisplayName,
    getDisplayCountry,
  };
}
