// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
// Explicitly import from 'firebase/auth/react-native' as per Firebase docs for RN persistence
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut as firebaseSignOut } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, addDoc, query, where, getDocs, arrayUnion, orderBy, limit } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Export other Firebase services
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);

// Re-export some auth functions for convenience if they are directly used by helper
export { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, firebaseSignOut };
// Re-export some firestore functions for convenience
export { collection, doc, getDoc, setDoc, updateDoc, addDoc, query, where, getDocs, arrayUnion, orderBy, limit };

// Authentication helpers
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

export const signUp = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Firestore helpers
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(collection(firestore, 'users'), user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        email,
        displayName,
        photoURL,
        createdAt,
        lastLogin: createdAt
      });
    } catch (error) {
      console.error("Error creating user profile", error);
    }
  } else {
    // Update last login
    await updateDoc(userRef, {
      lastLogin: new Date()
    });
  }

  return userRef;
};

// Workspace helpers
export const createWorkspace = async (name, userId) => {
  try {
    const workspaceRef = doc(collection(firestore, 'workspaces'));
    const createdAt = new Date();
    
    await setDoc(workspaceRef, {
      name,
      createdBy: userId,
      createdAt,
      updatedAt: createdAt,
      members: arrayUnion({
        userId,
        role: 'admin',
        joinedAt: createdAt
      })
    });
    
    return workspaceRef.id;
  } catch (error) {
    console.error("Error creating workspace", error);
    throw error;
  }
};

export const getWorkspaces = async (userId) => {
  try {
    const workspacesQuery = await getDocs(query(collection(firestore, 'workspaces'), where('members', 'array-contains', { userId, role: 'admin' })));
    
    return workspacesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting workspaces", error);
    throw error;
  }
};

export const inviteToWorkspace = async (workspaceId, email) => {
  try {
    // In a real app, this would be a Cloud Function
    const userQuery = await getDocs(query(collection(firestore, 'users'), where('email', '==', email)));
    
    if (userQuery.empty) {
      throw new Error("User not found");
    }
    
    const userId = userQuery.docs[0].id;
    const workspaceRef = doc(collection(firestore, 'workspaces'), workspaceId);
    
    await updateDoc(workspaceRef, {
      members: arrayUnion({
        userId,
        role: 'member',
        joinedAt: new Date()
      })
    });
    
    // Create notification
    await addDoc(collection(firestore, 'notifications'), {
      type: 'workspace_invitation',
      userId,
      relatedId: workspaceId,
      read: false,
      createdAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error inviting to workspace", error);
    throw error;
  }
};

// Task list helpers
export const createTaskList = async (workspaceId, title, userId) => {
  try {
    const taskListRef = doc(collection(firestore, 'taskLists'));
    const createdAt = new Date();
    
    await setDoc(taskListRef, {
      workspaceId,
      title,
      createdBy: userId,
      createdAt,
      updatedAt: createdAt
    });
    
    return taskListRef.id;
  } catch (error) {
    console.error("Error creating task list", error);
    throw error;
  }
};

export const getTaskLists = async (workspaceId) => {
  try {
    const taskListsQuery = await getDocs(query(collection(firestore, 'taskLists'), where('workspaceId', '==', workspaceId)));
    
    return taskListsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting task lists", error);
    throw error;
  }
};

// Task helpers
export const createTask = async (listId, title, description, userId) => {
  try {
    const taskRef = doc(collection(firestore, 'tasks'));
    const createdAt = new Date();
    
    await setDoc(taskRef, {
      listId,
      title,
      description,
      assignedTo: null,
      createdBy: userId,
      createdAt,
      updatedAt: createdAt,
      completed: false,
      completedAt: null,
      completedBy: null
    });
    
    return taskRef.id;
  } catch (error) {
    console.error("Error creating task", error);
    throw error;
  }
};

export const getTasks = async (listId) => {
  try {
    const tasksQuery = await getDocs(query(collection(firestore, 'tasks'), where('listId', '==', listId)));
    
    return tasksQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting tasks", error);
    throw error;
  }
};

export const assignTask = async (taskId, userId) => {
  try {
    const taskRef = doc(collection(firestore, 'tasks'), taskId);
    
    await updateDoc(taskRef, {
      assignedTo: userId,
      updatedAt: new Date()
    });
    
    // Create notification
    await addDoc(collection(firestore, 'notifications'), {
      type: 'task_assigned',
      userId,
      relatedId: taskId,
      read: false,
      createdAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error assigning task", error);
    throw error;
  }
};

export const completeTask = async (taskId, userId) => {
  try {
    const taskRef = doc(collection(firestore, 'tasks'), taskId);
    const completedAt = new Date();
    
    await updateDoc(taskRef, {
      completed: true,
      completedAt,
      completedBy: userId,
      updatedAt: completedAt
    });
    
    // Get task details for notification
    const taskDoc = await getDoc(taskRef);
    const task = { id: taskDoc.id, ...taskDoc.data() };
    
    // Get workspace members for notifications
    const taskListDoc = await getDoc(doc(collection(firestore, 'taskLists'), task.listId));
    const taskList = taskListDoc.data();
    
    const workspaceDoc = await getDoc(doc(collection(firestore, 'workspaces'), taskList.workspaceId));
    const workspace = workspaceDoc.data();
    
    // Create notifications for all workspace members except the completer
    const notificationPromises = workspace.members
      .filter(member => member.userId !== userId)
      .map(member => 
        addDoc(collection(firestore, 'notifications'), {
          type: 'task_completed',
          userId: member.userId,
          relatedId: taskId,
          read: false,
          createdAt: new Date()
        })
      );
    
    await Promise.all(notificationPromises);
    
    return true;
  } catch (error) {
    console.error("Error completing task", error);
    throw error;
  }
};

// Notification helpers
export const getNotifications = async (userId) => {
  try {
    const notificationsQuery = await getDocs(query(collection(firestore, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(20)));
    
    return notificationsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting notifications", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(collection(firestore, 'notifications'), notificationId), {
      read: true
    });
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw error;
  }
};
