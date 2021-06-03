// DEVELOPMENT MODE
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// PRODUCTION MODE
// require("dotenv").config()

// console.log(process.env.SECRET)

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
// const sanitizeHtml = require('sanitize-html');
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require("connect-mongo")(session);


// const dbUrl = process.env.DB_URL

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!!!:"));
db.once("open", () => {
    console.log("Database Connected!!!");
})

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
// app.use(sanitizeHtml());

const secret = process.env.SECRET || 'badsecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log('SESSION STORE ERROR!', e)
})

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session()); // session should come befoe passport-session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE FOR FLASH
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// ROUTE HANDLERS
app.use('/', userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);



app.get("/", (req, res) => {
    res.render("home");
})


app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; 
    if (!err.message) err.message = "Something went wrong!!!";
    res.status(statusCode).render("error", { err });
   
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVER IS LISTENING ON PORT ${port}`);
})