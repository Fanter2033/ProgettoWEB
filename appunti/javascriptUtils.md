
# BROWSER OBJECT 

**window. ...**

### Proprietà
- window.innerHeight		Altezza della finestra in pixel
- window.innerWidth		Larghezza della finestra in pixel
- window.pageXOffset		Distanza di un documento dopo uno scorrimento orrizzontale
- window.pageYOffset		Distanza di un documento dopo uno scorrimento verticale
- window.screenX		Coordinata x del puntatore rispetto all'angolo superiore sinistro dello schermo
- window.screenY		Coordinata y del puntatore rispetto all'angolo superiore sinistro dello schermo
- window.location		Indirizzo URL corrente del'oggetto window
- window.document		Fa riferimento all'oggetto document usato per la pagina attualmente contenuta della finestra
- window.history		Fa riferimento all'oggetto history relativo alla pagine/finestra del browser, contiene i dettagli delle pagine precedenti
- window.screen			Fa riferimento all'oggetto screen

### Metodi
- window.alert()		Apre una finestra di dialogo per messaggi 
- window.open()			Apre una nuova finestra del browser con l'URL specificato come parametro 
- window.print()		Stampa il contenuto di una pagina web

<br>
# DOCUMENT OBJECT MODEL

**document. ...**

### Proprietà
- document.title		Titolo del documento corrente
- document.lastModified		Data dell'ultima modifica al documento
- document.URL			Strgina con URL documento
- document.domain		Dominio documento corrente

### Metodi
- document.write()				Scrive un testo sul documento

## Accedere agli elementi del DOM
- document.getElementById('id')			Restituisce l'elemento che corrisponde al valore dell'attributo id	
- document.querySelector('css selector')	Utilizza un selettore CSS e restituisce il primo elemento corrispondente
- document.querySelectorAll('css selector')	Restituisce l'elenco degli elementi (NodeList) che corrispondono a una selettore CSS specificato
- document.getElementsByClassName('class')	Restituisce tutti gli elementi che usano in determinato valore pe ril loro attributo class 
- document.getElementsByTagName('tag')		Restituisce tutti gli elementi che usano in determinato valore pe ril loro attributo <tag>

## Operare sugli elementi
- document.createTextNode()		Crea un nuovo nodo di testo
- document.createElement()		Crea un nuovo elemento HTML
- document.removeChild()                Remove an HTML element
- document.appendChild(element)         Add an HTML element
- document.replaceChild(new, old)       Replace an HTML element
- document.nodeValue

## Operare sugli attributi
### Metodi
- element.setAttribute(attribute, value)        Imposta il valore di un attributo 
- element.getAttribute()			Legge il valore di un attributo
- element.hasAttribute()			Controlla se il nodo ha l'attributo specificato
- element.removeAttribute()			Rimuove un attributo dal nodo dell'elemento

### Proprietà
- className					Ottiene e imposta il valore dell'attributo class
- id						Ottiene e imposta il valore dell'attributo id

## Attraversare il DOM
### Proprietà
- parentNode					Elemento contenitore dell'elemento corrente
- previuosSibling/nextSibling			Fratello successivo/precedente di un nodo (inteso come testo)
- previuosElementSibling/nextElementSibling	Fratello successivo/precedente di un nodo (inteso come elemento)
- firstChild/lastChild				Primo/Ultimo figlio dell'elemento corrente

## Accedere/aggiornare il contenuto di un elemento
### Proprietà
- nodeValue		Accede al testo dal nodo
- innerHTML		Legge/scrive testo e codice
- textContent		Legge/scrive solo il testo dell'elemento contenitore e dei suoi figli
- innerText		Legge/Scrive solo il testo del nodo corrente
- innerHtml 		Accede e modificare il contenuto di un elemento e dei suoi figli (più adatta per aggiornare interi frammenti)

<br>
# OGGETTI 

## String
#### Proprietà
- lenght
#### Metodi
- toUpperCase()			Pone la stringa in caratteri maiuscoli
- toLowerCase()			Ponw la stringa in caratteri minuscoli
- charAt()			Prende un indice come parametro e restituisce il carattere in quella posizione
- indexOf()			Restituisce l'indice della prima occorrenza di un carattere o una sequenza all'interno della stringa
- lastIndexOf()			Restituisce l'indice dell'ultima occorrenza di un carattere o una sequenza all'interno della stringa
- substring()			Restituisce i caratteri presenti fare due indici (primo char incluso e il char dell'ultimo indice non incluso)
- split()			Si specifica un carattere e suddivide la stringa ogni volta che questo viene trovato
- trim()			Elimina gli spazi all'inizio e alla fine di una stringa
- replace()			Trova un elemento e lo sostituisce con un altro


## Number
#### Metodi
- isNaN()			Controlla se il valore non è numero
- toFixed()			Arrotonda al numero specificato di cifre decimali (Number -> String)
- toPrecision()			Arrotonda al numero totlae di posizioni (Number -> String)
- toExponential()		Restituisce una stringa che rappresenta il numero in notazione esponenziale 


## Math

#### Proprietà
- Math.PI

#### Metodi
- Math.round()
- Math.sqrt()
- Math.ceil()
- Math.floor()
- Math.random()


## Date

#### Metodi
- getDate()/setDate()			Restituisce/imposta il giorno del mese (1-31)
- getDay()				Restituisce il giorno della settimana (0-6)
- getFullYear()/setFullYear()		Restituisce/imposta l'anno (4 cifre)
- getHours()/setHours()			Restituisce/imposta l'ora (0-23)
- getMilliseconds()/setMilliseconds()	Restituisce/imposta i millisecondi (0-999)
- getMinutes()/setMinutes()		Restituisce/imposta i minuti (0-59)
- getMonth()/setMonth()			Restitusice/imposta il mese (0-11)
- getSeconds()/setSeconds()		Restituisce/imposta i secondi (0-59)
- getTime()/setTime()			Numero di millisecondi dalle 00:00:00 UTC del 1 gennaio 1970, un numero negativo per il momento prec
- getTimezoneOffSet()			Restituisce il fuso in termini di offset in minuti rispetto all'ora locale
- toDateString()			Restituisce la data cime una stringa leggibile (Wed Apr 16 1975)
- toString()				Restituisce in una stringa la data specificata


<br>
# EVENTI

## GESTORI DI EVENTI TRADIZIONALI DEL DOM
elemento.on*evento* = nomeFunzione;


## LISTENER
elemento.addEventListner('*evento*', '*nomeFunzione*', true/false);

### CON PARAMETRI
elemento.addEventListener('*evento*', function() {
	nomeFunzione();
	}
,false);

### UI
- load
- unload
- error
- resizie
- scroll

### TASTIERA
- keydown
- keyup
- keypress 

### MOUSE
- click
- dbclick
- mouseup
- mousedown
- mousemove
- mouseover
- mouseout


### FOCUS
- focus
- blur

### PER MODULI
- input

