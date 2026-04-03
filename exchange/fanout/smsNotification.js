const amqp = require('amqplib');


const senSMSNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = 'new_product_launch';

        await channel.assertExchange(exchangeName, 'fanout', { durable: true });

        const q = await channel.assertQueue('', { exclusive: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        channel.bindQueue(q.queue, exchangeName, '');

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                console.log(" [x] Received %s", msg.content.toString());
                channel.ack(msg);
            }
        });
    } catch (error) {
        channel.noAck = true;
        console.log("Error in SMS Notification:", error);
    }
}

senSMSNotification();;