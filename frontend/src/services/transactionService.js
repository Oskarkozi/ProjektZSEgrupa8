// Funkcje Helpera dla Firebase - Transaction Service
import { ref, set, push, update, remove } from "firebase/database";
import { database } from "./firebase";

export function writeUserData(userId, category, amount, type, date, description) {
  
  if (!userId) {
    console.error("DEBUG: Brak userId");
    alert("Błąd: Nie jesteś zalogowany lub brak ID.");
    return;
  }

  const newExpenseRef = push(ref(database, 'users/' + userId + '/expenses')); 
  set(newExpenseRef, { 
    category, amount, type, date, description
  })
  .then(() => console.log("Zapisano pomyślnie!"))
  .catch((error) => {
    console.error("Błąd zapisu:", error);
    alert("Błąd zapisu danych: " + error.message + "\nSprawdź reguły Firebase!");
  });
}

export function updateUserData(userId, transactionId, { category, amount, type, date, description }) {
  const updates = {};
  updates['users/' + userId + '/expenses/' + transactionId] = { category, amount, type, date, description };

  update(ref(database), updates)
    .then(() => console.log("Zaktualizowano pomyślnie!"))
    .catch((error) => {
      console.error("Błąd aktualizacji:", error);
      alert("Nie udało się zaktualizować transakcji.");
    });
}

export function removeUserData(userId, transactionId) {
  return remove(ref(database, 'users/' + userId + '/expenses/' + transactionId))
    .then(() => console.log("Usunięto pomyślnie!"))
    .catch((error) => {
      console.error("Błąd usuwania:", error);
      alert("Nie udało się usunąć transakcji.");
    });
}
