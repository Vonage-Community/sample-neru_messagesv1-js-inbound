import { neru, Messages } from 'neru-alpha';

const router = neru.Router();

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

router.post('/onMessage', async (req, res) => {
    const message = req.body.text;
    console.log(`Message received: ${message}`);

    await messages.send({
        message_type: 'text',
        to: req.body.from,
        from: vonageNumber.number,
        channel: 'sms',
        text: `You sent: "${message}"`
    }).execute();

    res.sendStatus(200);
});

router.post('/onEvent', async (req, res) => {
    const { status } = req.body;
    console.log(`message status is: ${status}`);

    res.sendStatus(200);
});

export { router };
