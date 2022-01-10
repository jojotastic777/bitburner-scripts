build:
	npx tsc

gen-docs:
	npx typedoc --entryPointStrategy expand ./src

watch:
	tsc --watch

serve-updates: build
	node dist/external/wsUpdate/wsUpdateServer.js

clean:
	rm -rf ./dist/*

setup-env:
	yarn install --dev
	curl https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts -o @types/NetscriptDefinitions.d.ts