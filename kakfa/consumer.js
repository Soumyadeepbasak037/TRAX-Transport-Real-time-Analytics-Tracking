import { Kafka } from "kafkajs";
import { insertVehiclePosition } from "../dbLogic/driverSocketLogic.js";
import dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  clientId: "trax-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "position-writers" });

const runConsumer = async () => {
  await consumer.connect();
  console.log("Kafka consumer connected");

  await consumer.subscribe({
    topic: "vehicle-positions",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { vehicleId, tripId, lat, lng, speed, accuracy } = JSON.parse(
          message.value.toString(),
        );
        await insertVehiclePosition(
          vehicleId,
          tripId,
          lat,
          lng,
          speed,
          accuracy,
        );
      } catch (err) {
        console.error("Consumer error:", err.message);
      }
    },
  });
};

runConsumer().catch(console.error);
