import amqplib from 'amqplib';
import { Resend } from 'resend';
import { ShipItWelcomeEmailTemplate } from '../emailTemplates/ShipItWelcomeEmail.js';

const recvMail = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('mail_queue', { durable: false });
    channel.consume('mail_queue', (msg) => {
      if (msg != null) {
        const resend = new Resend('re_dH7UBpCx_LFGexZtcu72AcPyqNiKAG6WG');
        const user = JSON.parse(msg.content.toString());
        resend.emails
          .send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Welcome to Ship-It',
            react: ShipItWelcomeEmailTemplate({ name: user.name }),
          })
          .then((res) => {
            console.log('Email sent:', res);
          })
          .catch((err) => {
            throw new Error('Error sending email:', err);
          });
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

recvMail();
