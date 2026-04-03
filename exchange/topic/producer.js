const amqp = require('amqplib');

const sendMessage = async (routingKey, message) => {

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";

    await channel.assertExchange(exchange, 'topic', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to exchange ${exchange} with routing key ${routingKey}:`, message);

    setTimeout(() => {
        channel.close();
    }, 500);
}

sendMessage('order.placed', { orderId: 123, status: 'placed' });
sendMessage('payment.completed', { orderId: 123, status: 'completed' });