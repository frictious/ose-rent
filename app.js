const   express                 = require("express");

require("dotenv").config();
const app = express();

// CONFIG
app.get("/", (req, res) => {
    res.send("<h1>WELCOME TO OUR HOUSE RENTAL SYSTEM</h1>");
});

// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
