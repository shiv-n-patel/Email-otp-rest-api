import allowedOrigins from "./allowedOrigins";
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
    
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200,  // some legacy browsers (IE11, various SmartTVs)
    credentials: true
}

export default corsOptions;