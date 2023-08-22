# HISTORY OF WEB - 3

## A. Setup [styled-components][sc-install] on Next rendering cycle

[sc-install]: (https://styled-components.com/docs/basics#installation)

```bash
# Install
npm install --save-dev styled-components
```

```diff
// in next.config.js
const nextConfig = {
+  reactStrictMode: true,
+  compiler: {
+    styledComponents: {
+      displayName: true,
+     fileName: true,
+     ssr: true,
+    },
+  },
  // ...
}
```

> [read more](https://nextjs.org/docs/architecture/nextjs-compiler#supported-features)
