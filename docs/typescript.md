# Grunnleggende om TypeScript

`TypeScript` er en utvidelse av `JavaScript` som legger til valgfri statisk typing og andre funksjoner som gjør det enklere å utvikle og vedlikeholde store applikasjoner.

## Hva er TypeScript?

TypeScript er et programmeringsspråk som bygger på JavaScript. **All** gyldig JavaScript-kode er også gyldig TypeScript-kode, men TypeScript legger til flere nyttige funksjoner:

- Statisk typing
- Støtte for moderne JavaScript-funksjoner
- Objektorienterte funksjoner som interfaces og generics

## Grunnleggende typing

For å vise forskjellen mellom JavaScript og TypeScript har jeg skrevet noen eksempler under. Mye av dette ligner veldig på `JAVA` men med noe vesentlige forskjeller.

### Types

```javascript
"JavaScript";

let navn = "Ole";
navn = 42; // Dette er lovlig i JavaScript
```

I JavaScript er dette lovlig. Selv om `navn` orginalt var av typen <span style="color:#4ec9b0">string</span> kan du helt lovlig sette `navn` til en <span style="color:#4ec9b0">number</span>.

```typescript
"TypeScript";

let navn: string = "Ole";
navn = 42; // Feil! Type 'number' kan ikke tilordnes type 'string'
```

I TypeScript er dette ikke lovlig og vi ville fått en _<span style="color:red">**ERROR**</span>_.

### Funksjoner

```javascript
"JavaScript";

function addere(a, b) {
  return a + b;
}

addere(1, 2);
```

```typescript
"TypeScript";

// Funksjoner med typing
function addere(a: number, b: number): number {
  return a + b;
}

addere(1, 2);
```

Over kan du se forksjellen på funksjoner i JavaScript og Typescript. Men hva skjer om funksjonen tar inn en <span style="color:#4ec9b0">string</span> og et <span style="color:#4ec9b0">nummer</span> i steden for to <span style="color:#4ec9b0">nummer</span>. Under ser du funsjonen <span style="color:yellow">mult</span> i JavaScript og TypeScript.

```javascript
"JavaScript";

function mult(a, b) {
  return a * b;
}

mult("10", 3); // Resultat: "101010"
// "10" blir ganget 3 ganger, så: "10"+"10"+"10" = "101010"
```

```typescript
"TypeScript";

// Funksjoner med typing
function mult(a: number, b: number): number {
  return a * b;
}

mult("10", 3); // Kompileringsfeil! Kan ikke sende string som number
```

Vi ser det at i JavaScript vil funksjonen godkjenne verdiene og sende ut et resultat vi ikke forventet. I TypeScript vil det komme en _<span style="color:red">**ERROR**</span>_.

### Lister

```javascript
"JavaScript";

let fruits = ["eple", "pære"];
fruits.push(42); // JavaScript tillater dette
```

```typescript
"TypeScript";

let fruits: string[] = ["eple", "pære"];
fruits.push(42); // Kompileringsfeil! Kan ikke legge til number i string array
```

### Objekter

```javascript
"JavaScript";

const person = {
  name: "Ole",
};
person.age = 30; // JavaScript tillater å legge til nye egenskaper
```

```typescript
"TypeScript";

interface Person {
  name: string;
  age?: number; // Markert som valgfri med ?
}
const person: Person = {
  name: "Ole",
};
person.address = "Oslo"; // Kompileringsfeil! address er ikke definert i interface
```

### Interface

En annen viktig forskjell er at vi kan bruke ting som `interface` i TypeScript. Det går **IKKE** i JavaScript. Merk spørsmålstegent (**?**) som markerer et valfritt felt.

```typescript
// Interface
interface Person {
  navn: string;
  alder: number;
  epost?: string; // Valgfritt felt (optional)
}

// Bruk av interface
const bruker: Person = {
  navn: "Kari",
  alder: 30,
};
```

### Klasser

Her er et eksempel på en klasse. Dette er noe vi mest sansynelig **IKKE** kommer til å bruke, siden [React](./react.md) kommer til å håndtere mye for oss.

```typescript
class Dyr {
  protected navn: string;

  constructor(navn: string) {
    this.navn = navn;
  }

  lagLyd(): void {
    console.log("Generisk dyrelyd");
  }
}

class Katt extends Dyr {
  private alder: number;

  constructor(navn: string, alder: number) {
    super(navn);
    this.alder = alder;
  }

  lagLyd(): void {
    console.log("Mjau!");
  }

  // Getter
  getNavn(): string {
    return this.navn;
  }
}
```

## Grunnleggende typer i TypeScrit

Under er en liste over grunnleggende typer i TypeScript. Hvis du kan Java vil du kanskje kjenne igjenn noen av dem.

```typescript
// Primitive typer
let tekst: string = "Hei";
let tall: number = 42;
let sannt: boolean = true;

// Array
let liste: number[] = [1, 2, 3];
let strenger: Array<string> = ["a", "b", "c"];

// Tuple
let tuple: [string, number] = ["hei", 10];

// Enum
enum Farge {
  Rød,
  Grønn,
  Blå,
}
let minFarge: Farge = Farge.Rød;

// any
let dynamisk: any = 4;
dynamisk = "tekst"; // Dette er lov, men ungå hvis mulig

// Union Types og Type Aliases
type ID = string | number; // "|" betyr eller. Her kan `ID` være enten en string eller et nummer
type Status = "aktiv" | "inaktiv" | "suspendert";

interface Bruker {
  id: ID;
  status: Status;
}
```

Det eksisterer **MANGE** andre typer og andre småting med TypeScript, men dette er det mest grunnleggende, og det du kommer til å bruke mest. Det er også eneste du trenger å vite til prosjektet. Hvis du vil, kan du lese deg opp på alt nevnt over, pluss ting som `Function Overloading`, `Async/Await med TypeScript`, `Utility Types` (**Partial**, **Pick**, **Readonly**), `Dekoratører (Decorators)`, `Mapped Types`, `Conditional Types`, og `Type Guards`. Mye av dette stammer fra Java. Igjenn, mest sansynlig trenger du **IKKE** å bruke noe av dette i prosjektet.

**[Tilbake til oversikt](./README.md)**
