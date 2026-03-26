import { Fragment, ReactNode, startTransition, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { getTranslationMapping, setGlobalTranslationHandle, TranslationContext, TranslationItemRecord } from 'shared';
import { z } from 'zod';
import { $ZodConfig } from 'zod/v4/core';
import { axiosInstance } from '@/api/axios.ts';
import { getGlobalStore } from '@/stores/global.ts';
import baseTranslations from '@/translations.ts';

const modules = import.meta.glob('/node_modules/zod/v4/locales/*.js');

type LanguageData = {
  items: TranslationItemRecord;
  translations: Record<string, string>;
};

declare global {
  interface String {
    md(): ReactNode;
  }
}

String.prototype.md = function (): ReactNode {
  return <Markdown>{this.toString()}</Markdown>;
};

const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('last_language') || getGlobalStore().settings.app.language || 'en',
  );
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);

  const loadZod = async (lang: string) => {
    if (!modules[`/node_modules/zod/v4/locales/${lang}.js`]) {
      return;
    }

    const { default: locale } = (await modules[`/node_modules/zod/v4/locales/${lang}.js`]()) as {
      default: () => $ZodConfig;
    };

    z.config(locale());
  };

  useEffect(() => {
    startTransition(() => {
      if (language === 'en') {
        setLanguageData(null);
      } else {
        axiosInstance
          .get(`/translations/${language}.json`)
          .then(({ data }) => {
            const result: LanguageData = {
              items: data[''].items,
              translations: data[''].translations,
            };

            for (const key in data) {
              if (key === '') continue;

              for (const item in data[key].items) {
                result.items[`${key}.${item}`] = data[key].items[item];
              }
              for (const translation in data[key].translations) {
                result.translations[`${key}.${translation}`] = data[key].translations[translation];
              }
            }

            result.translations = getTranslationMapping(result.translations);

            if (import.meta.env.DEV) {
              console.debug('Loaded language data', language, result);
            }

            setLanguageData(result);
          })
          .catch((err) => {
            setLanguage('en');
            console.error(err);
          });
      }

      loadZod(language);
    });

    localStorage.setItem('last_language', language);
  }, [language]);

  const t = (key: string, values: Record<string, string | number>): string => {
    if (!languageData?.translations[key] && !baseTranslations.mapping[key as never]) {
      throw new Error(`Language key ${key} not found.`);
    }

    let translation = languageData?.translations[key] || (baseTranslations.mapping[key as never] as string);

    if (values) {
      Object.keys(values).forEach((placeholder) => {
        translation = translation.replaceAll(`{${placeholder}}`, String(values[placeholder]));
      });
    }

    return translation;
  };

  const tReact = (key: string, values: Record<string, ReactNode>): ReactNode => {
    if (!languageData?.translations[key] && !baseTranslations.mapping[key as never]) {
      throw new Error(`Language key ${key} not found.`);
    }

    let translation = languageData?.translations[key] || (baseTranslations.mapping[key as never] as string);

    if (values) {
      const reactNodeKeys: string[] = [];
      Object.keys(values).forEach((placeholder) => {
        const value = values[placeholder];
        if (typeof value === 'string' || typeof value === 'number') {
          translation = translation.replaceAll(`{${placeholder}}`, String(value));
        } else {
          reactNodeKeys.push(placeholder);
          translation = translation.replaceAll(`{${placeholder}}`, `%%${placeholder}%%`);
        }
      });

      if (reactNodeKeys.length === 0) {
        return (
          <Markdown
            components={{
              p: ({ children }) => <>{children}</>,
            }}
          >
            {translation}
          </Markdown>
        );
      }

      const parts = translation.split(/(%%\w+%%)/g);
      return (
        <span>
          {parts.map((part, index) => {
            const match = part.match(/%%(\w+)%%/);
            if (match) {
              const placeholder = match[1];
              return <Fragment key={index}>{values[placeholder]}</Fragment>;
            }

            const leadingSpace = part.startsWith(' ') ? ' ' : '';
            const trailingSpace = part.endsWith(' ') ? ' ' : '';
            const trimmed = part.trim();
            if (!trimmed) {
              return <Fragment key={index}>{part}</Fragment>;
            }

            const hasMarkdown = /[*_`~[!#]/.test(trimmed);
            if (!hasMarkdown) {
              return <Fragment key={index}>{part}</Fragment>;
            }

            return (
              <Fragment key={index}>
                {leadingSpace}
                <Markdown
                  components={{
                    p: ({ children }) => <>{children}</>,
                  }}
                >
                  {trimmed}
                </Markdown>
                {trailingSpace}
              </Fragment>
            );
          })}
        </span>
      );
    }

    return (
      <Markdown
        components={{
          p: ({ children }) => <>{children}</>,
        }}
      >
        {translation}
      </Markdown>
    );
  };

  const tItem = (key: string, count: number): string => {
    if (!languageData?.items[key] && !baseTranslations.items[key as never]) {
      throw new Error(`Language item key ${key} not found.`);
    }

    const translationItem = languageData?.items[key] || baseTranslations.items[key as never];
    const rules = new Intl.PluralRules(language);

    return translationItem[rules.select(count)].replaceAll('{count}', count.toString());
  };

  setGlobalTranslationHandle({ language, setLanguage, t, tReact, tItem });

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, tReact, tItem }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
export { getTranslations, useTranslations } from './contexts/translationContext.ts';
