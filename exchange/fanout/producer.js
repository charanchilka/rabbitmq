const amqp = require('amqplib');

const sendNotification = async (product) => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'new_product_launch';

    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    const message = JSON.stringify(product);
    channel.publish(exchangeName, '', Buffer.from(message), { persistent: true });
    console.log(" [x] Sent %s", message);

    setTimeout(() => {
        connection.close();
    }, 500);
}

sendNotification({ id: 1, name: 'New Product', price: 99.99 });