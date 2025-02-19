require('dotenv').config();
const InputError = require('../exceptions/InputError');
 
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
 
(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    const model = await loadModel();
    server.app.model = model;
 
    server.route(routes);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message} Silakan gunakan foto lain.`,
            });
            const statusCode = Number.isInteger(response.statusCode) ? response.statusCode : 400; // Default ke 400 jika tidak valid
            newResponse.code(statusCode);
            return newResponse;
        }
        
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            const statusCode = Number.isInteger(response.statusCode) ? response.statusCode : 500; // Default ke 500 jika tidak valid
            newResponse.code(statusCode);
            return newResponse;
        }
        
 
        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();