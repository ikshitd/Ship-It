import amqplib from 'amqplib';

const publishWelcomeMail = async (user) => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'mail_exchange';
    const routingKeyForSendingEmail = 'send_mail';

    await channel.assertExchange(exchange, 'direct', { durable: false });
    await channel.assertQueue('mail_queue', { durable: false });
    await channel.bindQueue('mail_queue', exchange, routingKeyForSendingEmail);

    channel.publish(exchange, routingKeyForSendingEmail, Buffer.from(JSON.stringify(user)));
  } catch (err) {
    console.log(err);
  }
};

export default publishWelcomeMail;
