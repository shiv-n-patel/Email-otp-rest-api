//library
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions';

//controllers
import rootController from './controllers/rootController'

//routers
import router from './routes/allRouters'

//config
import connectDB from './config/dbConn';

// middleware
import logEvents from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';
import credentials from './middleware/credentials';

// --------------------------------------------------------------------
// database connection esatablishment
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;


//middleware
// middleware for logs
app.use(logEvents.logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// // Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));

// built in middleware json parser
app.use(express.json());

// middleware cookie-parser
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/index(.html)?/data',express.static(path.join(__dirname, 'public')));

// routers
app.use("/", router);

// error404 page
app.all('*', rootController.error404);

app.use(errorHandler);
// when connected to DB :
mongoose.connection.once('open', () => {
  console.log("Connected To Database");
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});