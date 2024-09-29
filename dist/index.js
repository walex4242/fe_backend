"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ credentials: true }));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // Use express.json() for parsing JSON bodies
// Routes
app.use('/', routes_1.default); // No need for parentheses, just use the router directly
// Server creation
const server = http_1.default.createServer(app);
// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
// MongoDB connection
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    console.error('MongoDB connection string not provided!');
    process.exit(1); // Exit if no connection string is found
}
mongoose_1.default.Promise = Promise;
mongoose_1.default
    .connect(mongoUrl) // No need for useNewUrlParser and useUnifiedTopology
    .then(() => console.log('Database connected'))
    .catch((error) => {
    console.error('Error connecting to DB:', error);
    process.exit(1);
});
// Graceful shutdown on termination signals
const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB disconnected on app termination');
    }
    catch (err) {
        console.error('Error while closing MongoDB connection:', err);
    }
    finally {
        process.exit(0);
    }
};
// Handle termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
// Handle MongoDB connection errors
mongoose_1.default.connection.on('error', (error) => console.error('MongoDB connection error:', error));
//# sourceMappingURL=index.js.map