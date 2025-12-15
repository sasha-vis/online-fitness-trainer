import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { db } from '@/firebase';

export async function fetchClients() {
    const q = query(collection(db, 'users'), where('role', '==', 'client'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function assignTrainerToClient(clientId: string, trainer) {
    await updateDoc(doc(db, 'users', clientId), {
        trainerId: trainer.id,
        trainerName: trainer.name,
        trainerEmail: trainer.email,
    });
}
export async function fetchClientById(id: string) {
    const ref = doc(db, 'users', id);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? { id, ...docSnap.data() } : null;
}

export async function updateClient(id: string, data) {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, data);
}
