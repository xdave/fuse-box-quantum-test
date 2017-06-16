# FuseBox Quantum Test

## Testing the tree-shaking in [FuseBox Quantum](http://fuse-box.org/page/quantum)

NOTE: This project currently does not work in production mode. :)

### Instructions

From `package.json`:
```json
"scripts": {
    "build": "ts-node fuse",
    "start": "npm -s run build -- -d",
    "prod": "cross-env NODE_ENV=production npm -s run build",
    "prodserver": "cross-env NODE_ENV=production npm -s run build -- -d"
  },
```

- `npm run build` for a development build
- `npm run start` for a development server with hot-reloading
- `npm run prod` for a production build (tree-shaken)
- `npm run prodserver` for a production server for testing
