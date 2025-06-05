import amqplib from 'amqplib';

const publishAIResponseGenerationEvent = async (taskDetails) => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'mail_exchange';
    const routingKeyForAIResponseGeneration = 'generate_ai';

    await channel.assertQueue('ai_response_queue', { durable: false });
    await channel.bindQueue('ai_response_queue', exchange, routingKeyForAIResponseGeneration);

    channel.publish(exchange, routingKeyForAIResponseGeneration, Buffer.from(JSON.stringify(taskDetails)));
  } catch (err) {
    console.log(err);
  }
};

export default publishAIResponseGenerationEvent;
