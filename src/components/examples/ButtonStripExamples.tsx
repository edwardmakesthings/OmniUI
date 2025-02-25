import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BellFilledIcon,
    BellIcon,
    BoldIcon,
    ButtonStrip,
    CheckIcon,
    IconButton,
    ItalicIcon,
    MoonIcon,
    PauseIcon,
    PlayIcon,
    PushButton,
    SaveIcon,
    UnderlineIcon,
} from "../ui";

export const ButtonStripExamples = () => {
    return (
        <div className="space-y-6">
            {/* IconButton with states */}
            <IconButton
                icon={<BellIcon />}
                states={{
                    count: 2,
                    icons: [<BellIcon />, <BellFilledIcon />],
                    tooltips: ["Enable Notifications", "Disable Notifications"],
                    variants: ["default", "bright"],
                }}
                onStateChange={(state) =>
                    console.log(`Notification state: ${state}`)
                }
            />

            {/* PushButton with states */}
            <PushButton
                states={{
                    count: 3,
                    labels: ["Initial", "Processing", "Complete"],
                    startIcons: [<PlayIcon />, <PauseIcon />, <CheckIcon />],
                    variants: ["default", "ghost", "bright"],
                }}
                onStateChange={(state) => console.log(`Button state: ${state}`)}
            >
                Initial
            </PushButton>

            {/* ButtonStrip for text formatting */}
            <ButtonStrip
                items={[
                    { id: "bold", icon: <BoldIcon />, tooltip: "Bold" },
                    { id: "italic", icon: <ItalicIcon />, tooltip: "Italic" },
                    {
                        id: "underline",
                        icon: <UnderlineIcon />,
                        tooltip: "Underline",
                    },
                ]}
                selectionMode="multiple"
                onSelectionChange={(selected) =>
                    console.log("Text format:", selected)
                }
            />

            {/* ButtonStrip for alignment selection */}
            <ButtonStrip
                items={[
                    {
                        id: "left",
                        icon: <AlignLeftIcon />,
                        tooltip: "Align Left",
                    },
                    {
                        id: "center",
                        icon: <AlignCenterIcon />,
                        tooltip: "Align Center",
                    },
                    {
                        id: "right",
                        icon: <AlignRightIcon />,
                        tooltip: "Align Right",
                    },
                ]}
                selectionMode="single"
                defaultSelected={["left"]}
                onSelectionChange={(selected) =>
                    console.log("Alignment:", selected[0])
                }
            />

            {/* ButtonStrip with toggle mode */}
            <ButtonStrip
                items={[
                    {
                        id: "notifications",
                        icon: <BellIcon />,
                        tooltip: "Toggle Notifications",
                    },
                    {
                        id: "darkMode",
                        icon: <MoonIcon />,
                        tooltip: "Toggle Dark Mode",
                    },
                    {
                        id: "autoSave",
                        icon: <SaveIcon />,
                        tooltip: "Toggle Auto Save",
                    },
                ]}
                selectionMode="toggle"
                onSelectionChange={(selected) => {
                    // selected will be either [] or [buttonId]
                    const feature = selected[0];
                    if (feature) {
                        console.log(`Enabled: ${feature}`);
                    } else {
                        console.log("All features disabled");
                    }
                }}
            />
        </div>
    );
};

export default ButtonStripExamples;
