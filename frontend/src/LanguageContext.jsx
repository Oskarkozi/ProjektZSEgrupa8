import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ language: 'pl', setLanguage: () => { } });

export function LanguageProvider({ children, initialLanguage = 'pl' }) {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        if (initialLanguage) setLanguage(initialLanguage);
    }, [initialLanguage]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default LanguageContext;
