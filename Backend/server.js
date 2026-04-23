import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDb from "./src/config/database.js";

import { initSocketServer } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 5000;

await connectDb();

const server = http.createServer(app);
initSocketServer(server);

// main()
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
