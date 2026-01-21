
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { MandalaData, User, CheeringMessage } from '../types';

// Web App's Firebase configuration
// For this demo, we will use individual env vars or Expect the user to fill this part
// adapting to Vite env vars pattern
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config is present
const app = (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.projectId !== 'YOUR_PROJECT_ID')
    ? initializeApp(firebaseConfig)
    : null;

const db = app ? getFirestore(app) : null;

const COLLECTIONS = {
    USERS: 'users',
    MANDALAS: 'mandalas',
    MESSAGES: 'messages'
};

export const firebaseService = {
    // Check if connected
    isConnected: () => !!db,

    // Users
    getUsers: async (): Promise<User[]> => {
        if (!db) return [];

        try {
            const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'asc'));
            const querySnapshot = await getDocs(q);

            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    name: data.name,
                    avatarColor: data.avatarColor,
                    mainGoal: data.mainGoal
                });
            });
            return users;
        } catch (e) {
            console.warn("Firebase fetch users error:", e);
            throw e;
        }
    },

    createUser: async (user: User) => {
        if (!db) return;
        try {
            // Use setDoc with specific ID to easier matching
            await setDoc(doc(db, COLLECTIONS.USERS, user.id), {
                name: user.name,
                avatarColor: user.avatarColor,
                mainGoal: user.mainGoal,
                createdAt: Timestamp.now()
            });
        } catch (e) {
            console.error("Firebase create user error:", e);
        }
    },

    deleteUser: async (userId: string) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.USERS, userId));

            // Delete associated mandala
            await deleteDoc(doc(db, COLLECTIONS.MANDALAS, userId));

            // Delete messages (fetch then delete needed for FireStore unless we use batch or subcollections)
            // For simple MVP we iterate query
            const msgQuery = query(collection(db, COLLECTIONS.MESSAGES), where("userId", "==", userId));
            const msgSnapshot = await getDocs(msgQuery);
            msgSnapshot.forEach(async (d) => {
                await deleteDoc(d.ref);
            });
        } catch (e) {
            console.error("Firebase delete user error:", e);
        }
    },

    // Mandalas
    getMandala: async (userId: string): Promise<MandalaData | null> => {
        if (!db) return null;
        try {
            const docRef = doc(db, COLLECTIONS.MANDALAS, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().data as MandalaData;
            }
            return null;
        } catch (e) {
            console.error("Firebase fetch mandala error:", e);
            throw e;
        }
    },

    saveMandala: async (userId: string, data: MandalaData) => {
        if (!db) return;
        try {
            await setDoc(doc(db, COLLECTIONS.MANDALAS, userId), {
                data: data,
                updatedAt: Timestamp.now()
            }, { merge: true });
        } catch (e) {
            console.error("Firebase save mandala error:", e);
            throw e;
        }
    },

    // Messages
    getMessages: async (userId: string): Promise<CheeringMessage[]> => {
        if (!db) return [];
        try {
            const q = query(collection(db, COLLECTIONS.MESSAGES), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const msgs: CheeringMessage[] = [];
            querySnapshot.forEach((d) => {
                const data = d.data();
                msgs.push({
                    id: d.id,
                    text: data.text,
                    author: data.author,
                    style: data.style // JSON object stored as map in Firestore
                });
            });
            return msgs;
        } catch (e) {
            console.warn("Firebase fetch msg error:", e);
            throw e;
        }
    },

    addMessage: async (userId: string, message: CheeringMessage) => {
        if (!db) return;
        try {
            await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), {
                userId: userId,
                text: message.text,
                author: message.author,
                style: message.style,
                createdAt: Timestamp.now()
            });
        } catch (e) {
            console.error("Firebase save mandala error:", e);
            throw e;
        }
    },

    deleteMessage: async (msgId: string) => {
        if (!db) return;
        try {
            await deleteDoc(doc(db, COLLECTIONS.MESSAGES, msgId));
        } catch (e) {
            console.error("Firebase delete msg error:", e);
        }
    }
};
