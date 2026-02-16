# iCAN

## Overview

This project is a web-based application that gamifies medication adherence for children in clinical trials, with the goal of increasing adherence by creating a direct, engaging incentive for children. The envisioned app involves caring for a virtual pet whose health reflects the child's adherence to their medication regimen. This model for gamification is inspired by modern Tamagotchi applications in which reaching certain goals allows a user to care for a pet, plant, or other charismatic entity that reflects the user’s status in reaching personal goals.

## Tech Stack

- TypeScript
- Next.js
- MongoDB
- TailwindCSS

## Repo Walkthrough

Find a full explanation of this repo [here](https://www.notion.so/gtbitsofgood/Repo-Walkthrough-17bbd5d1ba158080a73cd8133042f06f?pvs=4).

## Onboarding

### MongoDB

Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. It may also be helpful to download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database.

### Dependencies

Make sure you have [Node.js 18](https://nodejs.org/en) installed. Check by running `node -v`. If your Node version is less than 18, either reinstall Node from the prior link or manage _multiple_ versions of Node with a tool like [nvm](https://github.com/nvm-sh/nvm).

In the root directory of the project, run:

```sh
npm install
```

This command should have installed all necessary dependencies for the app to run.

### Development

To start the Next.js dev server, run both of these commands at the same time:

```sh
npm run dev
```

```sh
docker compose up
```

### Code Formatting

Install and enable [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in VSCode. This repository is also configured with a pre-commit hook that automatically formats any code you commit to ensure formatting consistency throughout the codebase.
