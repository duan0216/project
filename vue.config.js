// vue.config.js
const publicPath = '/lrsemap';
module.exports = {
    // webpack-dev-server 相关配置
    // 选项
    devServer: {
        port: 9000,
        proxy: {
            '/vectorTilesRouter': {
                target: 'http://localhost:3000/'
            },
            '/imap-vectorshow': {
                target: 'http://112.94.224.249:9011/'
            },
            '/arcgis': {
                target: 'http://192.168.10.100:6080/'
            },
            '/serviceApi': {
                target: 'http://192.168.10.135:14001/', // 你接口的域名
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/serviceApi': '/'
                }
            }
        },
    },
    publicPath: publicPath,
    css: {
        loaderOptions: {
            sass: {
                data: '$baseUrl: ' + publicPath + ';'
            }
        }
    }
};
