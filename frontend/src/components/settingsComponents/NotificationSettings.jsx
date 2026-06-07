export const NotificationsTab = ({ isDarkTheme = true }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">Edytuj powiadomienia</h2>
    <label className={`flex items-center space-x-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
      <input type="checkbox" className="form-checkbox" />
      <span>Włącz powiadomienia e-mail</span>
    </label>
    <label className={`flex items-center space-x-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
      <input type="checkbox" className="form-checkbox" />
      <span>Włącz powiadomienia push</span>
    </label>
  </div>
);
