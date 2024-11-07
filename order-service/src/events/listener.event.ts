import amqplib from "amqplib";

async function listenToStockUpdates() {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = "stock_updates";

  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    if (msg) {
      const stockUpdate = JSON.parse(msg.content.toString());
      console.log("Received stock update:", stockUpdate);
      channel.ack(msg);
    }
  });
}

export { listenToStockUpdates };
