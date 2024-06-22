import { useTranslation } from "react-i18next";

export function useI18nProvider() {
  const { t, i18n } = useTranslation();

  return {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
}
