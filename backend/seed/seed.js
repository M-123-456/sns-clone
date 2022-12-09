import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
// import * as dotenv from 'dotenv';

// import '../config/config.js';
import User from '../models/User.js';

// console.log(process.env.MONGOURL)

// Initialize database
mongoose
    // ? config.js doesn't work
    .connect('mongodb+srv://mustermann:Um2wrDzDWhXgJhcr@cluster0.whqfjfw.mongodb.net/realsns?retryWrites=true&w=majority')
    .then(() => console.log('Database up'))
    .catch((err) => console.log('Something went wrong', err));

// Delete all old data 
try {
    await User.deleteMany({});
    console.log('All Users Deleted')
} catch (err) {
    console.log(err);
}

// Register new data
const howMany = 50;

// create users array
const users = Array(howMany).fill(null).map(() => ({
    username: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profilePicture: faker.image.avatar(),
    coverPicture: faker.image.nature(),
    followers: [],
    followings: [],
    isAdming: faker.datatype.boolean(),
    desc: faker.name.jobTitle(),
    city: faker.address.cityName()
}));

const createUsers = async () => {
    for (const user of users) {
        await User.create(user);
    }
};

try {
    await createUsers();
    console.log('users created');
} catch (err) {
    console.log(err);
}

// Disconnect from database
mongoose.connection.close();
