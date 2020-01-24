// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: {
    cryptoForage: 'src/cryptoForage.ts',
    cryptoPrimitives: 'src/cryptoPrimitives.ts',
    curriedForage: 'src/curriedForage.ts',
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
        readFile: 'this'
      }
    },
    {
      dir:    'dist/', // if you want to consume in node but want it tiny
      entryFileNames: '[name].cjs.min.js',
      format:  'cjs',
      plugins: [ terser() ],
      globals: {
        readFile: 'this'
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
    globals(),  // make sure we need this
    builtins(), // make sure we need this
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
