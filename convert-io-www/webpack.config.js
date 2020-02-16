// This is a special configuration used to build the ffmpeg worker.
// Building the React project itself is handled by the create-react-app scripts.

const path = require('path')

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        'ffmpeg.worker': path.join(__dirname, 'ffmpeg.worker.js'),
    },
    output: {
        path: path.join(__dirname, 'public'),
        globalObject: 'self',
    },
    /*module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: '>0.2%, not dead, not op_mini all',
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },*/
}
