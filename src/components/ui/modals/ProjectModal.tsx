import React from "react";
import { Modal } from "@/components/ui/atoms";

export interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ProjectModal - Handles project-related operations
 */
export const ProjectModal: React.FC<ProjectModalProps> = ({
    isOpen,
    onClose,
}) => {
    // You could access modal data here if needed
    // const { getModalData } = useModal();
    // const data = getModalData('project');

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Project Options"
            width={500}
            footer={
                <div className="flex justify-end">
                    <button
                        className="px-3 py-1 text-font-dark hover:text-font-light"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            }
        >
            <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Project Management</h3>
                <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                        New Project
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                        Open Project
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                        Save Project
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-accent-dark-bright hover:bg-accent-dark-bright-hover text-font-dark rounded">
                        Export
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectModal;
