export type Locale = 'en';

export const translations = {
    en: {
        'nav.space': 'Space',
        'nav.mood': 'Mood',
        'nav.habits': 'Habits',
        'nav.goals': 'Goals',
        'nav.schedule': 'Schedule',
        'nav.journal': 'Journal',
        'nav.library': 'Library',
        'nav.awards': 'Awards',
        'nav.insights': 'Insights',
        'nav.community': 'Community',
        'nav.safety': 'Safety',
        'dock.open': 'Open Navigation Menu',
        'dock.close': 'Close Navigation Menu',
        'nav.back': 'Back',
        'nav.profile': 'Profile',
    },
};

export function t(key: string, locale: Locale = 'en'): string {
    // @ts-ignore
    return translations[locale][key] || key;
}
