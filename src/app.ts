import Fastify, {FastifyInstance} from 'fastify';
import * as dotenv from 'dotenv';
import './cron';
import cors from 'fastify-cors'
import {Server, IncomingMessage, ServerResponse} from "http";
import {changeRoutes} from "./routes/changeRoute";

const start = async (): Promise<void> => {
    const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify();
    try {
        server.register(cors, {
            origin: "*",
            methods: ["GET"]
        });
        server.register(changeRoutes);
        const port = process.env.PORT || 3004;
        await server.listen(port);
        console.log('Server start in port: ' + port);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

dotenv.config();
start().then(() => console.log('The server started'));

