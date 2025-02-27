import React from "react";
import { useModal } from "@/contexts/ModalContext";
import { ProjectModal } from "./ProjectModal";
import { AppSettingsModal } from "./AppSettingsModal";

/**
 * ModalContainer - Renders all application modals
 * Manages which modals are shown based on context state
 */
export const ModalContainer: React.FC = () => {
    const { isModalOpen, closeModal } = useModal();

    return (
        <>
            {/* Project Modal */}
            <ProjectModal
                isOpen={isModalOpen("project")}
                onClose={() => closeModal("project")}
            />

            {/* Settings Modal */}
            <AppSettingsModal
                isOpen={isModalOpen("settings")}
                onClose={() => closeModal("settings")}
            />
        </>
    );
};

export default ModalContainer;
