const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const app = express()
const port = 6002

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const companyRouter = require('./routes/company')

const uploadRoute = require('./routes/routerUpload')
const jobSpec = require('./routes/jobspec')



dotenv.config();

const admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', authRouter);
app.use('/api/users', userRouter )
app.use('/api/company', companyRouter )
app.use('/api/logo', uploadRoute)
app.use('/api/jobSpec',jobSpec )



app.listen(process.env.PORT || port, () => console.log(`Flymedia is listening to port ${process.env.PORT}!`))