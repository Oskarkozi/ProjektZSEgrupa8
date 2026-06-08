import {
	CartesianGrid,
	Bar,
	BarChart as RechartsBarChart,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const demoData = [
	{ name: 'Sty', income: 1200, expenses: 800 },
	{ name: 'Lut', income: 1400, expenses: 950 },
	{ name: 'Mar', income: 1100, expenses: 700 },
	{ name: 'Kwi', income: 1600, expenses: 1050 },
	{ name: 'Maj', income: 1500, expenses: 900 },
	{ name: 'Cze', income: 1700, expenses: 1150 },
];

// Prosty wykres słupkowy używany jako demo przychodów i wydatków.
export default function LineChart() {
	return (
		<div className="mt-4 h-90 w-full rounded-2xl border border-gray-700 bg-gray-800/80 p-4 shadow-lg">
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart data={demoData} barCategoryGap="20%">
					<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
					<XAxis dataKey="name" stroke="#9ca3af" />
					<YAxis stroke="#9ca3af" allowDecimals={false} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#111827',
							border: '1px solid #374151',
							borderRadius: '12px',
							color: '#f9fafb',
						}}
					/>
					<Legend />
					<Bar
						dataKey="income"
						name="Przychody"
						fill="#059669"
						radius={[8, 8, 0, 0]}
						barSize={28}
					/>
					<Bar
						dataKey="expenses"
						name="Wydatki"
						fill="#991B1B"
						radius={[8, 8, 0, 0]}
						barSize={28}
					/>
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
}
