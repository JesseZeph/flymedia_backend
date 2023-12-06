const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const helmet = require('helmet')
// const rateLimit = require('express-rate-limit')
const sanitize = require('express-mongo-sanitize')
const app = express()
const port = 6002

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const verifyCompanyRouter = require('./routes/verifyCompany')
const uploadRouter = require('./routes/campaingnUpload')
const influencerProfileRouter = require('./routes/influencerProfile');
const nicheRouter = require('./routes/niche')
const previewCampaignRouter = require('./routes/previewCampagn')
const publishCampaignRouter = require('./routes/publishCampaign')
const influencerApplicationRouter = require('./routes/influencerApplication')

dotenv.config();

const admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))
app.use(helmet());
app.use(sanitize());

// const limiter = rateLimit({
//   windowMs: 40 * 60 * 1000,
//   max: 1000,
//   message: 'Too many requests',
// })

// app.use('/api', limiter)

app.use('/api/', authRouter);
app.use('/api/users', userRouter )
app.use('/api/verifyCompany', verifyCompanyRouter )
app.use('/api/uploadCampaign', uploadRouter)
app.use('/api/influencerProfile',influencerProfileRouter )
app.use('/api/niches', nicheRouter);
app.use('/api/preview', previewCampaignRouter);
app.use('/api/publish', publishCampaignRouter);
app.use('/api/influencer', influencerApplicationRouter)

app.listen(process.env.PORT || port, () => console.log(`Flymedia is listening to port ${process.env.PORT}!`))