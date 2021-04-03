import apiRoutes from './routes';
import fastify from 'fastify';
import * as dotenv from 'dotenv';
import './cron';

dotenv.config();

const start = async () => {
    const server = fastify({logger: true});
    try {
        server.register(apiRoutes);
        await server.listen(3004);
        console.log('Server start in port: ' + 3004);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

