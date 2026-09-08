# Solstice

## Project shape

- This is a dependency-free, browser-only HTML5 canvas game and stage editor.
- `game.html` is the playable entry point; `editor.html` is the stage editor.
- JavaScript uses classic global scripts, not modules. Preserve the script order in each HTML file when adding or moving dependencies.
- `js/main.js` owns game initialization, resource loading, state transitions, the animation loop, fullscreen handling, and the fixed 1330 x 1080 game canvas.
- `js/stage.js`, `js/gameObject.js`, `js/stages.js`, and `js/macroStages.js` contain the world model, gameplay objects, stage graph, and stage geometry. Keep those responsibilities separate.
- Assets are loaded through relative paths: `sprites/`, `tiles/`, `audio/`, and `font/`.

## Development workflow

- There is no package manager, build system, or automated test suite.
- Serve the repository over HTTP because asset loading depends on relative URLs:

  ```bash
  python3 -m http.server 8000
  ```

- Open `http://localhost:8000/game.html` for the game or `http://localhost:8000/editor.html` for the editor.
- For JavaScript syntax validation, run:

  ```bash
  for f in js/*.js; do node --check "$f" || exit 1; done
  ```

- Validate behavior in a browser: resource loading and console errors, game startup with Enter, movement and stage transitions, audio, fullscreen with `P` and Escape, and editor open/edit/export flows.
- Browser APIs and user gesture rules matter: code depends on `window`, `document`, canvas, `Image`, `Audio`, keyboard events, and animation frames. Autoplay may block audio until interaction.

## Editing conventions

- Preserve the existing ES5-style globals and public names unless a change explicitly includes a migration.
- Treat files ending in `~` as historical backups, not source files to update or use as references.
- Keep asset names and relative paths consistent with the registries in `js/sprite.js`, `js/tile.js`, and `js/audio.js`.
- Avoid unrelated formatting or refactoring. After changes, run the syntax check and manually exercise the affected page in a browser.
- The editor exports JavaScript stage constructors; verify generated output before adding it to `js/stages.js` or related stage data.
