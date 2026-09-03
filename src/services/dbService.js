import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

// In-memory profile cache to prevent duplicate Firestore roundtrips
const profileCache = new Map();

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

  // Update memory and local storage cache immediately
  profileCache.set(uid, data);
  try {
    localStorage.setItem(`futurealign_profile_${uid}`, JSON.stringify(data));
  } catch (e) {
    // Ignore local storage quota errors
  }

  try {
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw new Error('Failed to save profile details. Please try again.');
  }
}

/**
 * Retrieves user profile document: users/{uid} with memory & local caching
 */
export async function getUserProfile(uid, { forceRefresh = false } = {}) {
  if (!uid) return null;

  // 1. Fast path: in-memory cache
  if (!forceRefresh && profileCache.has(uid)) {
    return profileCache.get(uid);
  }

  // 2. Fast path: localStorage cache
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(`futurealign_profile_${uid}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        profileCache.set(uid, parsed);
        return parsed;
      }
    } catch (e) {
      // Fall through to Firestore
    }
  }

  // 3. Network path: Firestore with 5s timeout protection
  const docRef = doc(db, 'users', uid);
  try {
    const fetchPromise = getDoc(docRef);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 5000)
    );
    const docSnap = await Promise.race([fetchPromise, timeoutPromise]);

    if (docSnap.exists()) {
      const data = docSnap.data();
      profileCache.set(uid, data);
      try {
        localStorage.setItem(`futurealign_profile_${uid}`, JSON.stringify(data));
      } catch (e) {}
      return data;
    }
    return null;
  } catch (error) {
    console.warn('Firestore getUserProfile error or timeout:', error.message);
    // Fall back to cached local data if available
    try {
      const cached = localStorage.getItem(`futurealign_profile_${uid}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  }
}

/**
 * Resets user profile data in Firestore: users/{uid}
 */
export async function clearUserProfile(uid) {
  if (!uid) return;
  profileCache.delete(uid);
  try {
    localStorage.removeItem(`futurealign_profile_${uid}`);
  } catch (e) {}

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
