import connectDB from "./src/config/index.js";
import { app } from "./src/app.js";
import { PORT } from "./src/utils/dotenv.js";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running at PORT : ", PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error ", err);
    process.exit(1);
  });
