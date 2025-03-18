import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as B,T as v,a as F,F as g,m as i,n as D,o as b,B as s}from"./ThemeAwareText-Dzv815Gu.js";import{r as a}from"./index-CFacQ8Bc.js";import{d as x,P as T}from"./componentRegistry-Bydd8upc.js";import"./Dropdown-BYWDEqO5.js";import"./DropdownSelect-C_xrwEPZ.js";import"./IconButton-BMcvz6tv.js";import"./Input-B6MG042b.js";import"./PushButton-Cr_VAFuk.js";import"./iframe-CiDI7u4-.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-CQ0JLh54.js";import"./panel-CTYQAhhj.js";import"./dropdown-wJJ0wzB7.js";import"./button-CUq80kjz.js";const z={title:"Atoms/Data Display/TreeView",component:x,tags:["autodocs"],decorators:[B],argTypes:{items:{description:"Array of tree item objects with hierarchical structure"},selectedIds:{description:"Array of selected item IDs (controlled mode)"},defaultSelectedIds:{description:"Array of initially selected item IDs (uncontrolled mode)"},expandedIds:{description:"Array of expanded item IDs (controlled mode)"},defaultExpandedIds:{description:"Array of initially expanded item IDs (uncontrolled mode)"},onSelectionChange:{description:"Called when selection changes"},onExpansionChange:{description:"Called when expansion state changes"},onMove:{description:"Called when items are rearranged via drag and drop"},multiSelect:{control:"boolean",description:"Whether multiple items can be selected"},maxHeight:{control:"text",description:"Maximum height of the tree before scrolling"}},parameters:{docs:{description:{component:"`TreeView` displays hierarchical data in a tree structure.\nIt supports selection, expansion/collapse, and drag-and-drop rearrangement."}}}};function E(r,o){return r.map(n=>({...n,parentId:o,children:n.children?E(n.children,n.id):void 0}))}const c={render:()=>{const r=E([{id:"folder-1",label:"src",icon:g,canDrag:!0,canDrop:!0,children:[{id:"folder-1-1",label:"components",icon:g,canDrag:!0,canDrop:!0,children:[{id:"file-1",label:"App.tsx",icon:i,canDrag:!0,canDrop:!1},{id:"file-2",label:"index.ts",icon:i,canDrag:!0,canDrop:!1}]},{id:"folder-1-2",label:"utils",icon:g,canDrag:!0,canDrop:!0,children:[{id:"file-3",label:"helpers.ts",icon:i,canDrag:!0,canDrop:!1}]}]},{id:"file-4",label:"package.json",icon:i,disabled:!0,canDrag:!1,canDrop:!1}]),[o,n]=a.useState(r),[t,p]=a.useState([]),[u,m]=a.useState(["folder-1"]),h=a.useCallback(l=>{console.log("FileExplorer handleMove:",l),n(l)},[]);return e.jsxs("div",{className:"space-y-6",children:[e.jsx(v,{children:"File Explorer"}),e.jsx(F,{children:"A tree view that mimics a file explorer with files and folders. Items can be selected, expanded, and rearranged via drag and drop."}),e.jsxs(T,{header:"File Explorer Example",children:[e.jsx(x,{items:o,selectedIds:t,onSelectionChange:p,expandedIds:u,onExpansionChange:m,onMove:h,multiSelect:!0,maxHeight:400}),e.jsxs("div",{className:"mt-2 text-font-dark-muted",children:["Selected: ",t.join(", ")]})]})]})},args:{items:[]}},d={render:()=>{const r=[{id:"main-window",label:"Main Window",icon:D,canDrag:!1,canDrop:!0,children:[{id:"panel-1",label:"TitleOfPanel",icon:D,canDrag:!0,canDrop:!0},{id:"tab-set",label:"TabSet",icon:b,canDrag:!0,canDrop:!0,children:[{id:"setting-tab",label:"SettingTab",icon:b,canDrag:!0,canDrop:!0},{id:"custom-tab",label:"CustomTab",icon:b,canDrag:!0,canDrop:!0,children:[{id:"button-1",label:"Button",icon:s,canDrag:!0,canDrop:!1}]}]},{id:"bottom-panel",label:"BottomBarPanel",icon:D,canDrag:!0,canDrop:!0,children:[{id:"button-cut",label:"ButtonCut",icon:s,canDrag:!0,canDrop:!1},{id:"button-copy",label:"ButtonCopy",icon:s,canDrag:!0,canDrop:!1},{id:"button-paste",label:"ButtonPaste",icon:s,canDrag:!0,canDrop:!1}]}]}],[o,n]=a.useState(r),[t,p]=a.useState(null),[u,m]=a.useState(["main-window"]),h=l=>{p(l[0]||null)};return e.jsxs("div",{className:"space-y-6",children:[e.jsx(v,{children:"Component Hierarchy"}),e.jsx(F,{children:"A tree view representing a component hierarchy, such as in a UI builder. Only one component can be selected at a time."}),e.jsxs(T,{header:"Layout Hierarchy",variant:"elevated",children:[e.jsx(x,{items:o,selectedIds:t?[t]:[],onSelectionChange:h,expandedIds:u,onExpansionChange:m,onMove:n,multiSelect:!1}),e.jsxs("div",{className:"mt-2 p-2 bg-bg-dark-darker rounded text-font-dark-muted text-sm",children:["Selected Component: ",t||"None"]})]})]})},args:{items:[]}};var f,I,y;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => {
    const fileExplorerData = addParentIds([{
      id: "folder-1",
      label: "src",
      icon: FolderIcon,
      canDrag: true,
      canDrop: true,
      children: [{
        id: "folder-1-1",
        label: "components",
        icon: FolderIcon,
        canDrag: true,
        canDrop: true,
        children: [{
          id: "file-1",
          label: "App.tsx",
          icon: FileIcon,
          canDrag: true,
          canDrop: false
        }, {
          id: "file-2",
          label: "index.ts",
          icon: FileIcon,
          canDrag: true,
          canDrop: false
        }]
      }, {
        id: "folder-1-2",
        label: "utils",
        icon: FolderIcon,
        canDrag: true,
        canDrop: true,
        children: [{
          id: "file-3",
          label: "helpers.ts",
          icon: FileIcon,
          canDrag: true,
          canDrop: false
        }]
      }]
    }, {
      id: "file-4",
      label: "package.json",
      icon: FileIcon,
      disabled: true,
      canDrag: false,
      canDrop: false
    }]);
    const [files, setFiles] = useState<TreeItemData[]>(fileExplorerData);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<string[]>(["folder-1"]);
    const handleMove = useCallback((newItems: TreeItemData[]) => {
      console.log("FileExplorer handleMove:", newItems);
      setFiles(newItems);
    }, []);
    return <div className="space-y-6">
                <ThemeAwareHeading>File Explorer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A tree view that mimics a file explorer with files and
                    folders. Items can be selected, expanded, and rearranged via
                    drag and drop.
                </ThemeAwareBody>

                <Panel header="File Explorer Example">
                    <TreeView items={files} selectedIds={selectedFiles} onSelectionChange={setSelectedFiles} expandedIds={expandedFolders} onExpansionChange={setExpandedFolders} onMove={handleMove} multiSelect maxHeight={400} />
                    <div className="mt-2 text-font-dark-muted">
                        Selected: {selectedFiles.join(", ")}
                    </div>
                </Panel>
            </div>;
  },
  args: {
    // Minimum required props
    items: []
  }
}`,...(y=(I=c.parameters)==null?void 0:I.docs)==null?void 0:y.source}}};var S,w,C;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => {
    const layoutData: TreeItemData[] = [{
      id: "main-window",
      label: "Main Window",
      icon: PanelIcon,
      canDrag: false,
      // Root can't be dragged
      canDrop: true,
      // But can receive drops
      children: [{
        id: "panel-1",
        label: "TitleOfPanel",
        icon: PanelIcon,
        canDrag: true,
        canDrop: true
      }, {
        id: "tab-set",
        label: "TabSet",
        icon: TabsIcon,
        canDrag: true,
        canDrop: true,
        children: [{
          id: "setting-tab",
          label: "SettingTab",
          icon: TabsIcon,
          canDrag: true,
          canDrop: true
        }, {
          id: "custom-tab",
          label: "CustomTab",
          icon: TabsIcon,
          canDrag: true,
          canDrop: true,
          children: [{
            id: "button-1",
            label: "Button",
            icon: ButtonIcon,
            canDrag: true,
            canDrop: false
          }]
        }]
      }, {
        id: "bottom-panel",
        label: "BottomBarPanel",
        icon: PanelIcon,
        canDrag: true,
        canDrop: true,
        children: [{
          id: "button-cut",
          label: "ButtonCut",
          icon: ButtonIcon,
          canDrag: true,
          canDrop: false
        }, {
          id: "button-copy",
          label: "ButtonCopy",
          icon: ButtonIcon,
          canDrag: true,
          canDrop: false
        }, {
          id: "button-paste",
          label: "ButtonPaste",
          icon: ButtonIcon,
          canDrag: true,
          canDrop: false
        }]
      }]
    }];

    // Single select mode since we're selecting one component at a time
    const [layout, setLayout] = useState<TreeItemData[]>(layoutData);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<string[]>(["main-window"]);
    const handleSelectionChange = (ids: string[]) => {
      setSelectedComponent(ids[0] || null);
    };
    return <div className="space-y-6">
                <ThemeAwareHeading>Component Hierarchy</ThemeAwareHeading>
                <ThemeAwareBody>
                    A tree view representing a component hierarchy, such as in a
                    UI builder. Only one component can be selected at a time.
                </ThemeAwareBody>

                <Panel header="Layout Hierarchy" variant="elevated">
                    <TreeView items={layout} selectedIds={selectedComponent ? [selectedComponent] : []} onSelectionChange={handleSelectionChange} expandedIds={expandedNodes} onExpansionChange={setExpandedNodes} onMove={setLayout} multiSelect={false} />
                    <div className="mt-2 p-2 bg-bg-dark-darker rounded text-font-dark-muted text-sm">
                        Selected Component: {selectedComponent || "None"}
                    </div>
                </Panel>
            </div>;
  },
  args: {
    // Minimum required props
    items: []
  }
}`,...(C=(w=d.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};const G=["FileExplorer","ComponentHierarchy"];export{d as ComponentHierarchy,c as FileExplorer,G as __namedExportsOrder,z as default};
