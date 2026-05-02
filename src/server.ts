import app from "./app.js";
import { config } from "dotenv";

// Load environment variables
config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server fully operational and listening on port ${PORT}`);
});
