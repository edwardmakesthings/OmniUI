import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import { ProjectHeader } from "@/components/ui/atoms/ProjectHeader";
import { Input } from "@/components/ui/atoms/Input";
import { EditIcon, SearchIcon } from "@/components/ui/icons";
import SearchBar from "@/components/ui/atoms/SearchBar/SearchBar";
import { DropdownSelect, Modal } from "@/components/ui/atoms";
import { PushButton } from "@/components/ui/atoms/PushButton";
import { Tabs } from "@/components/ui/atoms/Tabs";

const ComponentPanel = () => {
    const componentPaletteConfig = usePanelConfig("COMPONENT_PALETTE");

    return (
        <BasePanel {...componentPaletteConfig}>
            <h2 className="text-lg font-bold">Component Palette</h2>
            <Input prefix={<SearchIcon />} placeholder="Search" suffix="W" />
            <SearchBar />
            <ul>
                <li>BUTTONS!</li>
            </ul>
            <DropdownSelect
                label="Testing!"
                variant="default"
                multiple={true}
                onChange={(value) => {
                    console.log(value);
                }}
                options={[
                    {
                        label: "Change Project Name",
                        value: "Change Project Name",
                        onClick: () => {
                            console.log("HERE1");
                        },
                    },
                    {
                        label: "Change Project Name2",
                        value: "Change Project Name2",
                        onClick: () => {
                            console.log("HERE2");
                        },
                    },
                ]}
            />

            <Tabs
                variant="default"
                tabs={[
                    {
                        id: "tab1",
                        label: "First Tab",
                        content: (
                            <div>
                                <PushButton endIcon={EditIcon} variant="ghost">
                                    Continue
                                </PushButton>

                                <PushButton disabled>Unavailable</PushButton>
                            </div>
                        ),
                    },
                    {
                        id: "tab2",
                        label: "Second Tab",
                        content: (
                            <div>
                                <PushButton>Click Me</PushButton>

                                <PushButton
                                    startIcon={SearchIcon}
                                    variant="bright"
                                >
                                    Search
                                </PushButton>
                            </div>
                        ),
                        disabled: false,
                    },
                    {
                        id: "tab3",
                        label: "Third Tab",
                        content: <div>Third tab content</div>,
                    },
                ]}
                onTabChange={(tabId) => console.log(`Tab changed to: ${tabId}`)}
            />
            <Modal title="Test Modal" />
        </BasePanel>
    );
};

export default ComponentPanel;
