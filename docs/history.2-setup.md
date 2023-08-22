# HISTORY OF WEB - 2

## A. Setup [ESLint Config for Next](https://nextjs.org/docs/app/building-your-application/configuring/eslint#eslint-config)

Recommended rule-sets from the following ESLint plugins are all used within eslint-config-next:

- [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-plugin-next](https://www.npmjs.com/package/eslint-plugin-next)
  ([already bundled within the base configuration](https://nextjs.org/docs/pages/building-your-application/configuring/eslint#eslint-plugin))

```bash
# Install additionally recommended rule-sets
npm install --save-dev \
    eslint-plugin-react \
    eslint-plugin-react-hooks
```

Edit eslint configuration at [`.eslintrc.yaml`](../.eslintrc.yaml) file

Also add [`.eslintignore`](../.eslintignore) file

```diff
// in next.config.js
const nextConfig = {
+  eslint: {
+    dirs: ["app"],
+  },
  // ...
}
```

> [read more](https://nextjs.org/docs/pages/building-your-application/configuring/eslint#linting-custom-directories-and-files)

## B. Setup ESLint with [JS Standard Style](https://standardjs.com/index.html#install)

```bash
# Install standard style for typescript
npm install --save-dev eslint-config-standard-with-typescript
```

## C. Install [Prettier](https://prettier.io/docs/en/integrating-with-linters.html)

Using with ESLint: [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier#readme)

```bash
npm install --save-dev eslint-config-prettier
```

- [`.eslintrc.yaml`](../.eslintrc.yaml)
- [`.prettierrc.yaml`](../.prettierrc.yaml)
- [`.prettierignore`](../.prettierignore)
- [read more](https://nextjs.org/docs/app/building-your-application/configuring/eslint#prettier)

## D. Install husky

Follow up [this document (Install husky)](https://typicode.github.io/husky/getting-started.html)

### D-1. Enable husky

```bash
# husky-init is a one-time command to quickly initialize a project with husky.
npx husky-init && npm install --save-dev husky
```

Check [the `prepare` script in `package.json`](./package.json#L6)

```bash
# If not enabled, try manually
npm run prepare
  # husky - Git hooks installed
```

## D-2. Block to commit on long-reserved branch directly

Edit [`.husky/pre-commit`](../.husky/pre-commit) file like below:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

prefix="husky ::"
branch="$(git rev-parse --abbrev-ref HEAD)"

# Block to long-lived branch(main) directly.
echo ""
echo "${prefix} [INFO] This is '${branch}' branch."
if [ "$branch" = "main" ]; then
  echo ""
  echo "${prefix} [WARN] You can't commit directly to main branch."
  echo "${prefix} [HINT] Create a support branch first."
  echo ""
  echo "       $ git switch -c <new_branch_name>"
  echo ""
  exit 1
fi

# Test First
# echo ""
# echo "${prefix} [INFO] Test before commit."
# npm run test && echo ""

# Lint First
echo "${prefix} [INFO] Lint before commit."
npm run lint
echo ""
```
