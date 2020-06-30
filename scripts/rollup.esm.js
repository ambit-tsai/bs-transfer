import banner from './banner';
import {string} from 'rollup-plugin-string';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import babel from 'rollup-plugin-babel';


export default {
    input: 'src/BsTransfer.js',
    output: {
        file: 'dist/bs-transfer.mjs',
        format: 'es',
        globals: {
            jquery: 'jQuery',
        },
        banner,
        sourcemap: true,
    },
    external: [
        'jquery',
    ],
    plugins: [
        string({
            include: [
                '**/*.html',
            ],
        }),
        postcss({
            plugins: [
                autoprefixer,
            ],
        }),
        babel({
            plugins: [
                '@babel/plugin-proposal-class-properties',
            ],
        }),
    ],
};