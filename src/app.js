import apiRoutes from './routes';
import fastify from 'fastify';
import * as dotenv from 'dotenv';
import './cron';
import cors from 'fastify-cors'

const start = async () => {
    const server = fastify();
    try {
        server.register(cors, {
            origin: "*",
            methods: ["GET"]
        });
        server.register(apiRoutes);
        const port = process.env.PORT || 3004;
        await server.listen(port);
        console.log('Server start in port: ' + port);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

dotenv.config();
start();

