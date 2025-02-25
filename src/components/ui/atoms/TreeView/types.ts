import { ComponentType } from 'react';
import { IconProps } from '@/lib/icons/types';

export interface TreeItemData {
    id: string;
    label: string;
    icon?: ComponentType<IconProps>;
    children?: TreeItemData[];
    disabled?: boolean;
    data?: Record<string, any>;
    parentId?: string;
    canDrop?: boolean;
    canDrag?: boolean;
}

export interface TreeSelectionManager {
    selectedIds: Set<string>;
    expandedIds: Set<string>;
    toggleSelection: (id: string, mode?: 'single' | 'toggle' | 'range') => void;
    toggleExpansion: (id: string) => void;
    isSelected: (id: string) => boolean;
    isExpanded: (id: string) => boolean;
}

export interface TreeRenderProps {
    item: TreeItemData;
    level: number;
    isSelected: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    onSelect: () => void;
    onExpand: () => void;
}