import {doc, getDoc, updateDoc, deleteField, setDoc} from 'firebase/firestore';
import { db } from '@/firebase.ts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {IUser, IUserInfo, UpdateUserPayload} from "@pages/personal-account/types.ts";

export async function getUserByUid(uid: string): Promise<IUser | null> {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data() as IUser;
}

export async function getUserInfo(uid: string): Promise<IUserInfo | null> {
    const q = query(
        collection(db, 'clientProfiles'),
        where('userId', '==', uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].data() as IUserInfo;
}


export async function updateUserByUid(
    uid: string,
    payload: UpdateUserPayload
): Promise<IUser> {
    const userRef = doc(db, 'users', uid);

    const userUpdateData: Record<string, any> = {
        name: payload.name,
        surname: payload.surname,
        email: payload.email,
        phone: payload.phone ?? deleteField(),
        updatedAt: new Date(),
    };

    await updateDoc(userRef, userUpdateData);

    if ('height' in payload) {
        await updateClientProfileByUserId(uid, { height: payload.height });
    }

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        throw new Error('Пользователь не найден');
    }

    return snap.data() as IUser;
}

export async function updateClientProfileByUserId(
    userId: string,
    payload: { height?: number | null; [key: string]: any }
) {
    const q = query(collection(db, 'clientProfiles'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error('Пользователь не найден');
    }

    const docRef = snapshot.docs[0].ref;

    const updateData: Record<string, any> = { ...payload, updatedAt: new Date() };

    updateData.height = payload.height ?? deleteField();

    await setDoc(docRef, updateData, { merge: true });
}

