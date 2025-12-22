import { create } from 'zustand';
import {
    fetchClients,
    assignTrainerToClient,
    updateClient,
    fetchClientById,
} from '@pages/trainer/trainer-services/trainer-services';

export const useTrainerStore = create((set) => ({
    clients: [],
    selectedClient: null,
    loading: false,
    error: null,
    fetchClient: async (id: string) => {
        const client = await fetchClientById(id);
        set({ selectedClient: client });
    },
    fetchClients: async () => {
        set({ loading: true, error: null });
        try {
            const clients = await fetchClients();
            set({ clients, loading: false });
        } catch (e) {
            set({ error: e.message, loading: false });
        }
    },
    assignTrainer: async (clientId: string, trainer: any) => {
        set({ loading: true });
        try {
            await assignTrainerToClient(clientId, trainer);
            set((state: any) => ({
                clients: state.clients.map((c: any) =>
                    c.id === clientId
                        ? {
                              ...c,
                              trainerId: trainer.id,
                              trainerName: trainer.name,
                              trainerEmail: trainer.email,
                          }
                        : c
                ),
                loading: false,
            }));
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, loading: false });
            } else {
                return e;
            }
        }
    },
    removeTrainer: async (clientId: string) => {
        await updateClient(clientId, {
            trainerId: null,
            trainerName: null,
            trainerEmail: null,
        });
    },
    assignPlan: async (clientId: string, planType: string, planData: unknown) => {
        await updateClient(clientId, { [planType]: planData });
        set((state: any) => ({
            selectedClient:
                state.selectedClient && state.selectedClient.id === clientId
                    ? { ...state.selectedClient, [planType]: planData }
                    : state.selectedClient,
        }));
    },
}));
