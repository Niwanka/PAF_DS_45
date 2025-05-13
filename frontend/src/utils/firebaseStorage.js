import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadFileToFirebase = async (file, userId) => {
  if (!file || !userId) {
    throw new Error('File and userId are required');
  }

  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `posts/${userId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw new Error('Failed to upload file to storage');
  }
};