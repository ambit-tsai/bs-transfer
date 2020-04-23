import {string} from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';


export default {
    input: 'src/BsTransfer.js',
    output: {
        file: 'docs/bs-transfer.dev.js',
        format: 'umd',
        name: 'BsTransfer',
        globals: {
            jquery: 'jQuery',
        },
    },
    external: [
        'jquery',
    ],
    plugins: [
        string({
            include: [
                '**/*.html',
                '**/*.css',
            ],
        }),
        babel({
            plugins: [
                '@babel/plugin-proposal-class-properties',
            ],
        }),
    ],
    watch: {
        include: 'src/**',
    },
};