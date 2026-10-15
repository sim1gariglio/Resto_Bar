# Gestione Cassa & Resto Bar

Un'applicazione web leggera, moderna e ottimizzata per dispositivi mobili pensata per baristi, esercenti e attività commerciali per velocizzare il calcolo del resto, gestire l'inventario del fondo cassa e tracciare le transazioni giornaliere.

---

## 🏗 Struttura dei File

Il progetto segue rigorosamente il principio *Single-File / Vanilla Stack*, senza la necessità di complessi framework o dipendenze esterne:

* **`index.html`**: Struttura principale dell'interfaccia utente basata su navigazione a tab (Pagina Dare Resto, Gestione Cassa e Storico).
* **`style.css`**: Fogli di stile personalizzati, responsive, con palette colori ispirate alle banconote BCE reali e alle monete euro, ottimizzati per l'utilizzo touch su smartphone.
* **`app.js`**: Logica applicativa, gestione dello stato tramite `localStorage`, calcoli matematici del resto (gestione centesimi in interi) e interattività dell'interfaccia.

---

## 📜 Cronologia delle Versioni

### 🚀 Versione 1.2 (Corrente)
* **Rimozione Tasto "Annulla Ultimo":** Semplificata ulteriormente l'interfaccia eliminando il pulsante di annullamento dell'ultima selezione per lasciare spazio unicamente al reset globale rapido.
* **Miglioramenti UI/UX:** Rafforzata la responsività del pannello di confronto e ottimizzati i feedback visivi (pulsanti di conferma con animazioni a scomparsa/comparsa condizionale).
* **Robustezza dello Storico:** Migliorata la persistenza delle transazioni con dettaglio dei pezzi ricevuti ed erogati per singolo scontrino.

### 🛠 Versione 1.1
* **Introduzione del Doppio Box di Confronto:** Aggiunto il pannello affiancato tra l'obiettivo del resto ("Da Dare") e la selezione attuale ("Hai Scelto").
* **Gestione Dinamica della Cassa:** Integrazione dei pulsanti `+` e `-` nella sezione cassa per permettere modifiche manuali rapide dell'inventario dei singoli tagli.
* **Storico Dettagliato:** Implementazione della lista transazioni espandibile con salvataggio automatico su `localStorage`.

### 🌱 Versione 1.0 (Rilascio Iniziale)
* **Funzionalità Core:** Calcolo basilare del resto basato sulle banconote e monete ricevute dal cliente.
* **Interfaccia Tattile:** Prime basi grafiche per la selezione rapida di tagli monetari e banconote.
* **Struttura Modulare Base:** Prima suddivisione logica in file HTML, CSS e JS puri.

---

## 🚀 Utilizzo Rapido
1. Clona o scarica i tre file (`index.html`, `style.css`, `app.js`) nella stessa cartella.
2. Apri `index.html` con qualsiasi browser moderno (consigliato l'uso su smartphone in modalità "Aggiungi a Home").
3. Inizia a calcolare i resti e a monitorare la tua cassa in tempo reale!