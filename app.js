// Dati per il foglio Excel (ogni giorno del mese avrà un array di valori per ogni tipo di registrazione)
let data = {
  "iva22": {},
  "iva10": {},
  "aggioTab": {},
  "aggioGv": {},
  "lotto": {},
  "marcheBollo": {}
};

// Funzione per aprire il popup del calendario
function openCalendar(buttonId) {
  const popup = document.getElementById("calendar-popup");
  const dateInput = document.getElementById("date-picker");
  const amountInput = document.getElementById("amount");
  const saveButton = document.getElementById("save-btn");

  // Mostra il popup
  popup.style.display = "flex";

  // Aggiungi l'evento di salvataggio
  saveButton.onclick = function() {
    const dateValue = dateInput.value;
    const amountValue = parseFloat(amountInput.value);
    if (!dateValue || isNaN(amountValue) || amountValue <= 0) {
      alert("Inserisci una data valida e un importo positivo.");
      return;
    }

    const dayMonth = getDayMonth(dateValue);

    // Salva il dato nella colonna corretta
    const columnName = getColumnName(buttonId);
    if (!data[columnName]) {
      data[columnName] = {};
    }

    // Aggiungi l'importo per quel giorno
    data[columnName][dayMonth] = amountValue;

    // Chiudi il popup e resettare i campi
    closeCalendar();
    alert("Dati salvati!");
  };
}

// Funzione per chiudere il popup del calendario
function closeCalendar() {
  const popup = document.getElementById("calendar-popup");
  popup.style.display = "none";
}

// Funzione per ottenere il giorno e mese in formato gg/mm
function getDayMonth(date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');  // Aggiungi lo zero davanti se il giorno è un numero a una cifra
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');  // Aggiungi lo zero davanti se il mese è un numero a una cifra
  return `${day}/${month}`;
}

// Funzione per ottenere il nome della colonna in base al pulsante premuto
function getColumnName(buttonId) {
  switch (buttonId) {
    case "iva22": return "iva22";
    case "iva10": return "iva10";
    case "aggio-tab": return "aggioTab";
    case "aggio-gv": return "aggioGv";
    case "lotto": return "lotto";
    case "marche-bollo": return "marcheBollo";
    default: return "";
  }
}

// Funzione per scaricare il file Excel
function downloadExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(convertDataToSheetFormat());
  XLSX.utils.book_append_sheet(wb, ws, "Registrazione");
  XLSX.writeFile(wb, "registrazione_dati.xlsx");
}

// Funzione per convertire i dati in un formato adatto per il foglio Excel
function convertDataToSheetFormat() {
  let sheetData = [];

  // Recupera tutti i giorni unici presenti nei dati
  const allDays = getAllDays();

  // Per ogni giorno, crea una riga per il foglio Excel
  allDays.forEach(day => {
    let row = { "Data": day };

    // Aggiungi i valori per ogni tipo di registrazione
    ["iva22", "iva10", "aggioTab", "aggioGv", "lotto", "marcheBollo"].forEach(column => {
      row[column] = data[column][day] || "";
    });

    sheetData.push(row);
  });

  return sheetData;
}

// Funzione per ottenere tutti i giorni unici da usare nelle righe dell'Excel
function getAllDays() {
  const daysSet = new Set();

  // Aggiungi tutti i giorni unici da ogni tipo di registrazione
  Object.values(data).forEach(column => {
    Object.keys(column).forEach(day => {
      daysSet.add(day);
    });
  });

  return [...daysSet].sort();  // Ordina i giorni in ordine crescente
}

// Funzione per cancellare tutti i dati
function deleteAllData() {
  if (confirm("Sei sicuro di voler cancellare tutti i dati?")) {
    data = {
      "iva22": {},
      "iva10": {},
      "aggioTab": {},
      "aggioGv": {},
      "lotto": {},
      "marcheBollo": {}
    };
    alert("Tutti i dati sono stati cancellati!");
  }
}

// Aggiungi gli eventi ai pulsanti
document.getElementById("iva22").onclick = function() {
  openCalendar("iva22");
};
document.getElementById("iva10").onclick = function() {
  openCalendar("iva10");
};
document.getElementById("aggio-tab").onclick = function() {
  openCalendar("aggio-tab");
};
document.getElementById("aggio-gv").onclick = function() {
  openCalendar("aggio-gv");
};
document.getElementById("lotto").onclick = function() {
  openCalendar("lotto");
};
document.getElementById("marche-bollo").onclick = function() {
  openCalendar("marche-bollo");
};
// Verifica se il browser supporta il service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registrato con successo: ', registration);
    }).catch(error => {
      console.log('Errore nella registrazione del ServiceWorker: ', error);
    });
  });
}


document.getElementById("delete-btn").onclick = deleteAllData;
document.getElementById("download-excel").onclick = downloadExcel;
document.getElementById("close-calendar").onclick = closeCalendar;
