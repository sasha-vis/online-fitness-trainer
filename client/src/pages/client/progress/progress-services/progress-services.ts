import { db, storage } from '@/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
    where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BodyMeasurement } from '@shared/stores/user/progress/progress-types';

export async function uploadImage(file: File, clientId: string): Promise<string> {
    const storageRef = ref(storage, `bodyMeasurements/${clientId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

export async function addMeasurement(
    data: Omit<BodyMeasurement, 'id' | 'createdAt'>
): Promise<string> {
    const docRef = await addDoc(collection(db, 'bodyMeasurements'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}
export const updateMeasurement = async (id: string, data: Partial<BodyMeasurement>) => {
    const docRef = doc(db, 'bodyMeasurements', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteMeasurement = async (id: string) => {
    const docRef = doc(db, 'bodyMeasurements', id);
    await deleteDoc(docRef);
};

export async function getMeasurementById(id: string): Promise<BodyMeasurement | null> {
    const docSnap = await getDoc(doc(db, 'bodyMeasurements', id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as BodyMeasurement;
}

export function subscribeMeasurements(
    clientId: string,
    callback: (data: BodyMeasurement[]) => void
) {
    const q = query(
        collection(db, 'bodyMeasurements'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        })) as BodyMeasurement[];
        callback(data);
    });
}
