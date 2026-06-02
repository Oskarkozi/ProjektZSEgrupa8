import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../services/firebase";
import Form from "./Add_transaction_form.jsx";
import { writeUserData } from "../services/transactionService";
import { getCategoryColor, getCategoryLabel } from "../utils/categories";

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

function DayTile({ dayNumber, className = "", markers = [], onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={"h-24 w-full rounded-xl p-3 text-left text-white shadow-sm flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-md " + className}
        >
            <span className="text-sm font-medium">{dayNumber}</span>
            {markers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {markers.map((marker) => (
                        <span
                            key={marker.id}
                            className="h-2.5 w-2.5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: marker.color }}
                            title={marker.label}
                        />
                    ))}
                </div>
            )}
        </button>
    );
}

function DayTransactionsModal({ day, monthIndex, transactions, onClose, onAddTransaction, onOpenTransactionInHistory }) {
    if (!day) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-5 text-left shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Transakcje z dnia {day} {MONTHS[monthIndex]}
                        </h2>
                        <p className="text-sm text-slate-400">Kliknij transakcję, aby przejść do historii.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => {
                            const label = getCategoryLabel(transaction.category);
                            const color = getCategoryColor(transaction.category);

                            return (
                                <button
                                    key={transaction.id}
                                    type="button"
                                    onClick={() => onOpenTransactionInHistory(transaction.id)}
                                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left transition-colors hover:border-slate-600 hover:bg-slate-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="h-3 w-3 rounded-full shadow-sm"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{label}</span>
                                            <span className="text-xs text-slate-400">
                                                {transaction.description || "Brak opisu"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-slate-500">{transaction.date}</div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div>
                        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
                            Brak transakcji w tym dniu.
                                                       
                        </div>
                         <button
                                                                type="button"
                                                                onClick={onAddTransaction}
                                                                className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                                                        >
                                                                + Dodaj transakcję
                                                        </button>
                                                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export default function CalendarPage({ onOpenTransactionInHistory }) {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [transactions, setTransactions] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formInitialData, setFormInitialData] = useState(null);

    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        if (!currentUserId) return;

        const expensesRef = ref(database, "users/" + currentUserId + "/expenses");

        const unsubscribe = onValue(expensesRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedTransactions = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...val,
                }));

                setTransactions(loadedTransactions.reverse());
            } else {
                setTransactions([]);
            }
        });

        return () => unsubscribe();
    }, [currentUserId]);

    const daysInMonth = useMemo(
        () => getDaysInMonth(selectedYear, selectedMonth),
        [selectedYear, selectedMonth]
    );

    const days = useMemo(
        () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
        [daysInMonth]
    );

    const firstDayOfWeek = useMemo(
        () => (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7,
        [selectedYear, selectedMonth]
    );

    const years = useMemo(
        () => Array.from({ length: 100 }, (_, index) => today.getFullYear() - 3 + index),
        []
    );

    const transactionsByDay = useMemo(() => {
        return transactions.reduce((accumulator, transaction) => {
            if (typeof transaction.date !== "string") {
                return accumulator;
            }

            const [yearText, monthText, dayText] = transaction.date.split("-");
            const year = Number(yearText);
            const month = Number(monthText) - 1;
            const day = Number(dayText);

            if (year !== selectedYear || month !== selectedMonth || Number.isNaN(day)) {
                return accumulator;
            }

            if (!accumulator[day]) {
                accumulator[day] = [];
            }

            accumulator[day].push({
                id: transaction.id,
                color: getCategoryColor(transaction.category),
                label: getCategoryLabel(transaction.category),
            });

            return accumulator;
        }, {});
    }, [transactions, selectedYear, selectedMonth]);

    const transactionsBySelectedDay = useMemo(() => {
        if (!selectedDay) {
            return [];
        }

        return transactions.filter((transaction) => {
            if (typeof transaction.date !== "string") {
                return false;
            }

            const [yearText, monthText, dayText] = transaction.date.split("-");
            const year = Number(yearText);
            const month = Number(monthText) - 1;
            const day = Number(dayText);

            return year === selectedYear && month === selectedMonth && day === selectedDay;
        });
    }, [transactions, selectedDay, selectedYear, selectedMonth]);

    const selectedDayDate = useMemo(() => {
        if (!selectedDay) {
            return null;
        }

        const month = String(selectedMonth + 1).padStart(2, "0");
        const day = String(selectedDay).padStart(2, "0");
        return `${selectedYear}-${month}-${day}`;
    }, [selectedDay, selectedMonth, selectedYear]);

    const handleAddTransaction = () => {
        if (!selectedDayDate) return;

        setFormInitialData({ date: selectedDayDate });
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
        setFormInitialData(null);
    };

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
                    const dayMarkers = transactionsByDay[day] || [];

                    return (
                        <DayTile
                            key={day}
                            dayNumber={day}
                            className={bgClass}
                            markers={dayMarkers}
                            onClick={() => setSelectedDay(day)}
                        />
                    );
                })}
            </div>

            <DayTransactionsModal
                day={selectedDay}
                monthIndex={selectedMonth}
                transactions={transactionsBySelectedDay}
                onClose={() => setSelectedDay(null)}
                onAddTransaction={handleAddTransaction}
                onOpenTransactionInHistory={(transactionId) => {
                    setSelectedDay(null);
                    onOpenTransactionInHistory?.(transactionId);
                }}
            />

            {isFormVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-3xl rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
                        >
                            ✕
                        </button>
                        <Form
                            userId={currentUserId}
                            onSaveTransaction={writeUserData}
                            onCloseForm={handleCloseForm}
                            initialData={formInitialData}
                            isEditing={false}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
