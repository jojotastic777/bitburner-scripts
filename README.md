# jojotastic777's Bitburner Scripts
Scripts for the game Bitburner. Play Bitburner here: https://danielyxie.github.io/bitburner/

Of particular note is the WebSocket-based script updater.

To use the scripts in this repository:
1. Clone the respository.
2. Run `make setup-env`.
3. Run `make serve-updates`.
4. Download [this script](https://gist.github.com/jojotastic777/bb86fd11b0ae60eaa0dcf99a0f0cfd5f/raw/6f0e4861c919d5c8ca0f4f8b45152bc130297dda/bitburner-bootstrap.js) to the file `/bin/util/bootstrap.js` in Bitburner.

After you've done these steps, the updater service should automatically download the rest of the scripts from `dist/bitburner`.

I recommend using `make watch` to update the contents of `dist/` whenever you change something in `src/`.
