const tuttiITagli = [
    {valore: 5000, nome: "50 €", tipo: "banconota", classe: "banconota b-50"},
    {valore: 2000, nome: "20 €", tipo: "banconota", classe: "banconota b-20"},
    {valore: 1000, nome: "10 €", tipo: "banconota", classe: "banconota b-10"},
    {valore: 500,  nome: "5 €",  tipo: "banconota", classe: "banconota b-5"},
    {valore: 200,  nome: "2 €",  tipo: "moneta",    classe: "moneta m-200"},
    {valore: 100,  nome: "1 €",  tipo: "moneta",    classe: "moneta m-100"},
    {valore: 50,   nome: "50 c", tipo: "moneta",    classe: "moneta m-50"},
    {valore: 20,   nome: "20 c", tipo: "moneta",    classe: "moneta m-20"},
    {valore: 10,   nome: "10 c", tipo: "moneta",    classe: "moneta m-10"},
    {valore: 5,    nome: "5 c",  tipo: "moneta",    classe: "moneta m-5"}
];

let cassaInventory = JSON.parse(localStorage.getItem('cassa_inventory')) || {};
tuttiITagli.forEach(t => { if(cassaInventory[t.valore] === undefined) cassaInventory[t.valore] = 10; });

let storicoTransazioni = JSON.parse(localStorage.getItem('cassa_storico')) || [];
let ricevutoCounts = {};
let restoSelezionatoMappa = {};
let restoTotaleCentesimi = 0;

tuttiITagli.forEach(t => ricevutoCounts[t.valore] = 0);
tuttiITagli.forEach(t => restoSelezionatoMappa[t.valore] = 0);

function cambiaPagina(pagina) {
    document.querySelectorAll('.pagina').forEach(p => p.classList.remove('attiva'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('attivo'));

    if (pagina === 'resto') {
        document.getElementById('pagResto').classList.add('attiva');
        document.querySelectorAll('.nav-btn')[0].classList.add('attivo');
    } else if (pagina === 'cassa') {
        document.getElementById('pagCassa').classList.add('attiva');
        document.querySelectorAll('.nav-btn')[1].classList.add('attivo');
        renderCassaGrid();
    } else if (pagina === 'storico') {
        document.getElementById('pagStorico').classList.add('attiva');
        document.querySelectorAll('.nav-btn')[2].classList.add('attivo');
        renderStorico();
    }
}

function mostraNotifica(messaggio, tipo = 'errore') {
    const banner = document.getElementById('notificationBanner');
    banner.innerText = messaggio;
    banner.style.backgroundColor = tipo === 'successo' ? '#27ae60' : '#e74c3c';
    banner.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { banner.style.display = 'none'; }, 3500);
}

function caricaCassaAggiornata() {
    return JSON.parse(localStorage.getItem('cassa_inventory')) || cassaInventory;
}

function salvaCassa() {
    localStorage.setItem('cassa_inventory', JSON.stringify(cassaInventory));
    renderCassaGrid();
}

function aggiungiAStorico(dettagli) {
    let ricevutiDettaglio = {};
    tuttiITagli.forEach(t => {
        if (dettagli.ricevutoCounts[t.valore] > 0) ricevutiDettaglio[t.nome] = dettagli.ricevutoCounts[t.valore];
    });

    let restoDettaglio = {};
    tuttiITagli.forEach(t => {
        if (dettagli.restoSelezionatoMappa[t.valore] > 0) restoDettaglio[t.nome] = dettagli.restoSelezionatoMappa[t.valore];
    });

    const transazione = {
        data: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        nome: dettagli.nome || 'Oggetto',
        prezzo: dettagli.prezzo,
        totaleRicevuto: dettagli.totaleRicevuto,
        totaleResto: dettagli.totaleResto,
        ricevutiDettaglio: ricevutiDettaglio,
        restoDettaglio: restoDettaglio
    };
    
    storicoTransazioni.unshift(transazione);
    if (storicoTransazioni.length > 30) storicoTransazioni.pop();
    
    localStorage.setItem('cassa_storico', JSON.stringify(storicoTransazioni));
}

