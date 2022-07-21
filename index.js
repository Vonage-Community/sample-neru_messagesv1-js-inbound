import { neru, Messages } from 'neru-alpha';

import express from 'express';

const app = express();
const port = process.env.NERU_APP_PORT;

const session = neru.createSession();
const messages = new Messages(session);

const vonageNumber = JSON.parse(process.env.NERU_CONFIGURATIONS).contact;

// Listen for messages from all numbers
await messages.onMessage(
    'onMessage',
    { type: 'sms', number: null },
    vonageNumber
).execute();

// Listen for events
await messages.onMessageEvents(
    'onEvent',
    { type: 'sms', number: null },
    vonageNumber
).execute();

app.use(express.json());

app.get('/_/health', async (req, res) => {
    res.sendStatus(200);
});

app.post('/onMessage', async (req, res) => {
    const message = req.body.text;
    console.log(`Message received: ${message}`);

    await messages.send({
        message_type: 'text',
        to: req.body.from,
        from: vonageNumber.number,
        channel: vonageNumber.type,
        text: `You sent: "${message}"`
    }).execute();

    res.sendStatus(200);
});

app.post('/onEvent', async (req, res) => {
    const { status } = req.body;
    console.log(`message status is: ${status}`);

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
