# HISTORY OF WEB - 1

## A. Initiate

### A-1. Init Next Application

```bash
npx create-next-app@latest toy-web
  Need to install the following packages:
  create-next-app@13.4.12
  Ok to proceed? (y) y
  ✔ Would you like to use TypeScript? … # Yes
  ✔ Would you like to use ESLint? … # Yes
  ✔ Would you like to use Tailwind CSS? … # No 
  ✔ Would you like to use `src/` directory? … # No 
  ✔ Would you like to use App Router? (recommended) … # Yes
  ✔ Would you like to customize the default import alias? … # Yes
  ✔ What import alias would you like configured? … # @/*
```

### A-2. Add `.gitignore`

using [Toptal's gitignore.io](https://www.toptal.com/developers/gitignore):

```bash
# Open to edit
code .gitignore # or click
```

## B. Fix versions

[Fixing Node Version in this repository](https://github.com/dev-chloe/toy-design-kit/blob/main/docs/history.1-init.md#a-3-2-fixing-node-version-in-this-repository)
using [`nvm` (Node Version Manager)](https://github.com/dev-chloe/toy-design-kit/blob/main/docs/history.1-init.md#a-3-1-install-nvm-node-version-manager):

```bash
# Fix node version in project
echo "v18.17.0" > .nvmrc

# Refresh node version with zsh-hook on change directory
cd .. && cd -

# Check
node --version
# v18.17.0

# Update latest npm
npm install -g npm@latest

# Check
npm --version
# 9.8.1
```
