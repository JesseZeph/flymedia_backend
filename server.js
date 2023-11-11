const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const sanitize = require('express-mongo-sanitize')
const app = express()
const port = 6002

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const verifyCompanyRouter = require('./routes/verifyCompany')
const uploadRouter = require('./routes/campaingnUpload')
const jobSpecRouter = require('./routes/jobspec')
const influencerProfileRouter = require('./routes/influencerProfile');
const nicheRouter = require('./routes/niche')

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests',
})

app.use('/api', limiter)

app.use('/', authRouter);
app.use('/api/users', userRouter )
app.use('/api/verifyCompany', verifyCompanyRouter )
app.use('/api/uploadCampaign', uploadRouter)
app.use('/api/jobSpec',jobSpecRouter )
app.use('/api/influencerProfile',influencerProfileRouter )
app.use('/api/niches', nicheRouter);


app.listen(process.env.PORT || port, () => console.log(`Flymedia is listening to port ${process.env.PORT}!`))