function renderStorico() {
    const container = document.getElementById('containerStorico');
    if (storicoTransazioni.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-size: 13px;">Nessuna transazione registrata.</p>';
        return;
    }

    container.innerHTML = '';
    storicoTransazioni.forEach((t, index) => {
        let item = document.createElement('div');
        item.className = 'storico-item';

        let ricevutiStr = Object.entries(t.ricevutiDettaglio).map(([k, v]) => `${v}x ${k}`).join(', ');
        let restoStr = Object.keys(t.restoDettaglio).length > 0 
            ? Object.entries(t.restoDettaglio).map(([k, v]) => `${v}x ${k}`).join(', ') 
            : 'Nessun resto';

        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
                <span>🕒 <b>${t.data}</b> - <b>${t.nome}</b></span>
                <span>Prezzo: <b>${(t.prezzo/100).toFixed(2)}€</b></span>
            </div>
            <div class="storico-dettagli" id="dettaglio-${index}">
                📥 <b>Ricevuto (${(t.totaleRicevuto/100).toFixed(2)}€):</b> ${ricevutiStr}<br>
                📤 <b>Resto dato (${(t.totaleResto/100).toFixed(2)}€):</b> ${restoStr}
            </div>
        `;

        item.onclick = () => {
            let det = document.getElementById(`dettaglio-${index}`);
            det.style.display = det.style.display === 'block' ? 'none' : 'block';
        };

        container.appendChild(item);
    });
}

function pulisciStorico() {
    if (confirm("Vuoi cancellare lo storico delle transazioni?")) {
        storicoTransazioni = [];
        localStorage.removeItem('cassa_storico');
        renderStorico();
    }
}

function renderCassaGrid() {
    const container = document.getElementById('containerCassaGrid');
    container.innerHTML = '';
    cassaInventory = caricaCassaAggiornata();

    tuttiITagli.forEach(t => {
        let box = document.createElement('div');
        box.className = 'cassa-box';

        let el = document.createElement('div');
        el.className = t.classe;
        el.style.transform = "scale(0.85)";
        let qty = cassaInventory[t.valore];
        el.innerHTML = `${t.nome}<div class="badge" style="display:block;">${qty}</div>`;
        box.appendChild(el);

        let ctrl = document.createElement('div');
        ctrl.className = 'cassa-controls';
        
        let btnMeno = document.createElement('button');
        btnMeno.innerText = '-';
        btnMeno.onclick = () => {
            if (cassaInventory[t.valore] > 0) cassaInventory[t.valore]--;
            salvaCassa();
        };

        let btnPiu = document.createElement('button');
        btnPiu.innerText = '+';
        btnPiu.onclick = () => {
            cassaInventory[t.valore]++;
            salvaCassa();
        };

        ctrl.appendChild(btnMeno);
        ctrl.appendChild(btnPiu);
        box.appendChild(ctrl);

        container.appendChild(box);
    });
}

function renderBanconoteAlte() {
    const bContainer = document.getElementById('banconoteAlte');
    const mContainer = document.getElementById('moneteAlte');
    const containerRicevutiSelezionati = document.getElementById('containerRicevutiSelezionati');
    const boxClienteContainer = document.getElementById('boxClienteContainer');
    
    bContainer.innerHTML = '';
    mContainer.innerHTML = '';
    containerRicevutiSelezionati.innerHTML = '';

    let haElementiRicevuti = false;

    tuttiITagli.forEach(t => {
        let el = document.createElement('div');
        el.className = t.classe;
        let count = ricevutoCounts[t.valore];
        
        if (count > 0) el.classList.add('selezionata');

        el.innerHTML = `${t.nome}<div class="badge" id="badge-${t.valore}">${count}x</div>`;
        if (count > 0) el.querySelector(`#badge-${t.valore}`).style.display = 'block';

        el.onclick = () => aggiungiRicevuto(t.valore);

        if (t.tipo === 'banconota') bContainer.appendChild(el);
        else mContainer.appendChild(el);

        if (count > 0) {
            haElementiRicevuti = true;
            for (let i = 0; i < count; i++) {
                let cBox = document.createElement('div');
                cBox.className = 'consegnato-box';

                let cEl = document.createElement('div');
                cEl.className = t.classe;
                cEl.innerHTML = t.nome;
                cBox.appendChild(cEl);

                let btnRimuovi = document.createElement('button');
                btnRimuovi.className = 'btn-piccolo';
                btnRimuovi.style.marginTop = '4px';
                btnRimuovi.style.color = '#c0392b';
                btnRimuovi.innerText = 'Rimuovi';
                btnRimuovi.onclick = () => {
                    ricevutoCounts[t.valore]--;
                    renderBanconoteAlte();
                };
                cBox.appendChild(btnRimuovi);
                containerRicevutiSelezionati.appendChild(cBox);
            }
        }
    });

    boxClienteContainer.style.display = haElementiRicevuti ? 'block' : 'none';
    aggiornaTotaleRicevuto();
}

