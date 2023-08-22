# HISTORY OF WEB - 5

## A. Build Next.js as static site generation

Prepare [rimraf](https://www.npmjs.com/package/rimraf)
for The [UNIX command](https://en.wikipedia.org/wiki/Rm_(Unix))
`rm -rf` on node:

```bash
# Install
npm install --save-dev rimraf
```

Prepare [`npm-run-all2`](https://www.npmjs.com/package/npm-run-all2)
for using short npm command:

```bash
# Install
npm install --save-dev npm-run-all2
```

Prepare [serve](https://www.npmjs.com/package/serve) engine
[by. Vercel](https://github.com/vercel/serve#readme)
for static web hosting:

```bash
# Install
npm install --save-dev serve
```

Add npm script:

```json
{
  // ...
  "scripts": {
    // ...
    "clean": "run-p clean:*",
    "clean:cache": "rimraf ./.next",
    "clean:bundle": "rimraf ./build",
    "build": "run-s clean build:check build:bundle",
    "build:check": "LOCAL_DEPEND_COUNT=$(jq '.dependencies.\"toy-design-kit\"' package.json | tr -d '\"' | grep 'file:' | wc -l | tr -d ' ') && [[ ${LOCAL_DEPEND_COUNT} > 0 ]] && echo '[FAIL] Invalid dependencies: Replace \"file:../toy-design-kit\" in ./package.json' && echo '' && exit 1 || exit 0",
    "build:bundle": "next build",
    "next-ssg": "npx serve --listen 13000 ./build"
  }
  // ...
}
```

Build Next.js as static site generation, and hosting test:

```bash
# Build
npm run build

# Hosting
npm run next-ssg

# Check in the browser
open http://localhost:13000/
```

## B. [Deploy the static site generation bundle to Amazon S3 bucket](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-services-s3-commands.html#using-s3-commands-managing-objects-sync)

```bash
# Check local directory(source)
ls -shl "./build/."

# Set environment variable
export TARGET_WEB_BUCKET="web.dev.poc-in.site"
env | grep "TARGET_WEB_BUCKET"

# Set AWS profile in cli
export AWS_PROFILE="web-deployer-to-dev"
# Check
aws sts get-caller-identity --out=json | jq

# Check current state of remote S3 bucket(target)
aws s3 ls "s3://${TARGET_WEB_BUCKET:?}"
# (option) Remove objects in target bucket
aws s3 rm "s3://${TARGET_WEB_BUCKET:?}" --recursive

# Sync objects from source to target
aws s3 sync "./build/." "s3://${TARGET_WEB_BUCKET:?}"
# Check result state remote S3 bucket(target)
aws s3 ls "s3://${TARGET_WEB_BUCKET:?}"

# TODO: Refresh cache data in CloudFront(CDN)
```

## C. Publish git-tag to GitHub Repository

### Create new tag

```bash
# Set sementic versioning
export NEW_VERSION=$(jq '.version' package.json | tr -d '"')
export NEW_MESSAGE="🎉 Release version '${NEW_VERSION}'"
env | grep NEW_

# Create new tag on current commit of branch
# with commit hash, annotation and message
git tag \
    --annotate "${NEW_VERSION}" \
    --message "${NEW_MESSAGE}"

# Check created tag on list
git tag --list ${NEW_VERSION}

# Check created tag with detail
git show ${NEW_VERSION}

# Push this tags on this branch to remote
git push origin $(git branch --show-current) --tags

# Check on log
git log --oneline
```

### Remove a tag

```bash
# Set sementic versioning
export TARGET_VERSION="0.1.0"
env | grep TARGET_VERSION

# Remove a tag with pick
git tag --delete ${TARGET_VERSION}

# Remove the removed tag at the remote repository (origin)
git push origin ":${TARGET_VERSION}"
```
