import { connectToDB, saveUser, UserType, mongoose } from './db';

// Llamar a la función para conectarse a MongoDB
connectToDB();

async function main() {
  // Create a document to save
  const user: UserType = {
    name: 'paul',
    age: 30
  }
  const userSaved = await saveUser(user);
  console.log("🚀 ~ file: index.ts:13 ~ main ~ userSaved:", userSaved)
  mongoose.disconnect();
}
try {
  main();
} catch (error) {
  console.error('Error saving document:', error);
  mongoose.disconnect();
}

