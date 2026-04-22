import "dotenv/config";
import app from "./src/app.js";
import connectDb from "./src/config/database.js";
import { main } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 5000;


  await connectDb();


// main()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

    

