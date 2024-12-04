console.log('App.js is loaded');
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { app } from './Socket/socket.js';

// const app = express();

const allowedOrigins = [process.env.CORS_ORIGIN, 'http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
};

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js';
import serviceProviderRouter from './routes/serviceProvider.routes.js';
import jobRoutes from './routes/jobRoutes.js';

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/service-providers", serviceProviderRouter);
app.use('/api/v1/users', jobRoutes);
export default app;