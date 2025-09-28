import express from 'express';
import { APP_PORT, DB_URL} from './config/index.js';
import routes  from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import path from 'node:path'


const app = express();

//databse connection

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true ,
  //useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  

});

//global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended:false}));

app.use(express.json());
app.use('/api', routes);

app.use(express.json());

app.use(errorHandler)

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
