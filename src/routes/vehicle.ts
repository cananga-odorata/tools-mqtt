import express from 'express';
import asyncHandler from 'express-async-handler';
import VehicleStatusModel from '../database/models/VehicleStatusLog';
import { client } from '../config/mqtt';
import VehicleHeartbeatModel from '../database/models/VehicleHeartbeat';

const router = express.Router();

router.post('/send-status', asyncHandler(async (req, res) => {
    const { vehicleId, status } = req.body;

    if (!vehicleId || !Number.isInteger(status) || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(status)) {
        res.status(400).json({ error: 'Invalid vehicleId or status' });
        return;
    }

    const message = JSON.stringify({ status });
    const topic = `vehicle/${vehicleId}/wrstatus`;

    try {
        await new Promise((resolve, reject) => {
            client.publish(topic, message, (err) => {
                if (err) reject(err);
                else resolve(undefined);
            });
        });

        // const statusLog = new VehicleStatusModel({
        //     vehicleId,
        //     rawData: { status }
        // });
        // await statusLog.save();
        res.json({ message: 'Status sent and logged successfully' });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Failed to send status' });
        return;
    }
}))

router.get('/vehicle-statuses/:vehicleId/latest', asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const latestStatus = await VehicleStatusModel
        .findOne({ vehicleId })
        .sort({ timestamp: -1 })
        .exec();

    if (!latestStatus) {
        res.status(404).json({ error: 'No status found for this vehicle' });
        return;
    }

    res.json({
        vehicleId: latestStatus.vehicleId,
        status: latestStatus.rawData.status,
        timestamp: latestStatus.timestamp
    });
}));

router.get('/vehicle-heartbeats/:vehicleId/latest', asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const latestHeartbeat = await VehicleHeartbeatModel
        .findOne({ vehicleId })
        .sort({ timestamp: -1 })
        .exec();

    if (!latestHeartbeat) {
        res.status(404).json({ error: 'No heartbeat found for this vehicle' });
        return;
    }

    res.json({
        vehicleId: latestHeartbeat.vehicleId,
        mode: latestHeartbeat.rawData.mode,
        temp: latestHeartbeat.rawData.temp,
        battery: latestHeartbeat.rawData.battery,
        usage_time_mn: latestHeartbeat.rawData.usage_time_mn,
        credit_remaining: latestHeartbeat.rawData.credit_remaining,
        credit_overuse: latestHeartbeat.rawData.credit_overuse,
        timestamp: latestHeartbeat.timestamp
    });
}));

export default router;