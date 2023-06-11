import { User, connectToDB, mongoose } from './db';

// Llamar a la función para conectarse a MongoDB
connectToDB();

// Create a document to save
const user = new User({ name: 'obando', age: 38 });
// Save the document to the collection

user.save()
  .then(savedUser => {
    console.log('Document saved:', savedUser);
    mongoose.disconnect();
    // close connectio
  })
  .catch(error => {
    console.error('Error saving document:', error);
    mongoose.disconnect();
  });