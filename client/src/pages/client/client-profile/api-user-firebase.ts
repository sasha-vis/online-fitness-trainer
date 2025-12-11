import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.ts';

export interface FirebaseUser {
    id: string;
    name: string;
    surname: string;
    height?: number;
    email: string;
    phone?: string;
    avatar?: string;
}

export async function getUserByUid(uid: string): Promise<FirebaseUser | null> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data() as FirebaseUser;
}
