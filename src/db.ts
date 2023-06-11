import mongoose, { ConnectOptions, Schema } from 'mongoose';

async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error("Error connecting to MongoDB");
  }
}
// Define the schema for your collection
const UserSchema = new Schema({
  name: String,
  age: Number
});

// Create a model based on the schema
const User = mongoose.model('users', UserSchema);

type UserType = {
  name: string;
  age: number;
}

const saveUser = async (user: UserType) => {
  const userI = new User(user);
  // save user
  return userI.save()
}
// Retrieve a user by name
const getUserByName = async (name: string) => {
  try {
    const user = await User.findOne({ name });
    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

export { connectToDB, mongoose, saveUser, UserType, getUserByName };