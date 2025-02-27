import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the types of modals your application will use
export type ModalType =
    | "project"
    | "settings"
    | "exportWidget"
    | "importWidget"
    | "confirmDelete";

// Define any additional data that might be passed to modals
export interface ModalData {
    [key: string]: any;
}

// Interface for the context
interface ModalContextType {
    // Open a modal with optional data
    openModal: (type: ModalType, data?: ModalData) => void;

    // Close a specific modal
    closeModal: (type: ModalType) => void;

    // Close all open modals
    closeAllModals: () => void;

    // Check if a modal is open
    isModalOpen: (type: ModalType) => boolean;

    // Get data for a specific modal
    getModalData: (type: ModalType) => ModalData | undefined;
}

// Create the context with undefined default value
export const ModalContext = createContext<ModalContextType | undefined>(
    undefined
);

// Props for the modal provider
interface ModalProviderProps {
    children: ReactNode;
}

/**
 * Modal Provider component - manages modal state throughout the application
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    // Track which modals are open
    const [openModals, setOpenModals] = useState<Set<ModalType>>(new Set());

    // Store associated data for each modal
    const [modalData, setModalData] = useState<
        Record<ModalType, ModalData | undefined>
    >({} as Record<ModalType, ModalData | undefined>);

    // Open a modal with optional data
    const openModal = (type: ModalType, data?: ModalData) => {
        setOpenModals((prev) => {
            const newSet = new Set(prev);
            newSet.add(type);
            return newSet;
        });

        if (data) {
            setModalData((prev) => ({
                ...prev,
                [type]: data,
            }));
        }
    };

    // Close a specific modal
    const closeModal = (type: ModalType) => {
        setOpenModals((prev) => {
            const newSet = new Set(prev);
            newSet.delete(type);
            return newSet;
        });
    };

    // Close all open modals
    const closeAllModals = () => {
        setOpenModals(new Set());
    };

    // Check if a modal is open
    const isModalOpen = (type: ModalType): boolean => {
        return openModals.has(type);
    };

    // Get data for a specific modal
    const getModalData = (type: ModalType): ModalData | undefined => {
        return modalData[type];
    };

    // Context value
    const value: ModalContextType = {
        openModal,
        closeModal,
        closeAllModals,
        isModalOpen,
        getModalData,
    };

    return (
        <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
    );
};

/**
 * Custom hook to use the modal context
 */
export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);

    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
};
