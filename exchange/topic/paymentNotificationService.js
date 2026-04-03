const amqp = require('amqplib');
const e = require('express');


const recievePayment = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";
    const queue = "payment_notification_queue";

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, 'payment.*');

    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, (msg) => {
        if (msg !== null) {
            console.log(`[Payment Notification] Msg was comsume! with routing key: ${msg.fields.routingKey} and content: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    }, { noAck: false });
}

recievePayment();