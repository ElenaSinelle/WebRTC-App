// Типы для переводов
export interface Translation {
  title: string;
  body: string;
  disable: string;
  disable_ios: string;
  disable_and: string;
  ok: string;
  dir?: 'rtl';
}

export interface Translations {
  [key: string]: Translation;
}

export type LanguageCode = 'en' | 'ru' | 'es' | 'pt' | 'fr' | 'de' | 'ar' | 'zh' | 'hi' | 'id';

export interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: unknown;
  };
  TelegramWebviewProxy?: unknown;
  TelegramWebview?: unknown;
}
