import React from 'react';
import { useState, useEffect } from 'react';
import { ProfileTab } from './settingsComponents/ProfileSettings';
import { LanguageTab } from './settingsComponents/LanguageSettings';
import { NotificationsTab } from './settingsComponents/NotificationSettings';
import { SafetyTab } from './settingsComponents/SafetySettings';
import { AboutTab } from './settingsComponents/AboutApp';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useT } from '../i18n';

// Strona ustawień — wybiera i renderuje odpowiednią zakładkę ustawień.
export default function Settings({ isDarkTheme, setIsDarkTheme, userId }) {
    const [activeTab, setActiveTab] = useState('profile');
    const t = useT();

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileTab isDarkTheme={isDarkTheme} />;
            case 'language':
                return <LanguageTab isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} userId={userId} />;
            case 'notifications':
                return <NotificationsTab isDarkTheme={isDarkTheme} />;
            case 'security':
                return <SafetyTab isDarkTheme={isDarkTheme} />;
            case 'about':
                return <AboutTab isDarkTheme={isDarkTheme} />;
        }
    }
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Wylogowano pomyślnie");
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        }
    };

    return (
        <div className={`flex flex-row w-full h-full text-center py-20 ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>
            <div className="w-1/3 flex items-center justify-center flex-col space-y-4">
                <button className={`p-2 ${activeTab === 'profile' ? 'font-bold text-blue-500' : ''}`} onClick={() => setActiveTab('profile')}>{t('profile')}</button>
                <button className={`p-2 ${activeTab === 'language' ? 'font-bold text-blue-500' : ''}`} onClick={() => setActiveTab('language')}>{t('appSettings')}</button>
                {/* <button className={`p-2 ${activeTab === 'notifications' ? 'font-bold text-blue-500' : ''}`}onClick={() => setActiveTab('notifications')}>Powiadomienia</button> */}
                {/**<button className={`p-2 ${activeTab === 'security' ? 'font-bold text-blue-500' : ''}`}onClick={() => setActiveTab('security')}>Bezpieczeństwo</button>**/}
                <button className={`p-2 ${activeTab === 'about' ? 'font-bold text-blue-500' : ''}`} onClick={() => setActiveTab('about')}>{t('about')}</button>
                <button onClick={handleLogout} className="p-2 text-red-500 hover:text-red-700">{t('logout')}</button>
            </div>
            <div className="w-2/3 flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    );
}
