
const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})

// const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!!!:"));
db.once("open", () => {
    console.log("Database Connected!!!");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: "purple field"});
    // await c.save();
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //MY USER ID
            author: '6070bc5f9b17ed2124513baa',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia voluptate quia maxime rerum impedit quae animi nisi, consequatur modi cupiditate omnis at nihil incidunt beatae ipsa fugiat voluptatum, quos quasi.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }, 
            images: [
                {
                  url: 'https://res.cloudinary.com/dizmicoat/image/upload/v1618429173/YelpCamp/lbay7jozdvorrsfy4wne.jpg',
                  filename: 'YelpCamp/lbay7jozdvorrsfy4wne'
                }
              ]
        })
        await camp.save();
    }

}

seedDB().then( () => {
    mongoose.connection.close();
})


