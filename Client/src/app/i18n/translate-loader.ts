import { Injectable, Provider } from '@angular/core';
import {
  provideTranslateLoader,
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import enTranslations from '../../../public/i18n/en.json';
import ukTranslations from '../../../public/i18n/uk.json';

export const SUPPORTED_LANGUAGES = ['uk', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'uk';
export const LANGUAGE_STORAGE_KEY = 'app_language';

export function getInitialLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      return saved;
    }
  }
  return DEFAULT_LANGUAGE;
}

@Injectable()
export class JsonFileLoader extends TranslateLoader {
  private readonly translations: Record<string, TranslationObject> = {
    uk: ukTranslations,
    en: enTranslations,
  };

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(this.translations[lang] ?? {});
  }
}

export function provideAppTranslate(): Provider[] {
  const initialLang = getInitialLanguage();
  return provideTranslateService({
    loader: provideTranslateLoader(JsonFileLoader),
    fallbackLang: DEFAULT_LANGUAGE,
    lang: initialLang,
    langs: [...SUPPORTED_LANGUAGES],
  });
}
