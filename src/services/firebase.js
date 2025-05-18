// Firebase configuration and initialization
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';

// Firebase configuration - in a real app, these would be environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBgo7yBBVI7yIjm6faNpZ4m2b_qCpGmcOw",
  authDomain: "com.collabtodo.app",
  projectId: "collabtodo-7dee0",
  storageBucket: "collaborative-todo-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:770967504920:android:452b882595d280c4a35b6d"
};

// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase services
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const functions = firebase.functions();
export const messaging = firebase.messaging();

// Authentication helpers
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

export const signUp = async (email, password, displayName) => {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    await result.user.updateProfile({ displayName });
    return result.user;
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Firestore helpers
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = firestore.collection('users').doc(user.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await userRef.set({
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
    await userRef.update({
      lastLogin: new Date()
    });
  }

  return userRef;
};

// Workspace helpers
export const createWorkspace = async (name, userId) => {
  try {
    const workspaceRef = firestore.collection('workspaces').doc();
    const createdAt = new Date();
    
    await workspaceRef.set({
      name,
      createdBy: userId,
      createdAt,
      updatedAt: createdAt,
      members: [{
        userId,
        role: 'admin',
        joinedAt: createdAt
      }]
    });
    
    return workspaceRef.id;
  } catch (error) {
    console.error("Error creating workspace", error);
    throw error;
  }
};

export const getWorkspaces = async (userId) => {
  try {
    const workspacesQuery = await firestore
      .collection('workspaces')
      .where('members', 'array-contains', { userId, role: 'admin' })
      .get();
    
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
    const userQuery = await firestore
      .collection('users')
      .where('email', '==', email)
      .get();
    
    if (userQuery.empty) {
      throw new Error("User not found");
    }
    
    const userId = userQuery.docs[0].id;
    const workspaceRef = firestore.collection('workspaces').doc(workspaceId);
    
    await workspaceRef.update({
      members: firebase.firestore.FieldValue.arrayUnion({
        userId,
        role: 'member',
        joinedAt: new Date()
      })
    });
    
    // Create notification
    await firestore.collection('notifications').add({
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
    const taskListRef = firestore.collection('taskLists').doc();
    const createdAt = new Date();
    
    await taskListRef.set({
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
    const taskListsQuery = await firestore
      .collection('taskLists')
      .where('workspaceId', '==', workspaceId)
      .get();
    
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
    const taskRef = firestore.collection('tasks').doc();
    const createdAt = new Date();
    
    await taskRef.set({
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
    const tasksQuery = await firestore
      .collection('tasks')
      .where('listId', '==', listId)
      .get();
    
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
    const taskRef = firestore.collection('tasks').doc(taskId);
    
    await taskRef.update({
      assignedTo: userId,
      updatedAt: new Date()
    });
    
    // Create notification
    await firestore.collection('notifications').add({
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
    const taskRef = firestore.collection('tasks').doc(taskId);
    const completedAt = new Date();
    
    await taskRef.update({
      completed: true,
      completedAt,
      completedBy: userId,
      updatedAt: completedAt
    });
    
    // Get task details for notification
    const taskDoc = await taskRef.get();
    const task = { id: taskDoc.id, ...taskDoc.data() };
    
    // Get workspace members for notifications
    const taskListDoc = await firestore.collection('taskLists').doc(task.listId).get();
    const taskList = taskListDoc.data();
    
    const workspaceDoc = await firestore.collection('workspaces').doc(taskList.workspaceId).get();
    const workspace = workspaceDoc.data();
    
    // Create notifications for all workspace members except the completer
    const notificationPromises = workspace.members
      .filter(member => member.userId !== userId)
      .map(member => 
        firestore.collection('notifications').add({
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
    const notificationsQuery = await firestore
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
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
    await firestore.collection('notifications').doc(notificationId).update({
      read: true
    });
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw error;
  }
};

export default firebase;
