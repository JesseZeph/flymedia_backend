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
const stripeWebhookHandler = require('./middleware/stripeWebhook'); 


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

app.use(process.env.URL_CONFIG + '/api/webhooks', express.raw({ type: 'application/json' }))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(sanitize());


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

app.post('/api/webhooks', stripeWebhookHandler.stripeListenWebhook);



app.listen(process.env.PORT || port, () =>
  console.log(`Flymedia is listening to port ${process.env.PORT}!`)
);
