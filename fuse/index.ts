import * as path from 'path';
import { FuseBox, WebIndexPlugin, EnvPlugin, QuantumPlugin } from 'fuse-box';

const appDir = path.resolve('.');
const homeDir = path.join(appDir, 'src');
const outDir = path.join(appDir, 'dist');

const node_env = process.env.NODE_ENV;
const prod = node_env === 'production';
const dev = process.argv.includes('-d');

const fuse = FuseBox.init({
    homeDir,
    output: path.join(outDir, '$name.js'),
    hash: prod,
    cache: !prod,
    plugins: [
        WebIndexPlugin({
            title: 'Test',
            template: path.join(homeDir, 'index.html')
        }),
        EnvPlugin({ NODE_ENV: node_env }),
        prod && QuantumPlugin({
            removeExportsInterop: false,
            uglify: true
        })
    ]
});

const bundle = fuse
    .bundle('app')
    .sourceMaps(true)
    .target('browser')
    .instructions('> index.tsx');

if (!prod && dev) {
    bundle.watch().hmr();
    fuse.dev();
} else if (prod && dev) {
    fuse.dev();
}

fuse.run();
