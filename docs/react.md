# Grunnleggende om React

React er et JavaScript-bibliotek for å bygge brukergrensesnitt (UI). Denne siden er skrevet uten tanke på TypeScript. Det er for å formidle det grunnleggende med React. Alle eksemplene vil dermed være uten `types`.

**Jeg anbefaler sterkt å se på [dokumentasjonen for React](https://react.dev/reference/react), samt [learn seksjonen](https://react.dev/learn)**

## Komponenter

React-applikasjoner bygges opp av komponenter. En komponent er en isolert del av brukergrensesnittet som har sin egen logikk og visning. Tenk en `button` (knapp) eller eller `search` (søkefunksjon). En søkefunksjon er ikke avhengig av noe annent på siden, men har sin egen logikk som kan brukes på flere sider.

## Hooks

Hooks er funksjoner i React som lar deg "hekte deg på" React state og lifecycle features fra funksjonskomponenter. Du trenger ikke vite hva dette betyr, og trenger ikke vite alle hooks React har, men burde **skjønne** hvordan man bruker de to mest grunnleggende; `useState` og `useEffect`.

### useState

`useState` er en Hook som lar deg legge til React state til funksjonskomponenter.

```jsx
import { useState } from "react";
const [state, setState] = useState(initialVerdi);
```

I eksempelet over opretter vi en variable `state` og en **funksjon** `setState` som brukes for å endre `state` variabelen. Hvis f.eks initialVerdi er `0` og vi vil øke verdien med 1 når vi trykker på en knapp, skriver vi;

```html
<button onClick={() => setState(state + 1)}>Øk state med 1</button>
```

### useEffect

`useEffect` lar deg utføre sideeffekter i funksjonskomponenter. Sideeffekter kan være **Datahenting**, direkte **DOM-manipulasjon**, eller abonnering på eksterne tjenester. Under set du den generelle syntaxen for useEffect.

```jsx
useEffect(() => {
  // Kode som skal kjøres
}, [dependencies]);
```

Det er hovedsakelig tre måter useEffect brukes. Nedenfor ser du eksempler på alle tre.

#### Uten dependency array

Denne koden kjører for hver **rendering**. Det betyr hver gang noe (hva som helst) på siden endrer seg. Tenk deg at du har en knapp som øker et tall med 1 og viser hvor mange ganger du har trykket på knappen på nettsiden. Hver gang du klikker knappen vil tallet på siden endre seg, og siden på **rendre** på nytt. Dette er **IKKE** det samme som å oppdatere siden ved å trkke på f.eks `F5`. `useEffect` kjører hver gang siden må **rendre** noe på nytt.

```jsx
useEffect(() => {
  document.title = `Du har klikket ${count} ganger`;
});
```

Dette kan være problematisk. Tenk at vi har en side som teller hvor mange som har besøkt nettop den siden. Siden vil dermed ha et nummer **n** når du laster inn siden. Men når siden blir lastet inn, vil koden som øker besøksatallet med 1 kjøre. Hvis vi bruker `useEffect` som over, vil noe på siden ha oppdatere seg, noe som betyr at `useEffect` kjører. Det betyr igjenn at noe på siden oppdaterer seg, som gjør at `useEffect` kjører. Dette vil gå ut i uendligheten. Dermed bruker vi ofte `useEffect` med `dependencies` som vist under.

#### Med dependency array [count]

I dette eksempelet vil `useEffekt` bare kjøre når `dependencies` (her `count`) får en oppdatert verdi. Vi ungår dermed problemet som er beskrevet over. Listen med `dependencies` kan ha så mange elementer i seg som du ønsker.

```jsx
useEffect(() => {
  console.log("Count ble oppdatert til:", count);
}, [count]);
```

Denne måten brukes når effekten bare skal kjøre ved spesifikke endringer.

#### Med tom dependency array []

Denne koden kjører bare en gang ved montering. Det betyr når siden lastes inn for første gang. Hvis siden må **rendre** på nytt, vil den denne koden ikke kjøre igjenn. `return` funksjonen kjøres når **komponenten** den hører til blir fjernet. Et eksempel på en komponent kan du se i delseksjonen under.

```jsx
useEffect(() => {
  console.log("Komponenten ble montert");
  return () => {
    console.log("Komponenten ble fjernet");
  };
}, []);
```

### Oppsummering av hooks

Etter å ha gått igjennom eksemplene over kan du se om du forstår eksempelet under. Hvis du forstår det er du allerede godt på vei.

```jsx
import React, { useState, useEffect } from "react";

function ExampleComponent() {
  // useState eksempel
  const [count, setCount] = useState(0); // Med nummer
  const [name, setName] = useState(""); // Med string

  // useEffect eksempel 1 - kjører ved hver rendering (hver gang noe på siden endrer seg)
  useEffect(() => {
    document.title = `Du har klikket ${count} ganger`;
  });

  // useEffect eksempel 2 - kjører kun når count endres
  useEffect(() => {
    console.log("Count ble oppdatert til:", count);
  }, [count]);

  // useEffect eksempel 3 - cleanup (kjører kun én gang ved montering)
  useEffect(() => {
    console.log("Komponenten ble montert");

    // Cleanup funksjon
    return () => {
      console.log("Komponenten ble fjernet");
    };
  }, []);

  // Komponenten som denne funksjonen returnerer
  return (
    <div>
      <p>Du har klikket {count} ganger</p>
      <button onClick={() => setCount(count + 1)}>Øk telling</button>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Skriv navn"
      />
    </div>
  );
}

export default ExampleComponent;
```

## Grunnleggende React

### Funksjonskomponent

En grunnleggende funksjonskomponent i React.

```tsx
function Velkommen() {
  return (
    <div>
      <h1>Velkommen til min app!</h1>
    </div>
  );
}
```

### Komponent med props

Under ser du et eksempel på hvordan en tar inn variabler i React. Merk at for å bruke variabler som **tekst** i HTML brukes `{<variabel>}`.

```jsx
function Hilsen(props) {
  return <h1>Hei, {props.navn}!</h1>;
}
```

Dette er hvordan komponenten blir brukt i andre filer.

```tsx
import { Hilsen } from "./components/Hilsen.tsx";

function Hilsen(props) {
  return (
    <div>
      <Hilsen navn="Ole" />
    </div>
  );
}
```

### Komponent med state (useState hook)

Komponent med `useState`. `useState` forklarer i seksjonen over.

```jsx
import React, { useState } from "react";

function Teller() {
  const [antall, setAntall] = useState(0);

  return (
    <div>
      <p>Du har klikket {antall} ganger</p>
      <button onClick={() => setAntall(antall + 1)}>Klikk meg</button>
    </div>
  );
}
```

### Håndtere events

Syntaxen `const var = () => {}` er en annen, og ofte bedre måte å skrive funksjoner på i JavaScript.

```jsx
function KnappKomponent() {
  const handleKlikk = () => {
    alert("Knappen ble klikket!");
  };

  return <button onClick={handleKlikk}>Klikk her</button>;
}
```

### Betinget rendering

```jsx
function BetingetKomponent({ erInnlogget }) {
  if (erInnlogget) {
    return <h1>Velkommen tilbake!</h1>;
  } else {
    return <h1>Vennligst logg inn.</h1>;
  }
}
```

### Liste-rendering

```jsx
function ListeKomponent() {
  const elementer = ["Eple", "Pære", "Banan"];

  return (
    <ul>
      {elementer.map((element, index) => (
        <li key={index}>{element}</li>
      ))}
    </ul>
  );
}
```

### Enkel form-håndtering

Syntaxen `const var = e => {}` er en annen, og ofte bedre måte å skrive funksjoner på i JavaScript. Her kan en droppe `()` rundt `e` siden funksjonen bare tar inn én variabel.

```jsx
function SkjemaKomponent() {
  const [navn, setNavn] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Navnet som ble sendt inn: ${navn}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={navn} onChange={e => setNavn(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
```

### useEffect hook for sideeffekter

Syntaxen `bool ? con1 : con2` er det samme som en if/else blokk. `bool` er her en boolian. Hvis `bool` er **sann** vil `con1` bli returnert, hvis `bool` er **usann** vil `con2` bli returnert.

```jsx
import React, { useState, useEffect } from "react";

function DataHenter() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulerer en API-kall
    fetch("https://api.eksempel.no/data")
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Tom dependency array betyr at dette kjører kun ved mounting

  return <div>{data ? <div>{data}</div> : <div>Laster...</div>}</div>;
}
```

---

Hvis du forstår alt i dette dokumentet er du allerede langt på vei.

**[Tilbake til oversikt](./README.md)**
