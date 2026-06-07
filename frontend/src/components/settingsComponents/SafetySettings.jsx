export const SafetyTab = ({ isDarkTheme = true }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">dodaj 2factor authentication</h2>
        <label className={`flex items-center space-x-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}`}>
            <input type="checkbox" className="form-checkbox" />
            <span>Włącz 2-factor authentication</span>
        </label>
    </div>
);