import { useState, useEffect } from "react";
import * as Icons from "./index";

type CategoryKey =
    | "UI"
    | "Navigation"
    | "Actions"
    | "Panels"
    | "Components"
    | "ComponentsSimple"
    | "Editor";

const categories: Record<CategoryKey, string[]> = {
    UI: [
        "CaretDownIcon",
        "XIcon",
        "CheckIcon",
        "LogoIcon",
        "MoonIcon",
        "StarIcon",
        "StarFilledIcon",
        "BellIcon",
        "BellFilledIcon",
    ],
    Navigation: [
        "SearchIcon",
        "FilterIcon",
        "FilterFilledIcon",
        "FileIcon",
        "FolderIcon",
    ],
    Actions: ["EditIcon", "GearIcon", "SaveIcon", "PlayIcon", "PauseIcon"],
    Panels: [
        "PropertyEditorIcon",
        "ComponentsIcon",
        "LayoutIcon",
        "WidgetsIcon",
        "ConnectionsIcon",
        "ThemeIcon",
        "DevToolsIcon",
    ],
    Components: [
        "CompDrawerIcon",
        "CompIconButtonIcon",
        "CompMenuDropdownIcon",
        "CompPanelIcon",
        "CompPushButtonIcon",
        "CompScrollBoxIcon",
        "CompTabsIcon",
        "CompToggleIcon",
    ],
    ComponentsSimple: [
        "WidgetIcon",
        "PanelIcon",
        "TabsIcon",
        "ButtonIcon",
        "InputIcon",
        "ReferenceIcon",
    ],
    Editor: [
        "ItalicIcon",
        "BoldIcon",
        "UnderlineIcon",
        "AlignLeftIcon",
        "AlignCenterIcon",
        "AlignRightIcon",
        "AlignJustifyIcon",
    ],
};

const IconGallery = ({ className }: { className?: string }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [iconSize, setIconSize] = useState(24);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [darkMode, setDarkMode] = useState(true);

    // Function to get all icon component names
    const getAllIconNames = () => {
        return Object.keys(Icons).filter(
            (name) =>
                typeof Icons[name as keyof typeof Icons] === "function" &&
                name.includes("Icon") &&
                name !== "IconGallery"
        );
    };

    const [allIcons, setAllIcons] = useState(getAllIconNames());

    useEffect(() => {
        // This could be useful if icons are loaded dynamically
        setAllIcons(getAllIconNames());
    }, []);

    // Filter icons based on search term and selected category
    const filteredIcons = allIcons.filter((iconName) => {
        const matchesSearch = iconName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" ||
            (categories[selectedCategory as CategoryKey] &&
                categories[selectedCategory as CategoryKey].includes(iconName));
        return matchesSearch && matchesCategory;
    });

    // Group icons by category
    const getIconsByCategory = () => {
        if (selectedCategory !== "All") {
            return {
                [selectedCategory]: filteredIcons,
            };
        }

        const grouped: Record<string, string[]> = { Uncategorized: [] };

        for (const iconName of filteredIcons) {
            let categorized = false;

            for (const [category, icons] of Object.entries(categories)) {
                if (icons.includes(iconName)) {
                    if (!grouped[category]) grouped[category] = [];
                    grouped[category].push(iconName);
                    categorized = true;
                    break;
                }
            }

            if (!categorized) {
                grouped.Uncategorized.push(iconName);
            }
        }

        return grouped;
    };

    const iconsByCategory = getIconsByCategory();

    const fontColor = darkMode
        ? "text-white placeholder:text-gray-400"
        : "text-gray-900 placeholder:text-gray-800";
    const bgColor = darkMode ? "bg-bg-dark" : "bg-bg-light";
    const borderColorSubtle = darkMode
        ? "border-bg-dark-lighter"
        : "border-bg-light-darker";
    const borderColorBright = darkMode
        ? "border-accent-dark-bright outline-accent-dark-bright ring-accent-dark-bright"
        : "border-accent-light-bright outline-accent-light-bright ring-accent-light-bright";

    return (
        <div
            className={`border-3 rounded-xl px-3 py-2 ${fontColor} ${bgColor} ${borderColorSubtle}
            } ${className}`}
        >
            <div>
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-3">Icon Gallery</h1>
                    <div className="flex items-start">
                        <button
                            className={`px-3 py-1 rounded text-sm font-medium border-1 hover:outline-3  ${borderColorBright}`}
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                    <div className="flex-2 min-w-48">
                        <label className="block text-xs font-medium mb-1">
                            Search Icons
                        </label>
                        <input
                            type="text"
                            className={`w-full p-1 border rounded text-sm focus:outline-none ${borderColorBright} focus:ring-2`}
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 min-w-32">
                        <label
                            htmlFor="icon-size-select"
                            className="block text-xs font-medium mb-1"
                        >
                            Icon Size
                        </label>
                        <select
                            id="icon-size-select"
                            className={`w-full p-1 border rounded text-sm focus:outline-none focus:ring-2 ${borderColorBright} focus:ring-2`}
                            value={iconSize}
                            onChange={(e) =>
                                setIconSize(Number(e.target.value))
                            }
                        >
                            <option
                                value="16"
                                className={`${bgColor} ${fontColor}`}
                            >
                                16px
                            </option>
                            <option
                                value="20"
                                className={`${bgColor} ${fontColor}`}
                            >
                                20px
                            </option>
                            <option
                                value="24"
                                className={`${bgColor} ${fontColor}`}
                            >
                                24px
                            </option>
                            <option
                                value="32"
                                className={`${bgColor} ${fontColor}`}
                            >
                                32px
                            </option>
                            <option
                                value="40"
                                className={`${bgColor} ${fontColor}`}
                            >
                                40px
                            </option>
                            <option
                                value="48"
                                className={`${bgColor} ${fontColor}`}
                            >
                                48px
                            </option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-32">
                        <label
                            htmlFor="category-select"
                            className="block text-xs font-medium mb-1"
                        >
                            Category
                        </label>
                        <select
                            id="category-select"
                            className={`w-full p-1 border rounded text-sm focus:outline-none focus:ring-2  ${borderColorBright} focus:ring-2`}
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            <option
                                value="All"
                                className={`${bgColor} ${fontColor}`}
                            >
                                All
                            </option>
                            {Object.keys(categories).map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                    className={`${bgColor} ${fontColor}`}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {Object.entries(iconsByCategory).map(
                ([category, icons]) =>
                    icons.length > 0 && (
                        <div key={category} className="mb-2">
                            <h2
                                className={`text-xl font-semibold mb-2 border-b pb-2 ${borderColorBright}`}
                            >
                                {category}
                            </h2>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
                                {icons.map((iconName) => {
                                    const IconComponent =
                                        Icons[iconName as keyof typeof Icons];
                                    return IconComponent ? (
                                        <div
                                            key={iconName}
                                            className={`p-1 aspect-square flex flex-col flex-1 items-center justify-center hover:outline hover:rounded ${borderColorBright}`}
                                        >
                                            <div className="flex items-center justify-center m-2 mt-1">
                                                <IconComponent
                                                    size={iconSize}
                                                    className={
                                                        darkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }
                                                />
                                            </div>
                                            <div className="text-center w-full">
                                                <p className="text-xs font-mono break-words w-full">
                                                    {iconName}
                                                </p>
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )
            )}

            {Object.values(iconsByCategory).flat().length === 0 && (
                <div className="text-center py-12">
                    <p>No icons found matching your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default IconGallery;
