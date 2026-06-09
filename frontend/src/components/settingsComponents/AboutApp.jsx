import { useT } from '../../i18n';
 
// Krótki opis aplikacji i informacje o wersji.
 
export const AboutTab = ({ isDarkTheme = true }) => {
const t = useT();
    return(
   
    <div className="space-y-4">
        <h2 className="text-xl font-bold">{t('aboutApp')}</h2>
        <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{t('aboutAppText')}</p>
        <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{t('version')} 1.0.0</p>
    </div>
);
};
 