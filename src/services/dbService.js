import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves/updates user profile inside Firestore document: users/{uid}
 */
export async function saveUserProfile(uid, profileData) {
  if (!uid) return;
  const docRef = doc(db, 'users', uid);
  const data = {
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  // Clean empty/undefined fields
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) delete data[key];
  });

  try {
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw new Error('Failed to save profile details. Please try again.');
  }
}

/**
 * Retrieves user profile document: users/{uid}
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  const docRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error reading user profile from Firestore:', error);
    throw new Error('Failed to load profile details. Please try again.');
  }
}

/**
 * Resets user profile data in Firestore: users/{uid}
 */
export async function clearUserProfile(uid) {
  if (!uid) return;
  const docRef = doc(db, 'users', uid);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting user profile from Firestore:', error);
    throw new Error('Failed to reset profile details. Please try again.');
  }
}

/**
 * Saves chat history to users/{uid}/chats/history
 */
export async function saveChatHistory(uid, messages) {
  if (!uid) return;
  const docRef = doc(db, 'users', uid, 'chats', 'history');
  try {
    await setDoc(docRef, { messages, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving chat history to Firestore:', error);
    throw new Error('Failed to save chat log.');
  }
}

/**
 * Gets chat history from users/{uid}/chats/history
 */
export async function getChatHistory(uid) {
  if (!uid) return [];
  const docRef = doc(db, 'users', uid, 'chats', 'history');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().messages || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading chat history from Firestore:', error);
    throw new Error('Failed to load chat log.');
  }
}

/**
 * Deletes chat history document
 */
export async function clearChatHistory(uid) {
  if (!uid) return;
  const docRef = doc(db, 'users', uid, 'chats', 'history');
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting chat history from Firestore:', error);
    throw new Error('Failed to clear chat log.');
  }
}

/**
 * Saves specific progress segment (roadmap, projects, interview) to Firestore users/{uid}
 */
export async function saveUserProgress(uid, type, progressData) {
  if (!uid) return;
  const docRef = doc(db, 'users', uid);
  try {
    await setDoc(
      docRef,
      {
        progress: {
          [type]: progressData
        }
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error saving ${type} progress to Firestore:`, error);
    throw new Error(`Failed to save ${type} progress.`);
  }
}

/**
 * Loads entire progress block from users/{uid}
 */
export async function getUserProgress(uid) {
  if (!uid) return {};
  const docRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().progress || {};
    }
    return {};
  } catch (error) {
    console.error('Error loading progress from Firestore:', error);
    throw new Error('Failed to load progress parameters.');
  }
}
