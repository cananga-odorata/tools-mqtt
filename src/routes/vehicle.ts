import express from 'express';
import asyncHandler from 'express-async-handler';
import VehicleStatusModel from '../database/models/VehicleStatusLog';
import { client } from '../config/mqtt';
import VehicleHeartbeatModel from '../database/models/VehicleHeartbeat';

const router = express.Router();

router.post('/send-status', asyncHandler(async (req, res) => {
    const { vehicleId, status, model } = req.body;

    // Basic validation
    if (!vehicleId || (status === undefined && model === undefined)) {
        res.status(400).json({ error: 'Invalid request: vehicleId and status or model are required' });
        return;
    }

    const messagePayload: { status?: number, model?: number } = {};
    if (status !== undefined && Number.isInteger(status) && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(status)) {
        messagePayload.status = status;
    }

    if (model !== undefined && Number.isInteger(model)) {
        messagePayload.model = model;
    }

    if (Object.keys(messagePayload).length === 0) {
        res.status(400).json({ error: 'Invalid status or model value' });
        return;
    }

    const message = JSON.stringify(messagePayload);
    const topic = `vehicle/${vehicleId}/wrstatus`;

    try {
        await new Promise((resolve, reject) => {
            client.publish(topic, message, (err) => {
                if (err) reject(err);
                else resolve(undefined);
            });
        });

        res.json({ message: 'Status/model sent and logged successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send status/model' });
    }
}));

router.get('/vehicle-statuses/:vehicleId/latest', asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const latestStatus = await VehicleStatusModel
        .findOne({ vehicleId, 'rawData.status': { $exists: true, $ne: null } })
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

router.get('/vehicle-models/:vehicleId/latest', asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const latestModel = await VehicleStatusModel
        .findOne({ vehicleId, 'rawData.model': { $exists: true, $ne: null } })
        .sort({ timestamp: -1 })
        .exec();

    if (!latestModel) {
        res.status(404).json({ error: 'No model found for this vehicle' });
        return;
    }

    res.json({
        vehicleId: latestModel.vehicleId,
        model: latestModel.rawData.model,
        timestamp: latestModel.timestamp
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
        voltage: latestHeartbeat.rawData.voltage,
        usage_time_mn: latestHeartbeat.rawData.total_usage_time,
        sesstion_usage: latestHeartbeat.rawData.sesstion_usage,
        timestamp: latestHeartbeat.timestamp
    });
}));

export default router;
