#!/bin/sh

set -e

yarn
(cd db && node initializeDatabase.js)
nodemon --inspect=0.0.0.0 index.js