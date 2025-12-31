const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connect to db")
})
.catch((err)=>{
    console.log(err)
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


app.get("/",(req,res)=>{
    res.send("Hi I am root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    
    // 2. Check if there is an error
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(', ');
        // CORRECTION: passed 'errMsg' instead of undefined 'result.error'
        throw new ExpressError(400, errMsg); 
    } else {
        next();
    }
}


// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post(
    "/listings", 
    validateListing,
    wrapAsync(async (req, res, next) => {
    // 3. If valid, save the data
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing}); 
}));

//Update Route
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync (async (req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"Invalid Listing Data");
     }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync (async (req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Vila",
//         description:"By the beach",
//         price:1200,
//         location:"Culungute,Goa",
//         country:"Bharat",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");


app.all( "*",(req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render("error.ejs", { message, err }); // Pass both
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
});