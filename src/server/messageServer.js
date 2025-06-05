import express from 'express';
import cors from 'cors';
import publishWelcomeMail from '../messageQueues/publishers/welcomeMailPublisher.js';
import publishAIResponseGenerationEvent from '../messageQueues/publishers/aiResponseGenerationEventPublisher.js';

const MESSAGE_PORT = process.env.MESSAGE_PORT || 4001;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('how are you today ? Ready to get some messages');
});

app.post('/publish-welcome-email', (req, res) => {
  try {
    const { user } = req.body;
    publishWelcomeMail(user);
    res.status(200).json({ message: 'Sent the email successfully.' });
  } catch (err) {
    console.log('ERROR: ', err);
    res.status(500).json({ error: err, message: 'Mail not sent successfully ' });
  }
});

app.post('/publish-generate-ai-response-event', (req, res) => {
  const { taskDetails } = req.body;
  try {
    console.log('taskDetails: ', taskDetails);
    publishAIResponseGenerationEvent(taskDetails);
    console.log('should not be any issue');
    res.status(200).json({ message: 'Published the ai-generate-response-event succesfully.' });
  } catch (err) {
    console.log('ERROR: ', err);
    res.status(500).json({ error: err, message: 'Failed to publish the event.' });
  }
});

app.listen(MESSAGE_PORT, () => {
  console.log(`MESSAGE SERVER listening on port : ${MESSAGE_PORT}`);
});
