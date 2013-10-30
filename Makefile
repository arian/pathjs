
browser-test:
	./node_modules/.bin/wrup -r ./tests/browser/history -o tests/browser/history-wrup.js
	./node_modules/.bin/wrup -r ./tests/browser/pathjs -o tests/browser/pathjs-wrup.js
