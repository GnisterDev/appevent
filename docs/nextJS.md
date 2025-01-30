# Grunnleggende om Next.js

`Next.js` er et rammeverk for React som gjør det enklere å bygge raske og skalerbare webapplikasjoner. Hvis du vil ha en videoversjon av mye som blir nevnt her er [denne videoen](https://www.youtube.com/watch?v=__mSgDEOyv8) fin å se på.

**Jeg anbefaler også sterkt å se på [dokumentasjonen for Next.js](https://nextjs.org/docs), spesielt [getting started seksjonen](https://nextjs.org/docs/app/getting-started), minus installasjon.** Det vil gi deg et godt overblikk.

## Grunnfiler

Nedenfor ser du oversikten over filene i **root** mappen. Altså filene som ikke ligger i noen mapper. Ikke alle filene er laget eller kommer til å bli laget. Vi for se på hvordan prosjektet utvikler seg om vi trenger dem.

| **File**         | **Beskrivelse**                      |
| ---------------- | ------------------------------------ |
| next.config.js   | Konfigurasjonsfil for Next.js        |
| package.json     | Avhengigheter for prosjektet (Node)  |
| .env             | Environment variabler                |
| .env.local       | Lokale environment variabler         |
| .env.production  | Production environment variabler     |
| .env.development | Development environment variabler    |
| .eslintrc.json   | Konfigurasjonsfil for ESLint         |
| .gitignore       | Git filer and mapper som ignoreres   |
| next-env.d.ts    | TypeScript erklæringsfil for Next.js |
| tsconfig.json    | Konfigurasjonsfil for TypeScript     |

## Filstruktur

Under er et diagram over en teoretisk `Next.js` applikasjon. Filstrukturen er direkte lenket til hvilken `URL` filen har på nettsiden. For eksempel `about/page.tsx` vil ha lenken `example.com/about`.

`page.tsx` inne i `[id]`-mappen vil være dynamisk, noe som betyr at lenken til denne siden vil være `example.com/{id}`.

`()` indikerer en gruppe, og vil bli ignorert av **Routing**-systemet. Det betyr at den den mappen, men ikke mappene innad, vil bli ignorert i URL-en. Så filen `(group)/bruker/page.tsx` vil bli til `example.com/bruker`. `()` kan dermed brukes for å systematisere filstrukturen i prosjektet.

```
app/
 |-about/
 | |-page.tsx
 |
 |-[id]/
 | |-page.tsx
 |
 |-(group)/
   |-bruker/
     |-page.tsx

public/
 |-file.svg
```

### Andre filer

Det eksisterer også andre type filer enn `page.tsx`. Noen av de ble nevnt i videoen lenket over, men under ser du en oversikt.

| layout           | Layout                       |
| ---------------- | ---------------------------- |
| page.tsx         | Page                         |
| loading.tsx      | Loading UI                   |
| not-found.tsx    | Not found UI                 |
| error.tsx        | Error UI                     |
| global-error.tsx | Global error UI              |
| route.tsx        | API endpoint                 |
| template.tsx     | Re-rendered layout           |
| default.tsx      | Parallel route fallback page |

## CSS

`Next.js` bruker `CSS`-moduler. Disse moduelen omfanger `CSS` lokalt, noe lar deg bruke samme klasse i forskjellige filer uten å bekymre deg for kollisjoner.

`CSS`-moduler bruker filtypen `*.module.css`. Du importer den til en hvilken som helst komponent i appkatalogen. Et eksempel ser du nedenfor.

```
app/
 |-about/
   |-about.module.css
   |-page.tsx
```

**<span style="color:#166fb4">about.module.css:</span>**

```css
.about {
  padding: 24px;
}
```

**<span style="color:#e04b25">page.tsx:</span>**

```tsx
import styles from "./about.module.css";

export default function Page({ children }) {
  return <main className={styles.about}>{children}</main>;
}
```

Det eksisterer også det som heter `global css`. Det definerer de mest grunnlegende designvalgene i applikasjonen. Tenk fargeskjema, og design av universielle elementer som `header` og `footer`.

**[Tilbake til oversikt](./README.md)**
