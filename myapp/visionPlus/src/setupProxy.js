const { createProxyMiddleware } = require('http-proxy-middleware');

// https://create-react-app.dev/docs/proxying-api-requests-in-development/
module.exports = function (app) {
    app.use(
        [
            '**/api/**',
            '/myapp',
            '/us_pipeline_modelview'
        ],
        createProxyMiddleware({
            target: 'http://kubeflow.tke.woa.com',
            changeOrigin: true,
        })
    );
};