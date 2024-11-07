import amqplib from "amqplib";

async function publishStockUpdateEvent(item) {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "stock_updates";

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(item)));

  console.log(`Published stock update event for item ${item._id}`);
}

export { publishStockUpdateEvent };
