#!/usr/bin/env bash

npm run build
npm run build-source

typedoc --out ./docs/ ./src/ts --module commonjs
