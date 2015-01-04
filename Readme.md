## Komplexpraktikum InfoVis - Virtueller Rundgang [![Build Status](https://travis-ci.org/klaemo/slubnav.svg)](https://travis-ci.org/klaemo/slubnav)
Live: [slub.klaemo.me](http://slub.klaemo.me) (work in progress)

## Installation
Ladet euch [node.js](http://nodejs.org) herunter und installiert es.
Dann habt ihr auf der Kommandozeile das `node` Kommando.

Probiert ob es funktioniert:
```bash
node --version
v0.10.33
```

Danach solltet ihr [npm](http://npmjs.org) auf den aktuellsten Stand bringen:
```bash
npm install -g npm
```

Mit npm werden wir unsere benötigen (javascript-) Pakete und Tools installieren. Es verwaltet Abhängigkeiten und Versionen für uns.

Um mit dem Entwickeln beginnen zu können müsste ihr dieses Repository klonen, die Abhängigkeiten
installieren und den development server starten.
Das geht folgendermaßen:

```
git clone https://github.com/klaemo/slubnav.git
npm install
npm start
```

Dann könnt ihr die App unter `http://localhost:3000` erreichen und weiterentwickeln. Änderungen werden
automatisch gebaut und im Browser aktualisiert (wenn ihr das [LiveReload](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) plugin installiert habt).

## Ordnerstruktur

- `models` - Datenmodelle (davon werde wir nicht viele brauchen)
- `pages` - "Seiten", alles was eine URL haben soll
- `public` - Fertig verpackte App die am Ende angezeigt und ausgeliefert wird (vom Buildschritt generiert)
- `styles` - CSS
- `templates` - [jade](http://jadelang.com) HTML templates, die von den views/pages gerendert werden
- `views` - Einzelne UI Elemente
- `router.js` - Definiert die Routes (URLs) auf die unsere App anspricht
- `index.js` - Startpunkt

In `node_modules` liegen die mit `npm` installierten Module. Dieser Ordner wird automatisch verwaltet
und ihr solltet dort nie manuell was verändern.

## Libraries/Tools

**Kein jQuery**

- [ampersand-*](http://ampersandjs.com)
- [Hammer.js](https://hammerjs.github.io/) (für touch input)
- [Myth](http://www.myth.io/) als CSS-Präprozessor
- [browserify](http://browserify.org/)
- [tape](https://www.npmjs.com/package/tape) für die Tests
- und andere kleinere

weitere findet ihr auf [tools.ampersandjs.com](http://tools.ampersandjs.com) und [npmjs.com](https://npmjs.com).

### Sublime Text 3 Plugins

Falls ihr Sublime Text 3 verwendet empfehle ich folgende Plugins:

- [SublimeLinter](http://sublimelinter.readthedocs.org/en/latest/installation.html) mit [jshint](https://github.com/SublimeLinter/SublimeLinter-jshint) und [jscs](https://github.com/SublimeLinter/SublimeLinter-jscs/)
- [Jade](https://packagecontrol.io/packages/Jade)

## Contributors
- Fabian Gündel
- Leo Käßner
- Oliver Lenz
- Clemens Stolle