function aggiungiRicevuto(valore) {
    ricevutoCounts[valore]++;
    renderBanconoteAlte();
}

function resetSchermata() {
    tuttiITagli.forEach(t => ricevutoCounts[t.valore] = 0);
    tuttiITagli.forEach(t => restoSelezionatoMappa[t.valore] = 0);
    document.getElementById('nomeOggetto').value = '';
    document.getElementById('prezzo').value = '';
    document.getElementById('btnConferma').style.display = 'none';
    document.getElementById('cardUnificata').style.display = 'none';
    renderBanconoteAlte();
}

function aggiornaTotaleRicevuto() {
    let totale = 0;
    tuttiITagli.forEach(t => totale += t.valore * ricevutoCounts[t.valore]);
    document.getElementById('totaleRicevutoTxt').innerText = `Ricevuto: ${(totale / 100).toFixed(2)} €`;
}

function calcolaEImpostaResto() {
    let prezzoInput = document.getElementById('prezzo').value.replace(',', '.');
    let prezzoCentesimi = Math.round(parseFloat(prezzoInput) * 100);

    let totaleRicevutoCentesimi = 0;
    tuttiITagli.forEach(t => totaleRicevutoCentesimi += t.valore * ricevutoCounts[t.valore]);

    if (isNaN(prezzoCentesimi) || prezzoCentesimi <= 0) {
        mostraNotifica("⚠️ Inserisci un prezzo valido dell'oggetto!");
        return;
    }

    if (totaleRicevutoCentesimi === 0) {
        mostraNotifica("⚠️ Seleziona i soldi ricevuti dal cliente nella parte alta!");
        return;
    }

    restoTotaleCentesimi = totaleRicevutoCentesimi - prezzoCentesimi;

    if (restoTotaleCentesimi < 0) {
        mostraNotifica("⚠️ I soldi ricevuti sono inferiori al prezzo dell'oggetto!");
        return;
    }

    document.getElementById('cardUnificata').style.display = 'block';
    document.getElementById('cifraRestoGrandeTxt').innerText = `${(restoTotaleCentesimi / 100).toFixed(2)} €`;
    
    tuttiITagli.forEach(t => restoSelezionatoMappa[t.valore] = 0);

    if (restoTotaleCentesimi === 0) {
        document.getElementById('containerUnificato').innerHTML = '<div style="text-align:center; color:#27ae60; font-weight:bold; font-size:18px; padding: 15px;">✅ Importo esatto! Nessun resto da dare.</div>';
        document.getElementById('boxSceltaConfronto').classList.add('ok');
        document.getElementById('cifraSceltaTxt').innerText = "0.00 €";
        document.getElementById('boxConsegnatoContainer').style.display = 'none';
        document.getElementById('btnConferma').style.display = 'block';
    } else {
        eseguiCalcoloAutomaticoResto();
        renderInterfacciaResto();
    }
}

function eseguiCalcoloAutomaticoResto() {
    let restoCorrente = restoTotaleCentesimi;
    tuttiITagli.forEach(t => restoSelezionatoMappa[t.valore] = 0);
    let tagliOrdinati = [...tuttiITagli].sort((a, b) => b.valore - a.valore);

    for (let t of tagliOrdinati) {
        let necessarie = Math.floor(restoCorrente / t.valore);
        if (necessarie > 0) {
            restoSelezionatoMappa[t.valore] = necessarie;
            restoCorrente -= (necessarie * t.valore);
        }
    }
}

// Scomposizione al volo con gestione protetta del caso limite dei 5 centesimi
function scomponiTaglio(valoreDaScomporre) {
    if (restoSelezionatoMappa[valoreDaScomporre] > 0) {
        restoSelezionatoMappa[valoreDaScomporre]--; // Rimuove 1 pezzo grande

        // CASO LIMITE: I 5 centesimi sono il taglio minimo assoluto
        if (valoreDaScomporre === 5) {
            mostraNotifica("⚠️ I 5 centesimi sono il taglio più piccolo disponibile!");
            restoSelezionatoMappa[valoreDaScomporre]++; // Ripristina il pezzo
            return;
        }

        let valoreRimanente = valoreDaScomporre;
        let tagliOrdinati = [...tuttiITagli].sort((a, b) => b.valore - a.valore);

        for (let t of tagliOrdinati) {
            if (t.valore < valoreDaScomporre && valoreRimanente >= t.valore) {
                let quanti = Math.floor(valoreRimanente / t.valore);
                restoSelezionatoMappa[t.valore] += quanti;
                valoreRimanente %= t.valore;
                if (valoreRimanente === 0) break;
            }
        }
        
        if (valoreRimanente > 0) {
            restoSelezionatoMappa[valoreDaScomporre]++;
            mostraNotifica("⚠️ Impossibile scomporre ulteriormente questo taglio.");
        }

        renderInterfacciaResto();
    }
}

