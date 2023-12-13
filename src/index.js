const express = require('express');
const dotenv = require('dotenv')
const { default: mongoose } = require('mongoose');
const cors = require("cors");
const routes = require('./routes');
const bodyParser = require('body-parser');
dotenv.config()

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json())
// app.use(cookieParser());

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db success!');
    }).catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log('Server is listening on port: ', + port)
})