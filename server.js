const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const app = express();
const port = 6002;

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const verifyCompanyRouter = require('./routes/verifyCompany');
const uploadRouter = require('./routes/campaingnUpload');
const influencerProfileRouter = require('./routes/influencerProfile');
const nicheRouter = require('./routes/niche');
const publishCampaignRouter = require('./routes/publishCampaign');
const influencerApplicationRouter = require('./routes/influencerApplication');
const confirmDataRouter = require('./routes/confirmDataRoute');
const chatRouter = require('./routes/chats');
const appleRouter = require('./routes/appleRouter');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const accountRouter = require('./routes/accountRouter');
const paymentRouter = require('./routes/paymentRouter');

dotenv.config();

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(sanitize());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use('/api/', authRouter);
app.use('/api/users', userRouter);
app.use('/api/verifyCompany', verifyCompanyRouter);
app.use('/api/uploadCampaign', uploadRouter);
app.use('/api/influencerProfile', influencerProfileRouter);
app.use('/api/niches', nicheRouter);
app.use('/api/publish', publishCampaignRouter);
app.use('/api/applications', influencerApplicationRouter);
app.use('/api/confirm', confirmDataRouter);
app.use('/api/chats', chatRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/account', accountRouter);
app.use('/apple', appleRouter);
app.use('/api/checkout', paymentRouter);

endpointSecret = "whsec_AeqnnLKiS8h2BfCikqxfcplSBqjP2Gwl"


// const verifyWebhookSignature = (req, res, next) => {
//   const sigHeader = req.headers['stripe-signature'];
//   const rawBody = req.rawBody;

//   try {
//     const event = stripe.webhooks.constructEvent(rawBody, sigHeader, endpointSecret);
//     req.event = event;
//     return next();
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send('Webhook signature verification failed');
//   }
// };


// app.post('/api/webhooks', verifyWebhookSignature, express.raw({ type: 'application/json' }), (req, res) => {
//   const event = JSON.parse(req.rawBody); 
//   handleWebhookEvent(event);
//   res.status(200).end();
// });

app.post('/api/webhooks', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  switch (event.type) {
    case 'customer.subscription.created':
      console.log('Subscription created:', event);

      const subscriptionId = event.data.object.id;

      await updateUserSubscription(subscriptionId);

      break;

    case 'checkout.session.completed':
      console.log('Checkout session completed:', event);

      const sessionId = event.data.object.id;

      await updatePaymentStatus(sessionId, 'success');

      break;

    case 'invoice.payment_succeeded':
      console.log('Invoice payment succeeded:', event);

      const invoiceId = event.data.object.id;

      await updatePaymentStatus(invoiceId, 'success');

      break;

    case 'invoice.payment_failed':
      console.log('Invoice payment failed:', event);

      const failedInvoiceId = event.data.object.id;
      await updatePaymentStatus(failedInvoiceId, 'failed');

      break;


    default:
      console.log('Unhandled event type:', event.type);
  }
  response.send();  
});


app.listen(process.env.PORT || port, () =>
  console.log(`Flymedia is listening to port ${process.env.PORT}!`)
);
