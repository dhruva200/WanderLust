const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { route } = require('./listing.js');
const Listing = require("../models/listing.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

const revirewController = require("../controllers/reviews.js");

//Post Review Route
  router.post("/", validateReview, isLoggedIn, wrapAsync(revirewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(revirewController.destroyReview));

module.exports = router;
