import dotenv from 'dotenv';

dotenv.config();

export const env = {
  MONGO_URL: process.env.MONGO_URL || '',
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL || '',
  MQTT_USERNAME: process.env.MQTT_USERNAME || '',
  MQTT_PASSWORD: process.env.MQTT_PASSWORD || '',
  MQTT_CLIENTID: process.env.MQTT_CLIENTID || '',
  PORT: process.env.PORT || 3000
};