# Juice-CLI

`juice` launches a dancing juice box (with 2 hands and 2 legs) in your terminal.

## Install (local dev)

```bash
npm install
npm link
juice
```

## Run without linking

```bash
npm start
```

## Publish to your GitHub (`3x1om`)

```bash
git init
git add .
git commit -m "feat: initial Juice-CLI with terminal animation"
git branch -M main
git remote add origin https://github.com/3x1om/Juice-CLI.git
git push -u origin main
```

If the repo does not exist yet, create it first at:

- https://github.com/new

Use repository name: `Juice-CLI`

## Optional: publish to npm

```bash
npm login
npm publish --access public
```

After publish, users can run:

```bash
npm i -g juice-cli
juice
```
