import { useMemo, useState } from "react";

const MONTHS = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
];

function DayTile({ dayNumber, className = "" }) {
    return (
        <div className={"h-24 w-full rounded-xl p-3 text-white shadow-sm " + className}>
            <span className="text-sm font-medium">{dayNumber}</span>
        </div>
    );
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getWeekdayName(year, month, day) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("pl-PL", { weekday: "long" });
}

export default function CalendarPage() {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const daysInMonth = useMemo(
        () => getDaysInMonth(selectedYear, selectedMonth),
        [selectedYear, selectedMonth]
    );

    const days = useMemo(
        () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
        [daysInMonth]
    );

    const firstDayOfWeek = useMemo(
        () => new Date(selectedYear, selectedMonth, 0).getDay(),
        [selectedYear, selectedMonth]
    );

    const years = useMemo(
        () => Array.from({ length: 100 }, (_, index) => today.getFullYear() - 3 + index),
        [today]
    );

    return (
        <section className="w-full p-4 text-gray-100">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <h1 className="mr-4 text-2xl font-bold">Kalendarz</h1>

                <select
                    name="month"
                    id="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(Number(event.target.value))}
                    className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
                >
                    {MONTHS.map((monthName, monthIndex) => (
                        <option key={monthName} value={monthIndex}>
                            {monthName}
                        </option>
                    ))}
                </select>

                <select
                    name="year"
                    id="year"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(Number(event.target.value))}
                    className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-400">
                        {day}
                    </div>
                ))}
            
                </div>        
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <DayTile
                        key={`empty-${i}`}
                        dayNumber={""}
                        className={"bg-transparent border border-transparent"}
                    />
                ))}

                {days.map((day) => {
                    const isToday =
                        day === today.getDate() &&
                        selectedMonth === today.getMonth() &&
                        selectedYear === today.getFullYear();
                    const bgClass = isToday
                        ? "bg-emerald-500/80 border-emerald-400"
                        : "bg-slate-800/60 border border-slate-700";

                    return <DayTile key={day} dayNumber={day} className={bgClass} />;
                })}
            </div>
        </section>
    );
}
