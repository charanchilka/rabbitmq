const amqp = require('amqplib');


async function consumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const userMailQueue = "user_mail_queue";
        const subscriberMailQueue = "subscriber_user_mail_queue";

        await channel.assertQueue(subscriberMailQueue, { durable: false });

        channel.consume(subscriberMailQueue, (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                console.log("Received message from RabbitMQ For Subscriber Users:", JSON.parse(messageContent));
                channel.ack(msg);
            }
        })

        channel.consume(userMailQueue, (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                console.log("Received message from RabbitMQ For Users:", JSON.parse(messageContent));
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error in consumer:", error);
    }
}

consumer();