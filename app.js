const   express                 = require("express"),
        Index                   = require("./routes/index"),
        Admin                   = require("./routes/admin"),
        Agent                   = require("./routes/agent"),
        mongoose                = require("mongoose"),
        methodoverride          = require("method-override");

require("dotenv").config();
const app = express();

// CONFIG
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodoverride("_method"));

// MONGODB CONNECTION
global.Promise = mongoose.Promise;
mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false
});

// ROUTES
app.use("/", Index);
app.use("/admin", Admin);
app.use("/agent", Agent);

// SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
});