function renderInterfacciaResto() {
    const container = document.getElementById('containerUnificato');
    const containerConsegnati = document.getElementById('containerConsegnati');
    const boxConsegnatoContainer = document.getElementById('boxConsegnatoContainer');
    const boxSceltaConfronto = document.getElementById('boxSceltaConfronto');
    
    container.innerHTML = '';
    containerConsegnati.innerHTML = '';

    document.getElementById('cifraRestoGrandeTxt').innerText = `${(restoTotaleCentesimi / 100).toFixed(2)} €`;

    let totaleSelezionatoCentesimi = 0;
    let haElementiSelezionati = false;

    tuttiITagli.forEach(t => {
        let quantita = restoSelezionatoMappa[t.valore] || 0;
        let el = document.createElement('div');

        if (quantita > 0) {
            el.className = t.classe + ' attivo-resto';
            el.innerHTML = `${t.nome}<div class="badge">${quantita}x</div>`;
            totaleSelezionatoCentesimi += (t.valore * quantita);
        } else {
            el.className = t.classe + ' scolorita';
            el.innerHTML = t.nome;
        }
        container.appendChild(el);

        // Barra in basso dei pezzi singoli con tasto ✕ Cambia per scomporsi al volo
        if (quantita > 0) {
            haElementiSelezionati = true;
            for (let i = 0; i < quantita; i++) {
                let cBox = document.createElement('div');
                cBox.className = 'consegnato-box';

                let cEl = document.createElement('div');
                cEl.className = t.classe;
                cEl.innerHTML = t.nome;
                cBox.appendChild(cEl);

                let btnScomponi = document.createElement('button');
                btnScomponi.className = 'btn-piccolo';
                btnScomponi.style.marginTop = '4px';
                btnScomponi.style.color = '#c0392b';
                btnScomponi.innerText = '✕ Cambia';
                btnScomponi.onclick = () => scomponiTaglio(t.valore);
                cBox.appendChild(btnScomponi);

                containerConsegnati.appendChild(cBox);
            }
        }
    });

    document.getElementById('cifraSceltaTxt').innerText = `${(totaleSelezionatoCentesimi / 100).toFixed(2)} €`;
    boxConsegnatoContainer.style.display = haElementiSelezionati ? 'block' : 'none';

    let btnConferma = document.getElementById('btnConferma');

    if (totaleSelezionatoCentesimi === restoTotaleCentesimi && restoTotaleCentesimi > 0) {
        boxSceltaConfronto.classList.add('ok');
        btnConferma.style.display = 'block';
    } else {
        boxSceltaConfronto.classList.remove('ok');
        btnConferma.style.display = 'none';
    }
}

function confermaTransazione() {
    let prezzoInput = document.getElementById('prezzo').value.replace(',', '.');
    let prezzoCentesimi = Math.round(parseFloat(prezzoInput) * 100);
    let nomeOggettoInput = document.getElementById('nomeOggetto').value.trim();

    let totaleRicevutoCentesimi = 0;
    tuttiITagli.forEach(t => totaleRicevutoCentesimi += t.valore * ricevutoCounts[t.valore]);

    let totaleResto = totaleRicevutoCentesimi - prezzoCentesimi;

    cassaInventory = caricaCassaAggiornata();

    tuttiITagli.forEach(t => {
        cassaInventory[t.valore] += ricevutoCounts[t.valore];
    });

    tuttiITagli.forEach(t => {
        let dati = restoSelezionatoMappa[t.valore] || 0;
        cassaInventory[t.valore] = Math.max(0, cassaInventory[t.valore] - dati);
    });

    localStorage.setItem('cassa_inventory', JSON.stringify(cassaInventory));
    
    aggiungiAStorico({
        nome: nomeOggettoInput || 'Oggetto',
        prezzo: prezzoCentesimi,
        totaleRicevuto: totaleRicevutoCentesimi,
        totaleResto: Math.max(0, totaleResto),
        ricevutoCounts: {...ricevutoCounts},
        restoSelezionatoMappa: {...restoSelezionatoMappa}
    });

    mostraNotifica("✅ Transazione confermata! Cassa aggiornata.", 'successo');
    resetSchermata();
    cambiaPagina('resto');
}

renderBanconoteAlte();