import mongoose, { ConnectOptions } from 'mongoose';

// Define the schema for your collection
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});

// Create a model based on the schema
const User = mongoose.model('users', UserSchema);
async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export { User, connectToDB, mongoose };