import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase.ts';

export interface NutritionAssignment {
    id: string;
    clientId: string;
    trainerId: string;
    templateId: string;
    customNotes: string;
    createdAt?: Date;
    assignedAt?: Date;
}

export async function getNutritionAssignment(uid: string): Promise<NutritionAssignment | null> {
    const q = query(
        collection(db, 'nutritionAssignments'),
        where('clientId', '==', uid)
    );

    const snap = await getDocs(q);

    if (snap.empty) return null;
    const docSnap = snap.docs[0];

    return docSnap.data() as NutritionAssignment;
}
