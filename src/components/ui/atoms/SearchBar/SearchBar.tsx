// src/components/ui/atoms/SearchBar/SearchBar.tsx

import { useState, useCallback } from "react";
import { Input } from "../Input";
import { IconButton } from "../IconButton";
import { DropdownButton } from "../Dropdown";
import { FilterIcon, SearchIcon, XIcon } from "../../icons";

export interface SearchBarProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
}

export const SearchBar = ({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder = "Search...",
    className,
}: SearchBarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState(value || "");

    const handleChange = useCallback(
        (newValue: string) => {
            setSearchValue(newValue);
            onChange?.(newValue);
        },
        [onChange]
    );

    const handleClear = useCallback(() => {
        setSearchValue("");
        onClear?.();
    }, [onClear]);

    const handleToggle = useCallback(() => {
        setIsExpanded((prev) => !prev);
        if (!isExpanded) {
            // Focus the input when expanding
            setTimeout(() => {
                document
                    .querySelector<HTMLInputElement>(".search-input")
                    ?.focus();
            }, 0);
        }
    }, [isExpanded]);

    const handleSearch = useCallback(() => {
        onSearch?.(searchValue);
    }, [onSearch, searchValue]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    // If collapsed, just show the search icon button
    if (!isExpanded) {
        return (
            <IconButton
                icon={SearchIcon}
                variant="ghost"
                onClick={handleToggle}
                tooltip="Search"
                className={className}
            />
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <Input
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="search"
                placeholder={placeholder}
                variant="search"
                className="search-input"
                prefix={{
                    content: (
                        <IconButton
                            icon={SearchIcon}
                            variant="ghost"
                            onClick={() => {
                                handleToggle();
                                handleSearch();
                            }}
                            tooltip="Search"
                            className={className}
                        />
                    ),
                }}
                suffix={[
                    {
                        content: <XIcon />,
                        action: handleClear,
                        tooltip: "Clear search",
                        isInteractive: true,
                    },
                    {
                        content: (
                            <DropdownButton
                                label={<FilterIcon size={20} />}
                                options={[
                                    { label: "All", value: "all" },
                                    {
                                        label: "Components",
                                        value: "components",
                                    },
                                    { label: "Layouts", value: "layouts" },
                                ]}
                                variant="ghost"
                                showCaret={false}
                            />
                        ),
                        isInteractive: true,
                    },
                ]}
            />
        </div>
    );
};

export default SearchBar;
