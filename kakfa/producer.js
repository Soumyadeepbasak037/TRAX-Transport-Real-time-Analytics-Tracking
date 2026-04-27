import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "trax-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

let isConnected = false;

export const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("Kafka producer connected");
  }
};

export const produceLocationEvent = async (payload) => {
  await producer.send({
    topic: "vehicle-positions",
    messages: [
      {
        key: String(payload.vehicleId),
        value: JSON.stringify(payload),
      },
    ],
  });
};
