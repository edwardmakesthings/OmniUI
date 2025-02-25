import { useState } from "react";
import { Drawer, IconButton, Panel, PushButton, XIcon } from "@/components/ui";

export const DrawerExamples = () => {
    const [leftDrawer, setLeftDrawer] = useState(false);
    const [rightDrawer, setRightDrawer] = useState(false);
    const [rightUnstyledDrawer, setRightUnstyledDrawer] = useState(false);
    const [topDrawer, setTopDrawer] = useState(false);

    return (
        <div className="space-y-6">
            {/* Left Drawer Example */}
            <PushButton onClick={() => setLeftDrawer(true)}>
                Left Drawer
            </PushButton>
            <Drawer
                open={leftDrawer}
                onClose={() => setLeftDrawer(false)} // This function will be called by backdrop click and Escape
                variant="left"
                width={480}
                showOverlay={false}
            >
                <div className="flex flex-col h-screen">
                    {/* Header - Fixed height */}
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral shrink-0">
                        <h2 className="text-lg font-bold">Drawer Title</h2>
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setLeftDrawer(false)}
                        />
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Demo content */}
                        {Array.from({ length: 50 }, (_, i) => (
                            <div
                                key={i}
                                className="mb-4 p-4 bg-bg-dark-darker border border-accent-dark-neutral rounded"
                            >
                                <h3 className="text-font-dark font-medium">
                                    Item {i + 1}
                                </h3>
                                <p className="text-font-dark-muted mt-2">
                                    This is a long content item that
                                    demonstrates proper scrolling behavior in
                                    the drawer content area.
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer - Fixed height */}
                    <div className="flex justify-end gap-2 p-4 border-t border-accent-dark-neutral shrink-0">
                        <PushButton
                            variant="ghost"
                            onClick={() => setLeftDrawer(false)}
                        >
                            Cancel
                        </PushButton>
                        <PushButton variant="bright">Save</PushButton>
                    </div>
                </div>
            </Drawer>

            {/* Right Drawer Unstyled Example */}
            <PushButton onClick={() => setRightUnstyledDrawer(true)}>
                Right Drawer (Unstyled)
            </PushButton>
            <Drawer
                open={rightUnstyledDrawer}
                onClose={() => setRightUnstyledDrawer(false)}
                variant="right"
                width={400}
            >
                <Panel header="Unstyled Test">
                    <p>Unstyled right drawer content with custom width.</p>
                </Panel>
            </Drawer>

            {/* Right Drawer Example */}
            <PushButton onClick={() => setRightDrawer(true)}>
                Right Drawer
            </PushButton>
            <Drawer
                open={rightDrawer}
                onClose={() => setRightDrawer(false)}
                variant="right"
                width={400}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                        <h2 className="text-lg font-bold">Settings</h2>
                        {/* Fixed: Properly calling setRightDrawer */}
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setRightDrawer(false)}
                        />
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <p>Right drawer content with custom width.</p>
                    </div>
                </div>
            </Drawer>

            {/* Top Drawer Example */}
            <PushButton onClick={() => setTopDrawer(true)}>
                Top Drawer
            </PushButton>
            <Drawer
                open={topDrawer}
                onClose={() => setTopDrawer(false)}
                variant="top"
                height={320}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                        <h2 className="text-lg font-bold">Notifications</h2>
                        {/* Fixed: Properly calling setTopDrawer */}
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setTopDrawer(false)}
                        />
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <p>Top drawer content with custom height.</p>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default DrawerExamples;
