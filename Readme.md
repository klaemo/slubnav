## Komplexpraktikum InfoVis - Virtueller Rundgang
[![Build Status](https://travis-ci.org/klaemo/slubnav.svg)](https://img.shields.io/travis/klaemo/slubnav.svg?style=flat)
[![Dependency Status](https://david-dm.org/klaemo/slubnav.svg?theme=shields.io&style=flat)](https://david-dm.org/klaemo/slubnav)
[![devDependency Status](https://david-dm.org/klaemo/slubnav/dev-status.svg?theme=shields.io&style=flat)](https://david-dm.org/klaemo/slubnav#info=devDependencies)

Live: [slub.klaemo.me](http://slub.klaemo.me) (work in progress)

## Installation
Ladet euch [node.js](http://nodejs.org) herunter und installiert es.
Dann habt ihr auf der Kommandozeile das `node` Kommando.

Probiert ob es funktioniert:
```bash
node --version
v0.10.35
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
- `test` - Tests
- `templates` - [jade](http://jadelang.com) HTML templates, die von den views/pages gerendert werden
- `views` - Einzelne UI Elemente
- `router.js` - Definiert die Routes (URLs) auf die unsere App anspricht
- `index.js` - Startpunkt

In `node_modules` liegen die mit `npm` installierten Module. Dieser Ordner wird automatisch verwaltet und ihr solltet dort nie manuell was verändern.

## Libraries/Tools

- [ampersand-*](http://ampersandjs.com)
- [Hammer.js](https://hammerjs.github.io/) (für touch input)
- [Myth](http://www.myth.io/) als CSS-Präprozessor
- [browserify](http://browserify.org/)
- [tape](https://www.npmjs.com/package/tape) für die Tests
- und andere kleinere, siehe `package.json`

**Kein jQuery**

Weitere findet ihr auf [tools.ampersandjs.com](http://tools.ampersandjs.com) und [npmjs.com](https://npmjs.com).

Diese müsst ihr mit `npm install --save paket-name` (kurz: `npm i -S paket-name`) installieren. Dabei wird auch gleich die entsprechende Information im `dependencies` Feld der `package.json` hinterlegt, so dass in Zukunft auch alle anderen diese Abhängigkeit einfach installieren können.

__Hinweis:__ Fügt jemand in einem commit eine neue Abhängigkeit hinzu, müssen die anderen nach dem nächsten `git pull` wieder `npm install` durchführen.

### Sublime Text 3 Plugins

Falls ihr Sublime Text 3 verwendet empfehle ich folgende Plugins:

- [SublimeLinter](http://sublimelinter.readthedocs.org/en/latest/installation.html) mit [jshint](https://github.com/SublimeLinter/SublimeLinter-jshint) und [jscs](https://github.com/SublimeLinter/SublimeLinter-jscs/)
- [Jade](https://packagecontrol.io/packages/Jade)

### Git Workflow

Als erstes solltet ihr schauen, dass ihr `git` [installiert](http://git-scm.com/downloads) habt und es anständig [konfiguriert](https://help.github.com/articles/set-up-git/) ist. Falls git euch regelmäßig nach eurem Github Passwort fragt, ist es hilfreich es im [Schlüsselbund zu speichern](https://help.github.com/articles/caching-your-github-password-in-git/).

Der von uns verwendete Workflow ist [hier](https://guides.github.com/introduction/flow/) ausführlich beschrieben. Im Prinzip gilt folgendes:

- Der `master` branch funktioniert immer und ist weitesgehend die live Version.
- Neue Ideen/Features werden in extra branches (`git checkout -b neuer-branch-name`) entwickelt.
- Diese Branches werden zu Github gepusht (`git push origin neuer-branch-name`) und können dort als Pull Requests diskutiert werden.
- Wenn die Arbeiten fertig und alle zufrieden sind, wird der branch zu `master` gemergt.

Beispiel:
```
$ git checkout -b mein-cooles-feature master
# tests + code schreiben
$ git add änderungen.js
$ git commit -m "Kurze Beschreibung was geändert wurde"
$ git push origin mein-cooles-feature
```

[Cheatsheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
[Github Emojis](http://www.emoji-cheat-sheet.com/)

## Contributors
- Fabian Gündel
- Leo Käßner
- Oliver Lenz
- Clemens Stolle