import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{L as c,P as I,c as y}from"./componentRegistry-C1pIfR8x.js";import{r as x}from"./index-CFacQ8Bc.js";import{w as j,T as g,a as v,l as b,G as w,S as N,E as C}from"./ThemeAwareText-aBl3ngNK.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import"./IconButton-CmKgifoD.js";import"./Input-BphtCn-1.js";import{P as A}from"./PushButton-Ceh3LIjb.js";import"./iframe-BGiDNlN8.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./_commonjsHelpers-CqkleIqs.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const z={title:"Atoms/Data Display/ListView",component:c,tags:["autodocs"],decorators:[j],argTypes:{items:{description:"Array of items to display in the list"},renderItem:{description:"Function to render each item in the list"},selectedIds:{description:"Array of selected item IDs (controlled mode)"},onSelectionChange:{description:"Called when selection changes"},multiSelect:{control:"boolean",description:"Whether multiple items can be selected"},variant:{control:"select",options:["default","inset"],description:"Visual style variant of the list"},maxHeight:{control:"text",description:"Maximum height of the list before scrolling"}},parameters:{docs:{description:{component:"`ListView` displays a list of items with selection capabilities.\nIt supports both single and multi-selection modes, and can be customized\nwith custom rendering for each item."}}}},s={render:()=>{const[t,i]=x.useState([]),o=[{id:"item-1",label:"First Item"},{id:"item-2",label:"Second Item"},{id:"item-3",label:"Third Item"},{id:"item-4",label:"Fourth Item"},{id:"item-5",label:"Fifth Item"}];return e.jsxs("div",{className:"space-y-6",children:[e.jsx(g,{children:"Simple List"}),e.jsx(v,{children:"A basic list with selectable items. Select one or more items to see the selected IDs."}),e.jsx(I,{variant:"elevated",header:"Simple List",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(c,{items:o,selectedIds:t,onSelectionChange:i,renderItem:r=>r.label,maxHeight:300}),e.jsxs("div",{className:"text-font-dark-muted",children:["Selected: ",t.join(", ")]})]})})]})},args:{items:[]}},a={render:()=>{const[t,i]=x.useState([]),o=[{id:"file-1",title:"Project Documentation",description:"Main project documentation and guidelines",type:"file",favorite:!0,modified:"2024-02-20"},{id:"folder-1",title:"Source Code",description:"Main application source code",type:"folder",favorite:!1,modified:"2024-02-19"},{id:"setting-1",title:"Project Settings",description:"Configuration and environment settings",type:"setting",favorite:!0,modified:"2024-02-18"},{id:"file-2",title:"API Documentation",description:"REST API endpoints and usage",type:"file",favorite:!1,modified:"2024-02-17"}],r=d=>{switch(d.type){case"file":return C;case"folder":return N;case"setting":return w;default:return}};return e.jsxs("div",{className:"space-y-6",children:[e.jsx(g,{children:"Complex List"}),e.jsx(v,{children:"A more complex list with custom item rendering, icons, and multi-selection. Each item shows different information based on its type."}),e.jsx(I,{variant:"elevated",header:"Complex List",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(c,{items:o,selectedIds:t,onSelectionChange:i,multiSelect:!0,maxHeight:400,renderItem:d=>{const n=d,S=r(n);return e.jsx(y,{metadata:n,startIcon:S,endIcon:n.favorite?b:void 0,endIconClassName:"text-accent-dark-bright",children:e.jsxs("div",{className:"flex flex-col py-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"font-medium",children:n.title}),e.jsx("span",{className:"text-font-dark-muted text-sm",children:n.modified})]}),e.jsx("span",{className:"text-font-dark-muted text-sm",children:n.description})]})})}}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("span",{className:"text-font-dark-muted",children:[t.length," item(s) selected"]}),e.jsx(A,{variant:"ghost",disabled:t.length===0,onClick:()=>i([]),children:"Clear Selection"})]})]})})]})},args:{items:[]}};var l,m,p;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const items = [{
      id: "item-1",
      label: "First Item"
    }, {
      id: "item-2",
      label: "Second Item"
    }, {
      id: "item-3",
      label: "Third Item"
    }, {
      id: "item-4",
      label: "Fourth Item"
    }, {
      id: "item-5",
      label: "Fifth Item"
    }];
    return <div className="space-y-6">
                <ThemeAwareHeading>Simple List</ThemeAwareHeading>
                <ThemeAwareBody>
                    A basic list with selectable items. Select one or more items
                    to see the selected IDs.
                </ThemeAwareBody>

                <Panel variant="elevated" header="Simple List">
                    <div className="space-y-4">
                        <ListView items={items} selectedIds={selectedIds} onSelectionChange={setSelectedIds} renderItem={item => item.label} maxHeight={300} />
                        <div className="text-font-dark-muted">
                            Selected: {selectedIds.join(", ")}
                        </div>
                    </div>
                </Panel>
            </div>;
  },
  args: {
    // Minimum required props
    items: [] // Empty array of items
  }
}`,...(p=(m=s.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,f,h;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const items: ComplexItem[] = [{
      id: "file-1",
      title: "Project Documentation",
      description: "Main project documentation and guidelines",
      type: "file",
      favorite: true,
      modified: "2024-02-20"
    }, {
      id: "folder-1",
      title: "Source Code",
      description: "Main application source code",
      type: "folder",
      favorite: false,
      modified: "2024-02-19"
    }, {
      id: "setting-1",
      title: "Project Settings",
      description: "Configuration and environment settings",
      type: "setting",
      favorite: true,
      modified: "2024-02-18"
    }, {
      id: "file-2",
      title: "API Documentation",
      description: "REST API endpoints and usage",
      type: "file",
      favorite: false,
      modified: "2024-02-17"
    }];

    // Get icon based on item type and favorite status
    const getStartIcon = (item: ComplexItem) => {
      switch (item.type) {
        case "file":
          return EditIcon;
        case "folder":
          return SearchIcon;
        case "setting":
          return GearIcon;
        default:
          return undefined;
      }
    };
    return <div className="space-y-6">
                <ThemeAwareHeading>Complex List</ThemeAwareHeading>
                <ThemeAwareBody>
                    A more complex list with custom item rendering, icons, and
                    multi-selection. Each item shows different information based
                    on its type.
                </ThemeAwareBody>

                <Panel variant="elevated" header="Complex List">
                    <div className="space-y-4">
                        <ListView items={items} selectedIds={selectedIds} onSelectionChange={setSelectedIds} multiSelect maxHeight={400} renderItem={item => {
            const complexItem = item as ComplexItem;
            const itemIcon = getStartIcon(complexItem);
            return <ListItem metadata={complexItem} startIcon={itemIcon} // Pass resolved icon
            endIcon={complexItem.favorite ? StarIcon : undefined} endIconClassName="text-accent-dark-bright">
                                        <div className="flex flex-col py-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    {complexItem.title}
                                                </span>
                                                <span className="text-font-dark-muted text-sm">
                                                    {complexItem.modified}
                                                </span>
                                            </div>
                                            <span className="text-font-dark-muted text-sm">
                                                {complexItem.description}
                                            </span>
                                        </div>
                                    </ListItem>;
          }} />

                        <div className="flex justify-between items-center">
                            <span className="text-font-dark-muted">
                                {selectedIds.length} item(s) selected
                            </span>
                            <PushButton variant="ghost" disabled={selectedIds.length === 0} onClick={() => setSelectedIds([])}>
                                Clear Selection
                            </PushButton>
                        </div>
                    </div>
                </Panel>
            </div>;
  },
  args: {
    // Minimum required props
    items: [] // Empty array of items
  }
}`,...(h=(f=a.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const O=["SimpleList","ComplexList"];export{a as ComplexList,s as SimpleList,O as __namedExportsOrder,z as default};
