const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');

const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");
// const ExpressError = require("../utils/ExpressError");

// const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn, isAuthor, validateCampground, validateReview } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//different way of routing
router.route('/')
    .get(catchAsync (campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('it worked');
    // })

// NEW
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// INDEX
// router.get("/", catchAsync (campgrounds.index));

// NEW
// router.get("/new", isLoggedIn, campgrounds.renderNewForm); // new route should come before show route, thats why moved before

// CREATE
// router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// SHOW
// router.get("/:id", catchAsync(campgrounds.showCampground));

// EDIT
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// UPDATE
// router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// DELETE
// router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;