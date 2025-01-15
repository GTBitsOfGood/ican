#!/bin/bash
if [ ! -f "./.env.development.local" ]; then
  echo "Secrets not found. Pulling files from Bitwarden..."
  if [[ -z "${BW_PASSWORD}" ]]; then
    echo "Error: BW_PASSWORD envvar is not defined. Please inject BW_PASSWORD into container!"
    exit 1;
  fi

  npm install -g @bitwarden/cli fx
  # get secrets
  bw logout
  export BW_SESSION=$(bw login product@bitsofgood.org ${BW_PASSWORD} --raw);
  bw sync --session $BW_SESSION
  bw get item 1676370d-5f21-4a5a-9f1d-b266000cc319 | fx .notes > ".env.development.local"

  echo "Secrets successfully retrieved."
fi

npm run dev