import { useMemo, useState, useEffect } from 'react';
import {
	Cell,
	Legend,
	PieChart,
	Pie,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import { categories } from '../utils/categories';
import { auth, realtimeDB } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

const categoryOptions = [
	{ id: 'all', label: 'wszystkie' },
	...Object.values(categories.income),
	...Object.values(categories.expense),
];

const timePeriods = [
	{ id: 'week', label: 'Ostatni tydzień' },
	{ id: 'month', label: 'Ostatni miesiąc' },
	{ id: 'quarter', label: 'Ostatnie 3 miesiące' },
	{ id: 'year', label: 'Ostatni rok' },
	{ id: 'all', label: 'Wszystko' },
];

function getDateRangeFilter(periodId) {
	const now = new Date();
	let startDate = new Date();

	switch (periodId) {
		case 'week':
			startDate.setDate(now.getDate() - 7);
			break;
		case 'month':
			startDate.setMonth(now.getMonth() - 1);
			break;
		case 'quarter':
			startDate.setMonth(now.getMonth() - 3);
			break;
		case 'year':
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		default:
			startDate = new Date('2000-01-01');
	}

	return startDate.toISOString().split('T')[0];
}

function getPreviousPeriodDateRange(periodId) {
	const now = new Date();
	let currentStart = new Date();
	let previousStart = new Date();
	let previousEnd = new Date();

	switch (periodId) {
		case 'week':
			currentStart.setDate(now.getDate() - 7);
			previousStart.setDate(now.getDate() - 14);
			previousEnd.setDate(now.getDate() - 7);
			break;
		case 'month':
			currentStart.setMonth(now.getMonth() - 1);
			previousStart.setMonth(now.getMonth() - 2);
			previousEnd.setMonth(now.getMonth() - 1);
			break;
		case 'quarter':
			currentStart.setMonth(now.getMonth() - 3);
			previousStart.setMonth(now.getMonth() - 6);
			previousEnd.setMonth(now.getMonth() - 3);
			break;
		case 'year':
			currentStart.setFullYear(now.getFullYear() - 1);
			previousStart.setFullYear(now.getFullYear() - 2);
			previousEnd.setFullYear(now.getFullYear() - 1);
			break;
		default:
			return { start: '2000-01-01', end: '2000-01-01' };
	}

	return {
		start: previousStart.toISOString().split('T')[0],
		end: previousEnd.toISOString().split('T')[0],
	};
}

function getPieChartDataFromTransactions(transactions, selectedCategory, timePeriod) {
	const startDate = getDateRangeFilter(timePeriod);

	// Filtruj transakcje po dacie
	const filtered = transactions.filter(t => {
		return t.date >= startDate;
	});

	if (filtered.length === 0) {
		return [{ name: 'Brak danych', value: 100, color: '#6B7280' }];
	}

	if (selectedCategory === 'all') {
		// Sumuj wszystkie przychody i wydatki
		let income = 0;
		let expenses = 0;

		filtered.forEach(t => {
			const amount = parseFloat(t.amount) || 0;
			if (t.type === 'income') {
				income += amount;
			} else {
				expenses += amount;
			}
		});

		const pieData = [];
		if (income > 0) {
			pieData.push({ name: 'Przychody', value: income, color: '#059669' });
		}
		if (expenses > 0) {
			pieData.push({ name: 'Wydatki', value: expenses, color: '#991B1B' });
		}

		return pieData.length > 0 ? pieData : [{ name: 'Brak danych', value: 100, color: '#6B7280' }];
	} else {
		// Filtruj po kategorii
		const categoryFiltered = filtered.filter(t => t.category === selectedCategory);

		if (categoryFiltered.length === 0) {
			return [{ name: 'Brak danych', value: 100, color: '#6B7280' }];
		}

		let income = 0;
		let expenses = 0;

		categoryFiltered.forEach(t => {
			const amount = parseFloat(t.amount) || 0;
			if (t.type === 'income') {
				income += amount;
			} else {
				expenses += amount;
			}
		});

		const pieData = [];
		if (income > 0) {
			pieData.push({ name: 'Przychody', value: income, color: '#059669' });
		}
		if (expenses > 0) {
			pieData.push({ name: 'Wydatki', value: expenses, color: '#991B1B' });
		}

		return pieData.length > 0 ? pieData : [{ name: 'Brak danych', value: 100, color: '#6B7280' }];
	}
}

function getCategoryTitle(categoryId) {
	if (categoryId === 'all') {
		return 'wszystkie';
	}

	const allCategories = {
		...categories.income,
		...categories.expense,
	};

	return allCategories[categoryId]?.label || categoryId;
}

export default function AnalyticsPage() {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedTimePeriod, setSelectedTimePeriod] = useState('month');
	const [transactions, setTransactions] = useState([]);

	// Pobierz dane z Firebase
	useEffect(() => {
		const user = auth.currentUser;
		if (!user?.uid) return;

		const expensesRef = ref(realtimeDB, 'users/' + user.uid + '/expenses');
		const unsubscribe = onValue(expensesRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const txList = Object.entries(data).map(([id, val]) => ({
					id,
					...val
				}));
				setTransactions(txList);
			} else {
				setTransactions([]);
			}
		});

		return () => unsubscribe();
	}, []);

	const pieData = useMemo(() => {
		return getPieChartDataFromTransactions(transactions, selectedCategory, selectedTimePeriod);
	}, [selectedCategory, selectedTimePeriod, transactions]);

	const totals = useMemo(() => {
		const total = pieData.reduce((sum, item) => sum + item.value, 0);
		const income = pieData.find(item => item.name === 'Przychody')?.value || 0;
		const expenses = pieData.find(item => item.name === 'Wydatki')?.value || 0;

		return {
			total,
			income,
			expenses,
			balance: income - expenses,
		};
	}, [pieData]);

	const previousPeriodComparison = useMemo(() => {
		const now = new Date();
		const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
		const currentMonthEnd = now.toISOString().split('T')[0];

		const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
		const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

		// Current month expenses (all categories)
		const currentFiltered = transactions.filter(t => {
			return t.date >= currentMonthStart && t.date <= currentMonthEnd && t.type === 'expense';
		});

		// Previous month expenses (all categories)
		const previousFiltered = transactions.filter(t => {
			return t.date >= previousMonthStart && t.date <= previousMonthEnd && t.type === 'expense';
		});

		const currentExpenses = currentFiltered.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
		const previousExpenses = previousFiltered.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
		const difference = currentExpenses - previousExpenses;

		return { currentExpenses, previousExpenses, difference };
	}, [transactions]);

	return (
		<div className="overflow-hidden max-h-screen h-screen flex flex-col" style={{ scrollbarWidth: 'none' }}>
			<div className="text-center pt-2 flex-shrink-0">
				<h2 className="text-2xl font-bold text-white">Twoje statystyki</h2>
				<p className="mt-1 text-sm text-gray-400">Przychody vs wydatki dla wybranej kategorii w okresie: <span className="text-emerald-400 font-medium">{timePeriods.find(p => p.id === selectedTimePeriod)?.label}</span></p>
			</div>

			<div className="flex-1 overflow-hidden flex flex-col gap-6 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(340px,380px)_minmax(0,700px)] lg:auto-rows-fr max-w-5xl mx-auto items-stretch w-full">
				<section className="rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Kategoria</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded-lg text-white font-medium focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
							>
								{categoryOptions.map((category) => (
									<option key={category.id} value={category.id} className="bg-gray-900">
										{category.label.charAt(0).toUpperCase() + category.label.slice(1)}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Okres czasu</label>
							<select
								value={selectedTimePeriod}
								onChange={(e) => setSelectedTimePeriod(e.target.value)}
								className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600 rounded-lg text-white font-medium focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
							>
								{timePeriods.map((period) => (
									<option key={period.id} value={period.id} className="bg-gray-900">
										{period.label}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-3 pt-4 border-t border-gray-700">
							<div>
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Przychody</p>
								<p className="text-2xl font-bold text-emerald-400">{'$' + Number(totals.income).toLocaleString('en-US')}</p>
							</div>
							<div>
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Wydatki</p>
								<p className="text-2xl font-bold text-red-400">{'$' + Number(totals.expenses).toLocaleString('en-US')}</p>
							</div>
							<div className="h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
							<div>
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Saldo</p>
								<p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
									{totals.balance >= 0 ? ('$' + Number(totals.balance).toLocaleString('en-US')) : ('-$' + Number(Math.abs(totals.balance)).toLocaleString('en-US'))}
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 p-6 shadow-xl backdrop-blur-sm border border-gray-700/50 flex flex-col">
					<div className="mb-4 text-center">
						<h3 className="text-lg font-bold text-white">Rozkład: {getCategoryTitle(selectedCategory)}</h3>
					</div>

					<div className="flex items-center justify-center flex-1 min-h-[350px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) => `${name}: $${value.toLocaleString('en-US')}`}
									outerRadius={110}
									fill="#8884d8"
									dataKey="value"
								>
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: '#111827',
										border: '1px solid #374151',
										borderRadius: '8px',
										color: '#f9fafb',
									}}
									formatter={(value) => `$${Number(value).toLocaleString('en-US')}`}
								/>
								<Legend verticalAlign="bottom" height={36} />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</section>
			</div>

			{selectedTimePeriod !== 'all' && (
				<div className="flex-shrink-0 max-w-5xl mx-auto w-full px-4">
					<section className="rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 p-6 shadow-xl backdrop-blur-sm border border-gray-700/50">
						<h3 className="text-lg font-bold text-white mb-6">Porównanie miesięcy</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="rounded-lg bg-gray-900/50 p-4 border border-gray-700">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Wydatki ten miesiąc</p>
								<p className="text-2xl font-bold text-red-400">{'$' + Number(previousPeriodComparison.currentExpenses).toLocaleString('en-US')}</p>
							</div>

							<div className="rounded-lg bg-gray-900/50 p-4 border border-gray-700">
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Wydatki poprzedni miesiąc</p>
								<p className="text-2xl font-bold text-gray-300">{'$' + Number(previousPeriodComparison.previousExpenses).toLocaleString('en-US')}</p>
							</div>

							<div className={`rounded-lg bg-gray-900/50 p-4 border border-gray-700`}>
								<p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Różnica</p>
								<div className="flex items-baseline gap-2">
									<p className={`text-2xl font-bold ${previousPeriodComparison.difference < 0 ? 'text-emerald-400' : previousPeriodComparison.difference > 0 ? 'text-white-400' : 'text-gray-300'}`}>
										{previousPeriodComparison.difference === 0 ? '0' : ('$' + Number(Math.abs(previousPeriodComparison.difference)).toLocaleString('en-US'))}
									</p>
									<span className={`text-sm font-medium ${previousPeriodComparison.difference < 0 ? 'text-emerald-400' : previousPeriodComparison.difference > 0 ? 'text-white-400' : 'text-gray-300'}`}>
										{previousPeriodComparison.difference < 0 ? 'mniej' : previousPeriodComparison.difference > 0 ? 'więcej' : 'równo'}
									</span>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}
			</div>
		</div>
	);
}