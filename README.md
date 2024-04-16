# Let's Create A Story

## Overview

This is a decentralized application (dApp) that allows users to collaboratively create a story. Users can submit inspirational snippets of text, and an AI will generate a complete story using those inputs. The generated story is then saved to the blockchain, along with an accompanying illustration created by the AI.

## Features

- **Collective Storytelling**: Users can submit inspirational text snippets that are used to generate a complete story.
- **AI-Generated Story**: The submitted inspirations are used by an AI to generate a full story, complete with multiple chapters.
- **AI-Generated Illustration**: An AI-generated illustration is created to accompany the story.
- **Blockchain-Backed**: The inspirations are all stored on the blockchain, creating a permanent and immutable record.
- **Timeline**: The user can view the timeline of how to story has evolved, and see each users contribution to the story.
- **Responsive Design**: The dApp is built using responsive design principles, ensuring a great user experience across devices.

## Built With

This project was built using the [Scaffold-ETH 2](https://docs.scaffoldeth.io/) framework, which provides a modern, up-to-date toolkit for building decentralized applications on the Ethereum blockchain. The key technologies and components used include:

- **NextJS**: A React framework for building server-rendered applications.
- **RainbowKit**: A popular wallet connection library for Ethereum dApps.
- **Hardhat**: A development environment for Ethereum-based projects.
- **Wagmi**: A collection of React Hooks for interacting with Ethereum.
- **Viem**: A modern, TypeScript-first Ethereum client.
- **Typescript**: A statically typed superset of JavaScript, providing better tooling and type safety.

## Getting Started

To get started with this project, follow these steps:

1. **Prerequisites**:

   - [Node.js](https://nodejs.org/en/download/) (version 18.17 or higher)
   - [Yarn](https://classic.yarnpkg.com/en/docs/install/) (version 1 or 2+)
   - [Git](https://git-scm.com/downloads)

2. **Clone the repository**:
   ```bash
   git clone https://github.com/perstarkse/lets-create-a-story.git
   ```
3. **Install dependencies**:
   ```bash
   cd collaborative-story-generator
   yarn install
   ```
4. **Start the local development environment**:
   ```bash
   yarn chain # Start a local Ethereum network
   yarn deploy # Deploy the smart contract
   yarn start # Start the NextJS application
   ```
5. **Open the application**:

   Visit http://localhost:3000 in your web browser to access the dApp.
