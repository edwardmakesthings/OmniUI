import { useState } from "react";
import { Modal, PushButton, ScrollBox, SearchIcon } from "@/components/ui";

export const ModalExamples = () => {
    const [basicModal, setBasicModal] = useState(false);
    const [complexModal, setComplexModal] = useState(false);

    return (
        <div className="space-y-6 ">
            {/* Basic Modal */}
            <PushButton variant="bright" onClick={() => setBasicModal(true)}>
                Open Basic Modal
            </PushButton>

            <Modal
                open={basicModal}
                onClose={() => setBasicModal(false)}
                title={
                    <h2 className="text-lg font-medium text-font-dark">
                        Basic Modal
                    </h2>
                }
                footer={
                    <div className="flex justify-end space-x-3">
                        <PushButton
                            variant="ghost"
                            onClick={() => setBasicModal(false)}
                        >
                            Cancel
                        </PushButton>
                        <PushButton
                            variant="bright"
                            onClick={() => setBasicModal(false)}
                        >
                            Confirm
                        </PushButton>
                    </div>
                }
                className="bg-bg-dark"
            >
                <div className="p-6">
                    <p className="text-font-dark">
                        This is a basic modal with header and footer.
                    </p>
                    <p className="text-font-dark-muted mt-3">
                        Additional content can be added here.
                    </p>
                </div>
            </Modal>

            {/* Complex Modal */}
            <PushButton variant="ghost" onClick={() => setComplexModal(true)}>
                Open Complex Modal
            </PushButton>

            <Modal
                open={complexModal}
                onClose={() => setComplexModal(false)}
                variant="elevated"
                width={600}
                title={
                    <div className="flex items-center space-x-3">
                        <SearchIcon className="text-font-dark" />
                        <h2 className="text-lg font-medium text-font-dark">
                            Search Results
                        </h2>
                    </div>
                }
                footer={
                    <div className="flex justify-between items-center w-full">
                        <span className="text-font-dark-muted text-sm">
                            Showing 20 of 100 results
                        </span>
                        <div className="space-x-3 flex">
                            <PushButton
                                variant="ghost"
                                onClick={() => setComplexModal(false)}
                            >
                                Cancel
                            </PushButton>
                            <PushButton
                                variant="bright"
                                onClick={() => setComplexModal(false)}
                            >
                                Apply
                            </PushButton>
                        </div>
                    </div>
                }
                className="bg-bg-dark-darker"
            >
                <ScrollBox maxHeight={400}>
                    <div className="divide-y divide-accent-dark-neutral">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div
                                key={i}
                                className="p-0.5 hover:bg-bg-dark transition-colors"
                            >
                                <h3 className="text-font-dark font-medium">
                                    Result Item {i + 1}
                                </h3>
                                <p className="text-font-dark-muted mt-1">
                                    Description for result item {i + 1}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollBox>
            </Modal>
        </div>
    );
};

export default ModalExamples;
