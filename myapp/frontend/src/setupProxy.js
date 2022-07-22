const { createProxyMiddleware } = require('http-proxy-middleware');

// https://create-react-app.dev/docs/proxying-api-requests-in-development/
module.exports = function (app) {
    app.use(
        ['**/api/**', '/myapp', '/login'],
        createProxyMiddleware({
            // target: 'http://data.tme.woa.com',
            target: 'http://10.101.142.33',
            // target: 'http://localhost',
            changeOrigin: true,
        })
    );

    app.use(
        ['/idex'],
        createProxyMiddleware({
            // target: 'http://10.101.142.33',
            target: 'http://data.tme.woa.com',
            // target: 'http://localhost',
            changeOrigin: true,
        })
    );
};