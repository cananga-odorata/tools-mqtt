import express from 'express';
import connectMongo from './database/connectMongo';
import vehicleRouter from './routes/vehicle';
import { client } from './config/mqtt';
import { env } from './config/env';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api', vehicleRouter);

const startServer = async () => {
    await connectMongo();

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
    });

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
};

startServer().catch(console.error);

export default app;