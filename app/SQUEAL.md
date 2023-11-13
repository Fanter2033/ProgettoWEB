# Squeal

## Limiti
Un numero massimo di
caratteri nel singolo messaggio, c'è un numero massimo di
caratteri al giorno, alla settimana e al mese per i messaggi
pubblici.  
Un utente può esaurire questa quota in un unico messaggio
lungo, pochi messaggi di media lunghezza o tanti messaggi brevi

## Destinatari
I messaggi possono essere indirizzati:
- ad un singolo utente **(@individuo)**
- un canale **(§canale)**
- a tutti, canali pubblici **(§CANALE)**
- "canali" estemporanei creati in qualunque momento e
accessibili da chiunque senza permessi o limitazioni. **(#keyword)**


## Contenuti
Ogni messaggio ha un **corpo** e un elenco di **destinatari** sotto il
controllo dell'autore, e una serie di **metadati** generati
automaticamente o manualmente dal moderatore Squealer.

- Il corpo è un messaggio di **testo**, OPPURE un'**immagine** OPPURE un
video, oppure una **geolocazione** *(Il rapporto tra immagini e testo è che
"un'immagine vale mille parole" Per noi mille bit, cioè 125
caratteri. Una geolocazione viene mostrata come una mappa e
conta come un'immagine.)*.
- I **destinatari** sono un elenco di indirizzi di *individui*, *canali* o *keyword*,
senza limiti e senza impatto sulla quota.
- **Data** ed **ora** del messaggio non modificabili
- **#reazioni positive** (divise per sottotipo)
- **#reazioni negative** (divise per sottotipo)
- **Categoria** (privato, pubblico, popolare, impopolare, controverso)
- **Canali Squealer** a cui è stato aggiunto dalla redazione


## Reazioni

Di ogni messaggio si contano le **impression X** (il numero di utenti, registrati o
meno, che l'hanno visualizzato). Si escludono i destinatari individuali.  
Ogni utente, registrato o meno, può reagire ad un messaggio in maniera **positiva**
o **negativa **con appositi emoji (scelti dal gruppo, ad es. “Concordo”, “Mi piace”,
"sono contrario", "mi disgusta", ecc.)
### Massa Critica (CM)
Esiste **una massa critica (CM)** di reazioni positive e negative. Le reazioni
polarizzate (R+ e R-) vengono contate **separatamente**, non si annullano mai. Il
valore della massa critica è **uguale** sia per R+ che R-. *Proviamo con CM = 0.25 * X.*  
Ogni messaggio che supera la massa critica viene etichettato come: 
- **"popolare” (R+ > CM )**
- **"impopolare" (R- > CM)**
- **"controverso” (R+ > CM e R- > CM)**

### Variazioni della quota

- Un utente che posta messaggi sistematicamente **popolari** viene premiato con un
**aumento di quota**, 
- se **impopolari** riceve una **diminuzione** della quota fino a zero
(inclusa la quota acquistata)
- I messaggi **controversi** **non contano** per la variazione della quota, ma appaiono
nei **canali dedicati** (§CONTROVERSIAL)

*Esempio*:  
Ogni 10 messaggi con R+>CM vinco 1% della quota
iniziale, ogni 3 messaggi con R- > CM perdo 1% della quota iniziale.

## Messaggi Automatici

Esistono inoltre messaggi automatici o derivati da sorgenti esterne.  
Ogni gruppo deve implementare almeno **3** tipi di messaggi
generati automaticamente. Di questi, il tipo **"messaggi
temporizzati"** è obbligatorio, gli altri 2 a discrezione.

*Esempi:*  
Messaggi temporizzati, News, Immagini Causali, Forse non sapevi che..., 

## Georeferenziazione
I messaggi temporizzati possono essere usati per costruire dinamicamente mappe e mostrarle in una pagina dedicata.
- Ad esempio, assumiamo che ogni ambulanza, autobus, taxi, camion di corrieri
sia dotato di un proprio device con Squealer attivo
- Questo emette **ogni N minuti** uno squeal di geolocazione sulla propria posizione
- Questi squeal vengono raccolti in un **canale** e visualizzati come un **unico segnale**
su una mappa, disponibile per tutti gli iscritti a quel canale

*Esempi:*
Dov'è il mio TAXI?, Dov'è il mio bus?, Dove sto andando?, Caccia al tesoro



