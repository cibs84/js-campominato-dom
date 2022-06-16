// Consegna
// L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
// con difficoltà 1 => tra 1 e 100
// con difficoltà 2 => tra 1 e 81
// con difficoltà 3 => tra 1 e 49
// Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe.
// I numeri nella lista delle bombe non possono essere duplicati.
// In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina, altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
// La partita termina quando il giocatore clicca su una bomba o raggiunge il numero massimo possibile di numeri consentiti.
// Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
// BONUS:
// 1- quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
// 2- quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste

// Seleziono il bottone di inizio del gioco
const btnPlay = document.getElementById('btn-play');


// Cliccando il bottone play invoco la funzione startGame()
btnPlay.addEventListener('click', startGame);


// - Seleziono la griglia
const mainGrid = document.getElementById('main-grid');
mainGrid.classList = 'hidden';

// Funzione invocata con il bottone play
function startGame() {
    // Resetto la griglia
    mainGrid.innerHTML = '';
    // - Seleziono il messaggio d'inizio
    const startMessage = document.getElementById('start-message');
    // - Nascondo il messaggio d'inizio aggiungendo la classe .hidden
    startMessage.classList.add('hidden');

    // Genero la griglia con il numero di celle impostato dal livello di difficoltà selezionato
    // - Visualizzo la griglia rimuovendo la classe .hidden
    mainGrid.classList.remove('hidden');

    // - Salvo in una variabile il livello di difficoltà scelto dall'utente
    let userLevel = document.querySelector('.difficulty-level select').value;
    console.log('userLevel: ', userLevel);
    let gameMaxRange;

    switch (userLevel) {
        case 'easy':
            gameMaxRange = 100;
            break;
        case 'medium':
            gameMaxRange = 81;
            break;
        case 'hard':
            gameMaxRange = 49;
            break;
    }

    // Creo le celle della griglia e richiamo una funzione al click
    for (let i = 1; i <= gameMaxRange; i++) {
        // - Creo elemento
        let newSquare = document.createElement('div');
        //  - Aggiungo le classi css
        newSquare.classList.add('square', userLevel);
        // - Inserisco i numeri nell'InnerHTML
        newSquare.innerHTML = i;
        // - Collego la funzione modClassSquares() al click
        newSquare.addEventListener('click', modClassSquares) ; 
        // - Appendo il nuovo elemento alla griglia
        mainGrid.append(newSquare);
    }


    // Invoco la funzione genRndNumbersArray() per generare un array senza doppioni con 16 numeri casuali (bombe) nel range di numeri del livello di difficoltà scelto: 1 - gameMaxRange -> Level_1: 1-100; Level_2: 1-81; Level_3: 1-49
    const bombsNumber = 16;
    const bombsGenerated = genRndNumbersArray(bombsNumber, 1, gameMaxRange);

    // DEBUG: Numeri Bomba
    console.log('Bombe generate: ', bombsGenerated);

    // Creo variabile con il numero max di tentativi = gameMaxRange - numero bombe generate (16)
    let maxAttempts = gameMaxRange - bombsNumber;

    // Creo la variabile per la stampa del messaggio di fine gioco
    const finalMessage = document.getElementById('final-message');

    // Creo la variabile dove inserisco lo stato del gioco -> è finito o continua?
    let isFinished = false;

    // Creo l'array in cui inserisco i tentativi fatti
    let allAttempts = [];

    // Seleziono tutte le celle della griglia 
    let allSquares = document.getElementsByClassName('square');

    
    // Funzione richiamata ad ogni click di cella
    function modClassSquares() {
        
        // - SE la cella cliccata corrisponde a una bomba -> finisce il gioco e comunico 'Hai perso' + 'punteggio (= tentativi senza aver calpestato una bomba)' + Tutti i numeri bomba diventano rossi
        if (bombsGenerated.includes(parseInt(this.innerHTML))) {
            for (let i = 0; i < allSquares.length; i++) {
                const thisSquare = allSquares[i];
                if (bombsGenerated.includes(parseInt(thisSquare.innerHTML))) {
                    thisSquare.classList.add('bomb');
                }
            }
        // Stampo il messaggio finale che il giocatore ha perso + il punteggio
        finalMessage.innerHTML = `Peccato, hai perso :-( Hai azzeccato ${allAttempts.length} tentativi. Gioca ancora...`;
        // - Rendo il messaggio finale visibile nell'html
        finalMessage.classList.remove('hidden');
        // - Il gioco è finito
        isFinished = true;
        // ALTRIMENTI SE la cella cliccata non è una bomba e non è tra quelle già cliccate -> pusho la cella nell'array di quelle già cliccate e gli aggiungo la classe .no-bomb per colorarla di blue
        } else if (!allAttempts.includes(parseInt(this.innerHTML))) {
            allAttempts.push(parseInt(this.innerHTML));
            this.classList.add('no-bomb');

            // SE è stato raggiunto il numero massimo di tentativi possibili -> Finisce il gioco con messaggio all'utente 'Hai vinto'
            if (allAttempts.length === maxAttempts) {
                // - Stampo il messaggio che il giocatore ha vinto
                finalMessage.innerHTML = `Hai vinto! Hai azzeccato ${allAttempts.length} tentativi. Gioca ancora...`;
                // - Rimuovo la classe .hidden per mostrare il messaggio finale
                finalMessage.classList.remove('hidden');
                // - Il gioco è finito
                isFinished = true;
            }
        }
        // SE il gioco è finito, rendo i numeri non più cliccabili
        if (isFinished) {
            for (var i = 0 ; i < allSquares.length; i++) {
                allSquares[i].style.pointerEvents = 'none'; 
            }
        }
    }
}


// -----------------------
// FUNCTIONS
// -----------------------


// Genera un array di un numero dato di elementi 'howManyNumbers' in cui ogni elemento è un numero random estratto da un range di numeri stabilito
// L'array che risulta non ha duplicati
// howManyNumbers -> quanti numeri generare
// minNumber -> il numero minimo del range da cui generare il numero casuale
// maxNumber -> il numero massimo del range da cui generare il numero casuale
// return: array con i numeri generati
function genRndNumbersArray(howManyNumbers, minNumber, maxNumber) {
    const randomNumbersArray = [];
    
    while (randomNumbersArray.length < howManyNumbers) {
        const rndNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) ) + minNumber;
    
        if (!randomNumbersArray.includes(rndNumber)) {
            randomNumbersArray.push(rndNumber);
        }
    }
    
    return randomNumbersArray;
}