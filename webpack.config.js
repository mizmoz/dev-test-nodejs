var path = require('path');

module.exports = {
    entry : "./public/js/index.js",
    output : {
        path : path.join(__dirname, "/public/build"),
        filename : "scripts_bundle.js"
    },
    module : {
        rules : [
            {
                test : /\.(js|jsx)$/,
                exclude : /node_modules/,
                use : {
                    loader : "babel-loader"
                }
            },
            {
                test : /\.css$/,
                use :  ["style-loader", "css-loader"]
            }

        ]
    }
}