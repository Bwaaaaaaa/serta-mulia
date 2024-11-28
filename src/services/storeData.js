const { Firestore } = require('@google-cloud/firestore');

 
async function storeData(id, data) {
   const db = new Firestore({
    projectId: 'serta-mulia-442905', // Setel projectId secara eksplisit
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Kredensial path
  });
 
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}
 
module.exports = storeData;