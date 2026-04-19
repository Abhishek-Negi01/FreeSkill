import connectDB from "./src/config/index.js";
import { app } from "./src/app.js";
import { PORT } from "./src/utils/dotenv.js";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running at PORT : ", PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error ", error);
    process.exit(1);
  });
