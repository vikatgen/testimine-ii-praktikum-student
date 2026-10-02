# Rannamõisa Käsitöökeskus: töötubade registreerimise nõuded

Kõik nimed, hinnad ja reeglid on **väljamõeldud**. Käsitöökeskus (juhataja Anu) korraldab töötubasid (keraamika, kudumine, puutöö). Osalejad registreeruvad e-posti aadressiga ja toovad kaasa teisi osalejaid (pere, sõbrad). Hinnad on eurodes.

## Hind

| Nr | Nõue |
| --- | --- |
| NR-1 | Osaleja vanus on täisarv **7 kuni 120**. Muu vanuse korral on viga `INVALID_AGE`. |
| NR-2 | Osaleja hind on töötoa põhihind: vanuses 7–17 **50%**, vanuses 65 ja vanemad **80%** (20% soodus), kõik teised **100%**. |
| NR-3 | Ühes registreeringus on **1 kuni 20** osalejat. Muidu viga `INVALID_GROUP_SIZE`. |
| NR-4 | Grupisoodus kogusummast: **5–9** osalejat 10%, **10–20** osalejat 15%. |
| NR-5 | Keskuse liikmekaardiga registreeringule kehtib kogusummast **10%** soodus. |
| NR-6 | Grupi- ja liikmesoodus **ei summeeru**: kehtib see, mis on suurem. |
| NR-7 | Lõplik hind ümardatakse sentideni (2 kohta pärast koma). |

## Registreerimine

| Nr | Nõue |
| --- | --- |
| NR-8 | Registreerida saab ainult **avatud** töötuba. Teise oleku korral viga `WORKSHOP_NOT_OPEN`, olematu töötoa korral `WORKSHOP_NOT_FOUND`. E-post peab olema korrektne (`INVALID_EMAIL`). |
| NR-9 | Kui vabu kohti on vähem kui registreeritavaid osalejaid, on viga `WORKSHOP_FULL`. Osaliselt ei registreerita. Täpselt viimased kohad **mahuvad ära**. |
| NR-10 | Sama e-posti aadressiga ei saa samale töötoale kaks korda registreeruda (`ALREADY_REGISTERED`). Tähesuurus ei loe. |
| NR-11 | Edukal registreerimisel saadetakse kinnitus. Kui kinnituse saatmine ebaõnnestub, **registreering jääb kehtima** ja vastuses on `confirmationSent: false`. |

## Tühistamine ja tagasimakse

| Nr | Nõue |
| --- | --- |
| NR-12 | Tagasimakse tühistamisel: kui registreeringut pole makstud, on tagasimakse **0**. Kui korraldaja tühistab, saab maksja **100%**. Muul juhul: vähemalt **7** päeva enne algust 100%, **2–6** päeva enne 50%, vähem kui **2** päeva enne 0%. |

## Töötoa olekud

| Nr | Nõue |
| --- | --- |
| NR-13 | Töötoal on olek `draft`, `open`, `full` või `closed`. Lubatud üleminekud: `draft` →(avalda)→ `open`; `open` →(täis)→ `full`; `full` →(koht vabaneb)→ `open`; `draft`, `open` või `full` →(sulge)→ `closed`. `closed` on lõplik. Muu üleminek on viga `INVALID_TRANSITION`. Kui viimane koht täitub, muutub töötuba automaatselt `full`; kui koht vabaneb, naaseb `open`. |

## Töötoa loomine

| Nr | Nõue |
| --- | --- |
| NR-14 | Töötoal on pealkiri (`INVALID_TITLE`), mahutavus positiivne täisarv (`INVALID_CAPACITY`), põhihind positiivne arv (`INVALID_PRICE`) ja ISO algusaeg (`INVALID_DATE`). Uus töötuba on olekus `draft`. Töötoa vastuses on `availableSpots` (kohti vabaks). |

## HTTP API

Vigade vorm on alati `{ "error": { "code": "...", "message": "..." } }`. `message` tekst ei ole stabiilne leping.

| Meetod ja tee | Kirjeldus | Edu | Vead |
| --- | --- | --- | --- |
| `GET /health` | Töötab? | 200 | |
| `POST /workshops` | Loo töötuba (`title`, `capacity`, `basePrice`, `startsAt`) | 201 | 400 `INVALID_*` |
| `GET /workshops` | Kõik töötoad | 200 | |
| `GET /workshops/:id` | Üks töötuba | 200 | 400 `INVALID_ID`, 404 `WORKSHOP_NOT_FOUND` |
| `POST /workshops/:id/publish` | Ava registreerimine (`draft` → `open`) | 200 | 404, 409 `INVALID_TRANSITION` |
| `POST /workshops/:id/registrations` | Registreeri (`email`, `ages`, `member`) | 201 | 400, 404, 409 |
| `GET /registrations/:id` | Üks registreering | 200 | 400, 404 `REGISTRATION_NOT_FOUND` |
| `POST /registrations/:id/pay` | Märgi makstuks | 200 | 404 |
| `DELETE /registrations/:id` | Tühista, vastuses `refund`. Korraldaja tühistus: `?cancelledBy=organizer` | 200 | 404 |
| `GET /reports/summary` | Kokkuvõte (töötubasid, registreeringuid, tulu). Aeglane | 200 | |

ID-d on positiivsed täisarvud. Vigane ID (`0`, `-1`, `abc`, `1.5`) annab 400 `INVALID_ID`.
