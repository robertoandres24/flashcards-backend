import { connectToDB, saveUser, UserType, mongoose, getUserByName } from './db';

// Llamar a la función para conectarse a MongoDB
connectToDB();

async function main() {
  // Create a document to save
  // const user: UserType = {
  //   name: 'paul',
  //   age: 30
  // }
  // const userSaved = await saveUser(user);
  // console.log("🚀 ~ file: index.ts:13 ~ main ~ userSaved:", userSaved)

  // get user by name
  const userFetched = await getUserByName('strokes');
  console.log("🚀 ~ file: index.ts:17 ~ main ~ userFetched:", userFetched)

  mongoose.disconnect();
}
try {
  main();
} catch (error) {
  console.error('Error saving document:', error);
  mongoose.disconnect();
}

