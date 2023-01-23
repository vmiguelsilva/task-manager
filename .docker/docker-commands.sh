#!/bin/sh

npm install
npm run migrate:dev
npm run build
npm run start:prod