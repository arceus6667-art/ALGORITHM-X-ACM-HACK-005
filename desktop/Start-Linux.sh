#!/bin/sh
cd "$(dirname "$0")" || exit 1
command -v node >/dev/null 2>&1 || { echo 'Install Node.js 24 or newer from https://nodejs.org'; exit 1; }
exec node launch.mjs
