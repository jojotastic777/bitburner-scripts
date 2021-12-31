# jojotastic777's Bitburner Scripts
Scripts for the game Bitburner. Play Bitburner here: https://danielyxie.github.io/bitburner/

Of particular note is the WebSocket-based script updater.

You'll need to complie the typescript yourself.

To use the scripts in this repository:
1. Clone the respository.
2. Run `yarn build`.
3. Copy the resulting `updateSvc.js` file from `dist/services/updateSvc.js` into the in-game file `/services/updateSvc.js`.
4. Start the update server with `yarn serve`.
5. Run the `/services/updateSvc.js` script in-game.

After you've done these steps, the updater should automatically copy the rest of the scripts in `dist/`. I recommend using `yarn watch` to update the contents of `dist/` whenever you change something in `src/`.
