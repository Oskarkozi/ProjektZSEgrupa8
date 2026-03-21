export const categories ={
  income:{
    salary: { id: 'salary', label: 'Wynagrodzenie', color: '#10B981' },
    freelance: { id: 'freelance', label: 'Zlecenia', color: '#3B82F6' },
    investments: { id: 'investments', label: 'Inwestycje', color: '#8B5CF6' },
    gifts: { id: 'gifts', label: 'Prezenty', color: '#F59E0B' },
    other_income: { id: 'other_income', label: 'Inne', color: '#6B7280' }
  },
  expense:{
    food: { id: 'food', label: 'Jedzenie', color: '#EF4444' },
    transport: { id: 'transport', label: 'Transport', color: '#3B82F6' },
    entertainment: { id: 'entertainment', label: 'Rozrywka', color: '#8B5CF6' },
    shopping: { id: 'shopping', label: 'Zakupy', color: '#F59E0B' },
    bills: { id: 'bills', label: 'Rachunki', color: '#10B981' },
    health: { id: 'health', label: 'Zdrowie', color: '#EF4444' },
    education: { id: 'education', label: 'Edukacja', color: '#3B82F6' },
    other_expense: { id: 'other_expense', label: 'Inne', color: '#6B7280' }
  }
}
export const getCategoryLabel=(id) =>{
    const allCategories = {...categories.income, ...categories.expense};
    return allCategories[id] ? allCategories[id].label : id;
};
export const getCategoryColor = (id) => {
    const allCategories = {...categories.income, ...categories.expense};
    return allCategories[id] ? allCategories[id].color : '#9CA3AF';
};