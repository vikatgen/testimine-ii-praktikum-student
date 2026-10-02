# Testimine II praktikum

Praktikum õppevarale **M7. Tarkvarasüsteemide testimine: Testimine II** (Kuressaare Ametikool).

Rakendus: Rannamõisa Käsitöökeskuse töötubade registreerimine. Kõik nimed ja andmed on väljamõeldud. Nõuded on failis [spetsifikatsioon/nouded.md](spetsifikatsioon/nouded.md).

## Alustamine

1. Vajuta selle lehe nuppu **Use this template** ja vali **Create a new repository**.
2. Vali nähtavuseks **Private** (ära kopeeri kõiki harusid).
3. Lisa õpetaja oma repo kaastöötajaks (**Settings → Collaborators > vikatgen**).
4. Klooni oma repo ja käivita testid (Node.js 20 või uuem):

```bash
git clone <sinu repo aadress>
cd <sinu repo kaust>
npm install
npm test
```

**Päevik:** ava GitHubis oma repo vahekaardil **Issues** uus issue vormiga **Päevik**, kinnita see (**Pin issue**) ja lisa sinna iga kohtumise lõpus kommentaar. Sinna käivad ka testiplaan ja testiaruanne.

Alguses läbivad näited ning ülesanded (`it()`) kukuvad teatega "Test on kirjutamata".

```bash
npm test -- harjutused/kohtumine-03
npm test -- harjutused/kohtumine-03 -t "grupisoodus"
npm start
```

## Kaustad

- `spetsifikatsioon/`: nõuded ja API
- `src/`: rakendus
- `harjutused/`: testid, mida täidad
- `postman/`: Postmani kollektsioon ja keskkond
- `.github/ISSUE_TEMPLATE/`: päeviku, veaaruande, stsenaariumi ja küsimuse vormid GitHubi Issues jaoks
- `.github/workflows/`: testide automaatne käivitamine GitHub Actionsis
