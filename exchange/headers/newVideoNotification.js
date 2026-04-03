const amqp = require('amqplib');


const newVideoNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = 'notification_header_exchange';

        await channel.assertExchange(exchangeName, 'headers', { durable: true });
        const q = await channel.assertQueue('', { exclusive: true });

        console.log(`Waiting for new video notifications...`);

        await channel.bindQueue(q.queue, exchangeName, "", {
            "x-match": "all",
            "notification-type": "new_video",
            "content-type": "video"
        })

        channel.consume(q.queue, (msg) => {
            if (msg !== null) {
                console.log(`Received notification: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        channel.noAck = true;
        console.error('Error receiving message:', error);

    }
}

newVideoNotification();