import { initDB } from "./src/config/database.js";
import "./src/models/index.js";
import express from "express";
import routes from "./src/routes/routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Cafeteria OK" });
});
app.use(routes);

initDB().then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
