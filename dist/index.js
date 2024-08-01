"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//library
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
//controllers
const rootController_1 = __importDefault(require("./controllers/rootController"));
//routers
const allRouters_1 = __importDefault(require("./routes/allRouters"));
//config
const dbConn_1 = __importDefault(require("./config/dbConn"));
// middleware
const logEvents_1 = __importDefault(require("./middleware/logEvents"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const otpController_1 = __importDefault(require("./controllers/otpController"));
// --------------------------------------------------------------------
// database connection esatablishment
(0, dbConn_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
//middleware
// middleware for logs
app.use(logEvents_1.default.logger);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials_1.default);
// // Cross Origin Resource Sharing
app.use((0, cors_1.default)(corsOptions_1.default));
// built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));
// built in middleware json parser
app.use(express_1.default.json());
// middleware cookie-parser
app.use((0, cookie_parser_1.default)());
// Serve static files from the 'public' directory
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/index(.html)?/data', express_1.default.static(path_1.default.join(__dirname, 'public')));
// routers
app.use("/", allRouters_1.default);
// error404 page
app.all('*', rootController_1.default.error404);
app.use(errorHandler_1.default);
try {
    otpController_1.default.scheduledTask.start();
}
catch (error) {
    console.log(error);
}
// when connected to DB :
mongoose_1.default.connection.once('open', () => {
    console.log("Connected To Database");
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
