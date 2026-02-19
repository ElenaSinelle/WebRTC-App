'use client';

import { useEffect } from 'react';
import { LanguageCode, TelegramWindow, Translation } from './tgHint.types';
import { translations } from './translations';

export const TgHintLoader = (): null => {
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const initTgHint = (): void => {
      const tgWindow = window as TelegramWindow;

      if (
        !(
          tgWindow.Telegram?.WebApp ||
          tgWindow.TelegramWebviewProxy ||
          tgWindow.TelegramWebview ||
          /(Telegram-Android|Telegram\/|TDesktop|TWeb)/i.test(navigator.userAgent)
        )
      ) {
        if (isDev) console.log('Not in Telegram, tg-hint skipped');
        return;
      }

      // detect browser language
      const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
      const defaultLang: LanguageCode = translations[browserLang] ? (browserLang as LanguageCode) : 'en';

      let overlayElement: HTMLElement | null = null;

      // create overlay html
      const createOverlayHTML = (langData: Translation): string => {
        const dirAttribute = langData.dir ? `dir="${langData.dir}"` : '';

        return `
          <div id="tgHint" style="position:fixed;inset:0;background:#0006;
               backdrop-filter:blur(5px);display:flex;justify-content:center;
               align-items:center;z-index:2147483647;font:16px/1.4 system-ui;">
            <div style="background:#fff;border-radius:14px;padding:26px 24px;max-width:360px;width:90%;" ${dirAttribute}>
              <select id="tgLang" style="float:right;margin:-6px 0 6px 0;">
                ${Object.keys(translations)
                  .map((lang) => `<option value="${lang}">${lang.toUpperCase()}</option>`)
                  .join('')}
              </select>
              <h3 style="margin:0 0 12px">${langData.title}</h3>
              <p>${langData.body}</p>
              <details style="margin:12px 0">
                <summary>${langData.disable}</summary>
                <p style="margin:6px 0 0">${langData.disable_ios}</p>
                <p style="margin:6px 0 0">${langData.disable_and}</p>
              </details>
              <button id="tgOk" style="margin-top:14px;padding:6px 12px;border:none;
                  background:#0088cc;color:#fff;border-radius:6px;cursor:pointer">${langData.ok}</button>
            </div>
          </div>
        `;
      };

      // hint function
      const showHint = (langCode: LanguageCode): void => {
        if (overlayElement) {
          overlayElement.remove();
        }

        const langData = translations[langCode];
        document.body.insertAdjacentHTML('afterbegin', createOverlayHTML(langData));

        overlayElement = document.getElementById('tgHint');

        if (!overlayElement) {
          console.error('Failed to create tg-hint element');
          return;
        }

        const langSelect = overlayElement.querySelector<HTMLSelectElement>('#tgLang');
        if (langSelect) {
          langSelect.value = langCode;
          langSelect.onchange = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            showHint(target.value as LanguageCode);
          };
        }

        const okButton = overlayElement.querySelector<HTMLButtonElement>('#tgOk');
        if (okButton) {
          okButton.onclick = () => {
            overlayElement?.remove();
            overlayElement = null;
            if (isDev) console.log(' tg-hint closed');
          };
        }

        if (isDev) console.log('tg-hint shown with language:', langCode);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => showHint(defaultLang));
      } else {
        showHint(defaultLang);
      }
    };

    initTgHint();

    // Cleanup function
    return (): void => {
      const existingHint = document.getElementById('tgHint');
      if (existingHint) {
        existingHint.remove();
        if (isDev) console.log('🧹 tg-hint cleaned up');
      }
    };
  }, []);

  return null;
};
