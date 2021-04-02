import apiRoutes from './routes';
import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import swaggerSpec from './config/swaggerSpecConfig';

const start = async () => {
    const server = fastify();
    try {
        server.register(fastifySwagger, swaggerSpec);
        server.register(apiRoutes);
        await server.listen(3004);
        console.log('Server start in port: ' + 3004);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

