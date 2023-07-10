# ProgettoWEB
Progetto tecnologie web 2022/2023

# Cose da fare
- HUGELY IMPORTANT: FILE DI CONFIGURAZIONE PER TUTTE LE FUNZIONALITA'
- Specifica Swagger | Romanellas
- API di servizi locali (Servizi di geolocalizzazione, fotocamera, ...) Altre cose per il mobile
- Quote (Gestione quota residua, gestione ricariche di quota, gestione saldo e storico quota, gestione delle ricariche) Il metodo deve essere comune sia alla quota giornaliera, settimanale e mensile.
- Reazioni (Come sono memorizzate, come sono gestite a livello backend e come influiscono sulle quote)


# Entità
Le entità sono strutture dati su cui sono definite le operazioni CRUD
- Utenti
- Canali
- Destinatari
- Reazioni
- Squeal (post)

NOTA: Successivamente per tutte le entità di cui sopra debbono essere tassativamente definite le API (uri) e anche una tabella che descriva i campi e i loro tipi

# Lista delle cose da fare
1. Speicifca swagger
2. Costruiamo il DB(?)
3. Autenticazione
4. .... Idee?


## Istruzioni: Avviare il sito sulle macchine di laboratorio
Il sito web si trova nella directory `/home/web/site222317/` in questa directory ci sono varie directory e file di cui a noi non importa (al momento). Il vero sito si trova sotto la directory `html`.
Per avviare il sito occorre essere collegati ad una macchina di laboratorio, dopodichè occorre collegarsi alla macchina che ospita i Docker che si trova all'indirizzo `gocker.cs.unibo.it`.
Per collegarcisi si esegua `ssh <nome.cognome>@gocker.cs.unibo.it` e si inserisca la propria password. Tale operazione deve essere fatta da una macchina di laboratorio (altrimenti la connessione ssh non trasmette dati e i vostri terminali rimangono "appesi").
Una volta collegati alla macchina gocker si esegua `start node-20 site222317 index.js` per avviare il tutto, dopo potete anche uscire dal gocker.

### Istruzioni: Avviare il sito autogenerato in gen/ in locale
Note: I passaggi di cui sotto necessitano di node installato (Fare riferimento alla propria distribuzione)
*L'INSTALLAZIONE DI NODE NON E' ELEMENTARE SE AVETE BISOGNO CHIEDETE.*
1. Spostarsi in `gen` facendo `cd gen/`
2. Lanciare `npm install` SOLO PER L'INSTALLAZIONE
3. Successivamente sempre in `gen` fare `npm start`

### Istruzioni: Avviare il sito nostro
Note: al momento il sito è sotto `app` perchè non ho capito se deve trovarsi sotto un'altra directory il backend o no, eventualmente si sposta.
Note (2): Anche qui avete bisogno di node
*L'INSTALLAZIONE DI NODE NON E' ELEMENTARE SE AVETE BISOGNO CHIEDETE.*
1. Spostarsi in `app` facendo `cd app/`
2. Lanciare `npm install` SOLO PER L'INSTALLAZIONE
3. Successivamente sempre in `gen` fare `npm start`

## Dubbi
1. Ha senso mantenere il Back-end in `app`?