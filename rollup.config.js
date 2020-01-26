// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: {
    cryptoForage: 'src/cryptoForage.ts',
    cryptoPrimitives: 'src/cryptoPrimitives.ts',
    tauriForage: 'src/tauriForage.ts',
    handler: 'src/handler.ts',
    index: 'src/index.ts'
  },
  treeshake:      true,
  perf:           true,
  output:         [
    {
      dir:      'dist/',  // if you will be transpiling and minifying yourself
      entryFileNames: '[name].esm.js',
      format:    'esm',
      sourcemap: true,
      globals:   {
        readFile: 'this',
        'tweetnacl-util': 'this'
      }
    },
    {
      dir:    'dist/', // if you want to consume in node but want it tiny
      entryFileNames: '[name].cjs.min.js',
      format:  'cjs',
      plugins: [ terser() ],
      globals: {
        readFile: 'this',
        'tweetnacl-util': 'this'
      }
    },
    /*
    {
      dir:    'dist/', // if it needs to run in the browser
      entryFileNames: '[name]/[name].umd.js',
      format:  'umd',
      name:    'filer',
      globals: {
        readFile: 'this'
      },
      sourcemap: true
    },
    {
      dir:    'dist/', // if it needs to run in the browser
      entryFileNames: '[name]/[name].umd.min.js',
      format:  'umd',
      plugins: [ terser() ],
      name:    'filer',
      globals: {
        readFile: 'this'
      }
    }
    */
  ],
  plugins: [
    commonjs({
      namedExports: {
      // left-hand side can be an absolute path, a path
      // relative to the current directory, or the name
      // of a module in node_modules
      'tweet-nacl': ['secretbox']
    }}),
    typescript({
      typescript: require('typescript'),
    }),
    resolve({
    // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  watch:    {
    chokidar: true,
    include:  'src/**',
    exclude:  'node_modules/**'
  }
}
