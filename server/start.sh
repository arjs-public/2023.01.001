#!/usr/bin/env zsh
node -v
./node_modules/.bin/json-server -v
./node_modules/.bin/json-server --host 0.0.0.0 --port 8888 --snapshots ./data/ ./data/game.json
