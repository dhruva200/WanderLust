const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
   image: {
  filename: {
    type: String,
    default: "listingimage",
  },
  url: {
    type: String,
   default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",

    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        : v,
  },
},

    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;