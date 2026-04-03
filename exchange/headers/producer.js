const amqp = require('amqplib');


const sendNotification = async (headers, message) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = 'notification_header_exchange';

        await channel.assertExchange(exchangeName, 'headers', { durable: true });

        channel.publish(exchangeName, '', Buffer.from(message), { persistent: true, headers });
        console.log(`Message sent: ${message} with headers: ${JSON.stringify(headers)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

sendNotification({ "x-match": "all", "notification-type": "new_video", "content-type": "video" }, "New Music Video Uploaded!");
sendNotification({ "x-match": "all", "notification-type": "live_stream", "content-type": "gaming" }, "Gaming Live Stream Started!");
sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" }, "New Comment on Vlog!");
sendNotification({ "x-match": "any", "notification-type-comment": "like", "content-type": "vlog" }, "New Like on Vlog!");