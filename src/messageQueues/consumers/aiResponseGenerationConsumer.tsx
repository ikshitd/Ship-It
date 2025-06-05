import amqplib from 'amqplib';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const recvMail = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('ai_response_queue', { durable: false });
    channel.consume('ai_response_queue', async (event) => {
      if (event != null) {
        const taskDetails = JSON.parse(event.content.toString());
        console.log('getting the following taskDetails: ', taskDetails);
        const response = await axios.post('http://localhost:8000/ask', {
          question: taskDetails.description,
        });
        taskDetails.aiGeneratedResponse = response.data.answer;
        await axios.post('http://localhost:3001/update-task', {
          boardId: taskDetails.boardId,
          taskId: taskDetails.id,
          taskDetails: taskDetails,
        });
        socket.emit('taskUpdated', taskDetails);
        channel.ack(event);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

recvMail();
