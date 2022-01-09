build:
	tsc

watch:
	tsc --watch

serve-updates: build
	node dist/external/wsUpdate/wsUpdateServer.js

clean:
	rm -rf ./dist/*

setup-env:
	yarn install --dev
	curl https://github.com/danielyxie/bitburner/raw/dev/src/ScriptEditor/NetscriptDefinitions.d.ts -o NetscriptDefinitions.d.ts