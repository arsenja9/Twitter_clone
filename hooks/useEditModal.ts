import {create} from "zustand";

interface useEditModalStore {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}

const useEditModal = create<useEditModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))

export default useEditModal;