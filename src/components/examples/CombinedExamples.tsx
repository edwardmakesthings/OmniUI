import ButtonStripExamples from "./ButtonStripExamples";
import DrawerExamples from "./DrawerExamples";
import DropdownPanelExamples from "./DropdownPanelExamples";
import ListViewExamples from "./ListViewExamples";
import ModalExamples from "./ModalExamples";
import PanelExamples from "./PanelExamples";
import ScrollBoxExamples from "./ScrollboxExamples";
import TabsExamples from "./TabsExamples";
import TreeViewExamples from "./TreeViewExamples";

export const ContainerExamples = () => {
    return (
        <div className="p-8 flex gap-4">
            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">Panel Examples</h2>
                <PanelExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">ScrollBox Examples</h2>
                <ScrollBoxExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-96">
                <h2 className="text-2xl font-bold mb-4">Drawer Examples</h2>
                <DrawerExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-96">
                <h2 className="text-2xl font-bold mb-4">Modal Examples</h2>
                <ModalExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">Tabs Examples</h2>
                <TabsExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-192">
                <h2 className="text-2xl font-bold mb-4">ListView Examples</h2>
                <ListViewExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-192">
                <h2 className="text-2xl font-bold mb-4">
                    Dropdown Panel Examples
                </h2>
                <DropdownPanelExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-192">
                <h2 className="text-2xl font-bold mb-4">TreeView Examples</h2>
                <TreeViewExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-192">
                <h2 className="text-2xl font-bold mb-4">
                    Buttons & Button Strip Examples
                </h2>
                <ButtonStripExamples />
            </section>
        </div>
    );
};

export default ContainerExamples;
