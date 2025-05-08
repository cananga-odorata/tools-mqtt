import mqtt from "mqtt";
import { env } from "./env";

const { MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD, MQTT_CLIENTID } = env;

export const client = mqtt.connect(MQTT_BROKER_URL, {
    port: 1883,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: MQTT_CLIENTID,
    reconnectPeriod: 5000,
});

client.on("error", (err) => {
    console.log("MQTT Connection Error:", err);
});

client.on("close", () => {
    console.log("Disconnected from MQTT Broker");
});

client.on("reconnect", () => {
    console.log("Reconnecting to MQTT Broker");
});

client.on("offline", () => {
    console.log("MQTT Broker is offline");
});