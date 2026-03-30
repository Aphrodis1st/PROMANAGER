// Run this script to fix the admin with null ID
// node fix-admin-id.js

import { db } from './utils/firebase.js';

async function fixAdminId() {
  try {
    console.log('Fixing admin with null ID...');
    
    // Find admin with null ID
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', 'ngiriyezadavidadmh@gmail.com')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      console.log('Admin not found');
      return;
    }
    
    const doc = snapshot.docs[0];
    const adminData = doc.data();
    
    console.log('Found admin:', {
      docId: doc.id,
      currentId: adminData.id,
      email: adminData.email
    });
    
    // Update the admin to remove the null id field
    await db().collection('hospitalAdmins').doc(doc.id).update({
      updatedAt: new Date()
    });
    
    // Remove the id field if it exists and is null
    if (adminData.id === null) {
      await db().collection('hospitalAdmins').doc(doc.id).update({
        id: db().FieldValue.delete(),
        updatedAt: new Date()
      });
    }
    
    console.log('Admin ID fixed successfully');
    
    // Verify the fix
    const updatedDoc = await db().collection('hospitalAdmins').doc(doc.id).get();
    const updatedData = updatedDoc.data();
    console.log('Updated admin:', {
      docId: updatedDoc.id,
      hasIdField: 'id' in updatedData,
      idValue: updatedData.id,
      email: updatedData.email
    });
    
  } catch (error) {
    console.error('Error fixing admin ID:', error);
  }
}

fixAdminId();