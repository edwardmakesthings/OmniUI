import React from "react";
import { Modal } from "@/components/ui/atoms";

export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * SettingsModal - Application settings configuration
 */
export const AppSettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Application Settings"
            width={600}
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 text-font-dark hover:text-font-light"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 bg-accent-dark-bright hover:bg-accent-dark-bright-hover text-font-dark rounded"
                        onClick={onClose}
                    >
                        Save Settings
                    </button>
                </div>
            }
        >
            <div className="p-4">
                <h3 className="text-lg font-medium mb-4">
                    Application Settings
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Dark Mode</span>
                        <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Auto Save</span>
                        <input type="checkbox" />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Show Grid</span>
                        <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Grid Size</span>
                        <select className="bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                            <option>10px</option>
                            <option>20px</option>
                            <option>40px</option>
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AppSettingsModal;
