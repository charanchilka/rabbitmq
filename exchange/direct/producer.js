const amqp = require('amqplib');

async function producer() {
    try {
        console.log("Connecting to RabbitMQ...");
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();

        const exchange = "mail_exchange";
        const subscriberRoutingKey = "send_email_to_subscriber_users";
        const userRoutingKey = "send_email_to_users";
        const userMailQueue = "user_mail_queue";
        const subscriberMailQueue = "subscriber_user_mail_queue";

        await channel.assertExchange(exchange, 'direct', { durable: false });

        await channel.assertQueue(subscriberMailQueue, { durable: false });
        await channel.bindQueue(subscriberMailQueue, exchange, subscriberRoutingKey);

        await channel.assertQueue(userMailQueue, { durable: false });
        await channel.bindQueue(userMailQueue, exchange, userRoutingKey);

        const subscriberUserMeessage = {
            to: "rohan@gmail.com",
            from: "tanis@gmail.com",
            subject: "Hello from RabbitMQ - Subscriber User",
            body: "This is a test email sent through RabbitMQ."
        }

        const userMessage = {
            to: "john@gmail.com",
            from: "jane@gmail.com",
            subject: "Hello from RabbitMQ - User",
            body: "This is a test email sent through RabbitMQ."
        };

        // channel.publish(exchange, subscriberRoutingKey, Buffer.from(JSON.stringify(subscriberUserMeessage)));
        channel.publish(exchange, userRoutingKey, Buffer.from(JSON.stringify(userMessage)));
        console.log("Message sent to RabbitMQ:");

        setTimeout(() => {
            conn.close();
        }, 500);
    } catch (error) {
        console.error("Error in producer:", error);
    }
}

producer();