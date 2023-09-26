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

# Lista delle cose da fare - Obbligatorie
- [x] Speicifca swagger
- [x] Costruiamo il DB(?)
- [x] Autenticazione
- [ ] [USR] Realizzare interfaccia
- [ ] [SMM] Realizzare interfaccia
- [ ] [MOD] Realizzare interfaccia
- [ ] [ALL] Gestione quota (mensile/settimanale/annuale) *Per i messaggi pubbllici (CANALI E PUBBLICI)*
- [ ] [ALL] Squeal Testuali - Interfaccia e implementazione back-end
- [ ] [ALL] Squeal con immagini - Interfaccia e implementazione back-end
- [ ] [ALL] Squeal con posizioni - Interfaccia e implementazione back-end
- [ ] [BACK-END] Parametrizzare la quota di caratteri giornalieri D, la quota di caratteri settimanali W e la quota mensile M ricordando che deve valere: W < 7 * D e anche che M < W * 4.
- [ ] [MOD][BACK-END] Realizzare la modifica dei parametri D, W ed M di cui sopra. La modifica deve essere consentita ai moderratori in quanto deve essere fatta "velocemente".
- [ ] [USR][SMM] La quota deve essere sempre visibile, mostrata ed aggiornata mentre si scrive
- [ ] [USR][SMM][BACK-END] I messaggi privati non tengono conto della quota
- [ ] [ALL] Realizzare il sistema che permette di comprare la quota (non so se si può simulare)
- [ ] [BACK-END] Realizzare il cambiamento della quota a causa della reazione degli utenti.
- [ ] CONTINUARE QUESTA LISTA

# Lista delle cose da fare - Consigliate dalla specifica o idee
- [ ] [EXTRA][MOD][BACK-END] Sia il parametro F (anch'essi modificabile rapidamente da un MOD) tale che consente di scrivere F caratteri extra per concludere il messaggio in corso. Se all'inizio la quota è 0 non deve far scrivere il messaggio. La quota viene "scontata" nel periodo successivo a quella (o quelle) sulle quali si verifica un eccesso.
- 



## Istruzioni: Avviare il sito sulle macchine di laboratorio
Il sito web si trova nella directory `/home/web/site222317/` in questa directory ci sono varie directory e file di cui a noi non importa (al momento). Il vero sito si trova sotto la directory `html`.
Per avviare il sito occorre essere collegati ad una macchina di laboratorio, dopodichè occorre collegarsi alla macchina che ospita i Docker che si trova all'indirizzo `gocker.cs.unibo.it`.
Per collegarcisi si esegua `ssh <nome.cognome>@gocker.cs.unibo.it` e si inserisca la propria password. Tale operazione deve essere fatta da una macchina di laboratorio (altrimenti la connessione ssh non trasmette dati e i vostri terminali rimangono "appesi").
Una volta collegati alla macchina gocker si esegua `start node-20 site222317 index.js` per avviare il tutto, dopo potete anche uscire dal gocker.
Collegati al Gocker per riavviare il sito eseguire `restart site222317`

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

### MONGODB CREDENZIALI
Mongodb username: site222317 - Mongodb password: tagira5A
You can connect your mongodb from your site web using hostname mongo_site222317

## Dubbi
1. Ha senso mantenere il Back-end in `app`?