import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{a as l,T as $,S as P,b as J,B as Y}from"./componentRegistry-C1pIfR8x.js";import{w as q,T as f,a as k,A as X,c as _,d as G,e as K,f as F,g as Q,h as M,i as V,j as a}from"./ThemeAwareText-aBl3ngNK.js";import{r as Z}from"./index-CFacQ8Bc.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import"./IconButton-CmKgifoD.js";import{I as s}from"./Input-BphtCn-1.js";import"./PushButton-Ceh3LIjb.js";import"./iframe-BGiDNlN8.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./_commonjsHelpers-CqkleIqs.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const d=({icon:o,label:i,onClick:c})=>e.jsxs("div",{className:"flex flex-col items-center justify-center p-2 hover:bg-accent-dark-neutral/20 cursor-pointer transition-colors",onClick:c,children:[e.jsx("div",{className:"w-16 h-14 flex items-center justify-center border border-accent-dark-neutral rounded",children:e.jsx(o,{size:48})}),e.jsx("span",{className:"mt-1 text-sm text-font-dark-muted",children:i})]}),xe={title:"Atoms/Containers/DropdownPanel",component:l,tags:["autodocs"],decorators:[q],argTypes:{title:{control:"text",description:"Header text or element"},description:{control:"text",description:"Optional description displayed beneath the title"},defaultOpen:{control:"boolean",description:"Whether the panel is initially expanded (uncontrolled mode)"},open:{control:"boolean",description:"Controls whether the panel is expanded (controlled mode)"},variant:{control:"select",options:["default","ghost"],description:"Visual style variant of the panel"},searchable:{control:"boolean",description:"Whether to show a search box to filter panel contents"},contentLayout:{control:"radio",options:["grid","list"],description:"Layout arrangement of child elements"}},parameters:{docs:{description:{component:"`DropdownPanel` is a collapsible section that can contain any content.\nIt features a header that can be clicked to expand or collapse the panel content."}}}},p={args:{title:"Basic Dropdown Panel",children:e.jsx("div",{className:"p-4",children:"Content inside dropdown panel"})}},m={render:()=>{const o=t=>{console.log(`Selected ${t} component`)},i=[{id:"panel",icon:F,label:"Panel"},{id:"scrollbox",icon:Q,label:"Scroll Box"},{id:"tabs",icon:M,label:"Tabs"},{id:"drawer",icon:V,label:"Drawer"}],c=[{id:"button",icon:a,label:"Button"},{id:"menu",icon:a,label:"Menu"},{id:"toggle",icon:a,label:"Toggle"}],x=[{id:"text",icon:a,label:"Text"},{id:"textarea",icon:a,label:"Text Area"},{id:"select",icon:a,label:"Select"},{id:"value",icon:a,label:"Value"},{id:"color",icon:a,label:"Color"},{id:"datetime",icon:a,label:"Date/Time"}];return e.jsxs("div",{className:"space-y-6",children:[e.jsx(f,{children:"Component Palette"}),e.jsx(k,{children:"Dropdown panels can be used to create a component palette with collapsible sections."}),e.jsxs("div",{className:"mx-auto w-96 bg-bg-dark",children:[e.jsx(l,{title:"Basic Containers",defaultOpen:!0,contentLayout:"grid",variant:"ghost",children:i.map(t=>e.jsx(d,{icon:t.icon,label:t.label,onClick:()=>o(t.label)},t.id))}),e.jsx(l,{title:"Buttons",defaultOpen:!0,contentLayout:"grid",variant:"ghost",children:c.map(t=>e.jsx(d,{icon:t.icon,label:t.label,onClick:()=>o(t.label)},t.id))}),e.jsx(l,{title:"Inputs",defaultOpen:!1,contentLayout:"grid",variant:"ghost",description:"Form input components",children:x.map(t=>e.jsx(d,{icon:t.icon,label:t.label,onClick:()=>o(t.label)},t.id))})]})]})},args:{title:"Basic Containers",children:e.jsx(e.Fragment,{})}},u={render:()=>{const[o,i]=Z.useState(""),c=[{id:"panel",icon:F,label:"Panel"},{id:"scrollbox",icon:Q,label:"Scroll Box"},{id:"tabs",icon:M,label:"Tabs"},{id:"drawer",icon:V,label:"Drawer"}],x=[{id:"button",icon:a,label:"Button"},{id:"menu",icon:a,label:"Menu"},{id:"toggle",icon:a,label:"Toggle"}],t=[{id:"text",icon:a,label:"Text"},{id:"textarea",icon:a,label:"Text Area"},{id:"select",icon:a,label:"Select"},{id:"value",icon:a,label:"Value"},{id:"color",icon:a,label:"Color"},{id:"datetime",icon:a,label:"Date/Time"}],h=n=>o?n.filter(U=>U.label.toLowerCase().includes(o.toLowerCase())):n,v=h(c),N=h(x),w=h(t),j=v.length>0,y=N.length>0,C=w.length>0,W=!j&&!y&&!C&&o,g=n=>{console.log(`Selected ${n} component`)};return e.jsxs("div",{className:"space-y-6",children:[e.jsx(f,{children:"DropdownPanel with Tabs"}),e.jsx(k,{children:"Dropdown panels can be combined with tabs and search functionality to create a comprehensive component browser."}),e.jsx("div",{className:"w-128 mx-auto bg-bg-dark border-r border-accent-dark-neutral h-144",children:e.jsx($,{variant:"default",className:"w-full",tabClassName:"flex-1",tabs:[{id:"atoms",label:"Atoms",content:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:"p-2 border-b border-accent-dark-neutral",children:e.jsx(P,{value:o,onChange:i,placeholder:"Search components..."})}),e.jsx("div",{className:"overflow-auto flex-1",children:e.jsxs("div",{className:"w-full bg-bg-dark",children:[W&&e.jsxs("div",{className:"p-4 text-center text-font-dark-muted",children:['No components found matching "',o,'"']}),j&&e.jsx(l,{title:"Basic Containers",defaultOpen:!0,contentLayout:"grid",variant:"ghost",children:v.map(n=>e.jsx(d,{icon:n.icon,label:n.label,onClick:()=>g(n.label)},n.id))}),y&&e.jsx(l,{title:"Buttons",defaultOpen:!0,contentLayout:"grid",variant:"ghost",children:N.map(n=>e.jsx(d,{icon:n.icon,label:n.label,onClick:()=>g(n.label)},n.id))}),C&&e.jsx(l,{title:"Inputs",defaultOpen:!!o,contentLayout:"grid",variant:"ghost",description:"Form input components",children:w.map(n=>e.jsx(d,{icon:n.icon,label:n.label,onClick:()=>g(n.label)},n.id))})]})})]})},{id:"molecules",label:"Molecules",content:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:"p-2 border-b border-accent-dark-neutral",children:e.jsx(P,{value:o,onChange:i,placeholder:"Search molecules..."})}),e.jsx("div",{className:"p-4 text-center text-font-dark-muted",children:"No molecules found. Add basic components to build molecules."})]})}]})})]})},args:{title:"With Tabs",children:e.jsx(e.Fragment,{})}},r=({label:o,children:i,className:c})=>e.jsxs("div",{className:`flex items-center mb-2 ${c}`,children:[e.jsx("div",{className:"w-1/3 text-font-dark-muted text-sm",children:o}),e.jsx("div",{className:"w-2/3",children:i})]}),b={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(f,{children:"Property Panel Example"}),e.jsx(k,{children:"Dropdown panels can be used to organize properties in a properties panel, with collapsible sections for different categories."}),e.jsxs("div",{className:"w-96 mx-auto h-screen bg-bg-dark border-l border-accent-dark-neutral",children:[e.jsxs("div",{className:"p-2 border-b border-accent-dark-neutral",children:[e.jsx("h2",{className:"text-lg font-medium",children:"PanelName"}),e.jsx("div",{className:"text-xs text-font-dark-muted",children:"Name: panelName"})]}),e.jsxs(J,{maxHeight:"100%",children:[e.jsx(l,{title:"Content",defaultOpen:!0,variant:"ghost",contentLayout:"list",className:"border-b border-accent-dark-neutral/50",children:e.jsxs("div",{className:"p-2",children:[e.jsx(r,{label:"Children",children:e.jsxs("div",{className:"max-h-32 overflow-y-auto border border-accent-dark-neutral rounded p-1",children:[e.jsx("div",{className:"flex items-center p-1 hover:bg-accent-dark-neutral/20",children:"◦ TitleOfPanel"}),e.jsx("div",{className:"flex items-center p-1 hover:bg-accent-dark-neutral/20",children:"◦ Button"}),e.jsx("div",{className:"flex items-center p-1 hover:bg-accent-dark-neutral/20",children:"◦ TabSet"}),e.jsx("div",{className:"flex items-center p-1 hover:bg-accent-dark-neutral/20",children:"◦ BottomBarPanel"})]})}),e.jsx(r,{label:"Input Type",children:e.jsxs("select",{className:"w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1","aria-label":"Input Type",children:[e.jsx("option",{children:"Number"}),e.jsx("option",{children:"Text"}),e.jsx("option",{children:"Boolean"})]})}),e.jsx(r,{label:"Format",children:e.jsxs("select",{className:"w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1","aria-label":"Format",children:[e.jsx("option",{children:"Value Box"}),e.jsx("option",{children:"Slider"})]})}),e.jsx(r,{label:"Size",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx(s,{value:"2",className:"w-14 bg-bg-dark-darker",prefix:{content:"W"}}),e.jsx(s,{value:"1",className:"w-14 bg-bg-dark-darker",prefix:{content:"H"}})]})}),e.jsx(r,{label:"Default Value",children:e.jsx("div",{className:"flex gap-1",children:e.jsx(s,{value:"0.00",className:"w-full bg-bg-dark-darker"})})}),e.jsx(r,{label:"Range",children:e.jsxs("div",{className:"flex gap-1 items-center",children:[e.jsx(s,{value:"0.00",className:"w-14 bg-bg-dark-darker"}),e.jsx("span",{className:"text-font-dark-muted",children:"to"}),e.jsx(s,{value:"1.00",className:"w-14 bg-bg-dark-darker"})]})}),e.jsx(r,{label:"Description",className:"items-start",children:e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("textarea",{className:"w-full h-20 bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-sm",defaultValue:"You can place a bunch of text in this box and it can then be used for docs, tooltips, or other purposes.",title:"Description"}),e.jsx("div",{className:"text-xs text-right text-font-dark-muted cursor-pointer hover:text-font-dark",children:"Help"})]})}),e.jsx(r,{label:"Unit Type",children:e.jsxs("select",{className:"w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1","aria-label":"Unit Type",children:[e.jsx("option",{children:"Degrees °"}),e.jsx("option",{children:"Pixels px"}),e.jsx("option",{children:"Percentage %"})]})})]})}),e.jsx(l,{title:"Layout & Style",defaultOpen:!0,variant:"ghost",contentLayout:"list",className:"border-b border-accent-dark-neutral/50",children:e.jsxs("div",{className:"p-2",children:[e.jsx(r,{label:"Position",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(Y,{items:[{id:"left",icon:e.jsx(X,{size:16}),tooltip:"Align Left"},{id:"center",icon:e.jsx(_,{size:16}),tooltip:"Align Center"},{id:"right",icon:e.jsx(G,{size:16}),tooltip:"Align Right"},{id:"justify",icon:e.jsx(K,{size:16}),tooltip:"Justify"}],selectionMode:"single",defaultSelected:["center"],className:"bg-bg-dark-darker border border-accent-dark-neutral rounded p-1"}),e.jsxs("div",{className:"grid grid-cols-2 gap-1",children:[e.jsx(s,{value:"",className:"bg-bg-dark-darker",prefix:{content:"X"}}),e.jsx(s,{value:"60",className:"bg-bg-dark-darker",prefix:{content:"Y"}})]})]})}),e.jsx(r,{label:"Size",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsxs("div",{className:"flex items-center justify-end",children:[e.jsxs("label",{htmlFor:"autoSizeCheckbox",className:"flex items-center",children:[e.jsx("span",{className:"text-xs text-font-dark-muted mr-1",children:"auto"}),e.jsx("input",{id:"autoSizeCheckbox",type:"checkbox",className:"mr-2","aria-label":"Auto size"})]}),e.jsx("span",{className:"text-xs text-font-dark-muted mr-1",children:"px"}),e.jsxs("select",{className:"bg-bg-dark-darker border border-accent-dark-neutral rounded text-xs p-0.5","aria-label":"Unit Type",children:[e.jsx("option",{children:"px"}),e.jsx("option",{children:"%"}),e.jsx("option",{children:"em"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1",children:[e.jsx(s,{value:"",className:"bg-bg-dark-darker",prefix:{content:"W"}}),e.jsx(s,{value:"110",className:"bg-bg-dark-darker",prefix:{content:"H"}})]})]})}),e.jsx(r,{label:"Style",children:e.jsxs("select",{className:"w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1","aria-label":"Style",children:[e.jsx("option",{children:"Simple Panel"}),e.jsx("option",{children:"Elevated Panel"}),e.jsx("option",{children:"Custom"})]})}),e.jsx(r,{label:"Overrides",children:e.jsx("button",{className:"w-full text-left bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-font-dark-muted",children:"◢"})})]})}),e.jsx(l,{title:"Events & Actions",defaultOpen:!0,variant:"ghost",contentLayout:"list",children:e.jsxs("div",{className:"p-2",children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1",children:e.jsx("span",{className:"text-sm",children:"◦ onHover"})}),e.jsx("div",{className:"flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral",children:"▸ ShowTooltip(description)"})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1",children:e.jsx("span",{className:"text-sm",children:"◦ onClick"})}),e.jsx("div",{className:"flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral",children:"▸ No handlers defined"})]}),e.jsx("button",{className:"w-full p-2 bg-bg-dark-darker border border-accent-dark-neutral rounded text-center text-font-dark-muted hover:text-font-dark",children:"Add Event + Handler"})]})})]})]})]}),args:{title:"Property Panel",children:e.jsx(e.Fragment,{})}};var B,S,T;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: "Basic Dropdown Panel",
    children: <div className="p-4">Content inside dropdown panel</div>
  }
}`,...(T=(S=p.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var I,D,A;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const handleComponentClick = (componentName: string) => {
      console.log(\`Selected \${componentName} component\`);
    };

    // Component definitions
    const containers = [{
      id: "panel",
      icon: CompPanelIcon,
      label: "Panel"
    }, {
      id: "scrollbox",
      icon: CompScrollBoxIcon,
      label: "Scroll Box"
    }, {
      id: "tabs",
      icon: CompTabsIcon,
      label: "Tabs"
    }, {
      id: "drawer",
      icon: CompDrawerIcon,
      label: "Drawer"
    }];
    const buttons = [{
      id: "button",
      icon: CompPushButtonIcon,
      label: "Button"
    }, {
      id: "menu",
      icon: CompPushButtonIcon,
      label: "Menu"
    }, {
      id: "toggle",
      icon: CompPushButtonIcon,
      label: "Toggle"
    }];
    const inputs = [{
      id: "text",
      icon: CompPushButtonIcon,
      label: "Text"
    }, {
      id: "textarea",
      icon: CompPushButtonIcon,
      label: "Text Area"
    }, {
      id: "select",
      icon: CompPushButtonIcon,
      label: "Select"
    }, {
      id: "value",
      icon: CompPushButtonIcon,
      label: "Value"
    }, {
      id: "color",
      icon: CompPushButtonIcon,
      label: "Color"
    }, {
      id: "datetime",
      icon: CompPushButtonIcon,
      label: "Date/Time"
    }];
    return <div className="space-y-6">
                <ThemeAwareHeading>Component Palette</ThemeAwareHeading>
                <ThemeAwareBody>
                    Dropdown panels can be used to create a component palette
                    with collapsible sections.
                </ThemeAwareBody>

                <div className="mx-auto w-96 bg-bg-dark">
                    {/* Basic Containers Section */}
                    <DropdownPanel title="Basic Containers" defaultOpen={true} contentLayout="grid" variant="ghost">
                        {containers.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                    </DropdownPanel>

                    {/* Buttons Section */}
                    <DropdownPanel title="Buttons" defaultOpen={true} contentLayout="grid" variant="ghost">
                        {buttons.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                    </DropdownPanel>

                    {/* Inputs Section (Collapsed by default) */}
                    <DropdownPanel title="Inputs" defaultOpen={false} contentLayout="grid" variant="ghost" description="Form input components">
                        {inputs.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                    </DropdownPanel>
                </div>
            </div>;
  },
  args: {
    // Minimum required props
    title: "Basic Containers",
    children: <></> // Empty fragment
  }
}`,...(A=(D=m.parameters)==null?void 0:D.docs)==null?void 0:A.source}}};var R,L,O;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Component definitions
    const containers = [{
      id: "panel",
      icon: CompPanelIcon,
      label: "Panel"
    }, {
      id: "scrollbox",
      icon: CompScrollBoxIcon,
      label: "Scroll Box"
    }, {
      id: "tabs",
      icon: CompTabsIcon,
      label: "Tabs"
    }, {
      id: "drawer",
      icon: CompDrawerIcon,
      label: "Drawer"
    }];
    const buttons = [{
      id: "button",
      icon: CompPushButtonIcon,
      label: "Button"
    }, {
      id: "menu",
      icon: CompPushButtonIcon,
      label: "Menu"
    }, {
      id: "toggle",
      icon: CompPushButtonIcon,
      label: "Toggle"
    }];
    const inputs = [{
      id: "text",
      icon: CompPushButtonIcon,
      label: "Text"
    }, {
      id: "textarea",
      icon: CompPushButtonIcon,
      label: "Text Area"
    }, {
      id: "select",
      icon: CompPushButtonIcon,
      label: "Select"
    }, {
      id: "value",
      icon: CompPushButtonIcon,
      label: "Value"
    }, {
      id: "color",
      icon: CompPushButtonIcon,
      label: "Color"
    }, {
      id: "datetime",
      icon: CompPushButtonIcon,
      label: "Date/Time"
    }];

    // Filter function
    const filterBySearch = (components: any[]) => {
      if (!searchQuery) return components;
      return components.filter(comp => comp.label.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    // Filtered components
    const filteredContainers = filterBySearch(containers);
    const filteredButtons = filterBySearch(buttons);
    const filteredInputs = filterBySearch(inputs);

    // Determine if sections should be visible based on search
    const showContainers = filteredContainers.length > 0;
    const showButtons = filteredButtons.length > 0;
    const showInputs = filteredInputs.length > 0;

    // No results message
    const noResults = !showContainers && !showButtons && !showInputs && searchQuery;
    const handleComponentClick = (componentName: string) => {
      console.log(\`Selected \${componentName} component\`);
    };
    return <div className="space-y-6">
                <ThemeAwareHeading>DropdownPanel with Tabs</ThemeAwareHeading>
                <ThemeAwareBody>
                    Dropdown panels can be combined with tabs and search
                    functionality to create a comprehensive component browser.
                </ThemeAwareBody>

                <div className="w-128 mx-auto bg-bg-dark border-r border-accent-dark-neutral h-144">
                    {/* Use Tabs component for Atoms/Molecules */}
                    <Tabs variant="default" className="w-full" tabClassName="flex-1" tabs={[{
          id: "atoms",
          label: "Atoms",
          content: <div className="flex flex-col h-full">
                                        {/* SearchBar in the tab content */}
                                        <div className="p-2 border-b border-accent-dark-neutral">
                                            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search components..." />
                                        </div>
                                        <div className="overflow-auto flex-1">
                                            <div className="w-full bg-bg-dark">
                                                {noResults && <div className="p-4 text-center text-font-dark-muted">
                                                        No components found
                                                        matching "{searchQuery}"
                                                    </div>}

                                                {/* Basic Containers Section */}
                                                {showContainers && <DropdownPanel title="Basic Containers" defaultOpen={true} contentLayout="grid" variant="ghost">
                                                        {filteredContainers.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                                                    </DropdownPanel>}

                                                {/* Buttons Section */}
                                                {showButtons && <DropdownPanel title="Buttons" defaultOpen={true} contentLayout="grid" variant="ghost">
                                                        {filteredButtons.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                                                    </DropdownPanel>}

                                                {/* Inputs Section (Collapsed by default) */}
                                                {showInputs && <DropdownPanel title="Inputs" defaultOpen={searchQuery ? true : false} contentLayout="grid" variant="ghost" description="Form input components">
                                                        {filteredInputs.map(comp => <ComponentThumbnail key={comp.id} icon={comp.icon} label={comp.label} onClick={() => handleComponentClick(comp.label)} />)}
                                                    </DropdownPanel>}
                                            </div>
                                        </div>
                                    </div>
        }, {
          id: "molecules",
          label: "Molecules",
          content: <div className="flex flex-col h-full">
                                        <div className="p-2 border-b border-accent-dark-neutral">
                                            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search molecules..." />
                                        </div>
                                        <div className="p-4 text-center text-font-dark-muted">
                                            No molecules found. Add basic
                                            components to build molecules.
                                        </div>
                                    </div>
        }]} />
                </div>
            </div>;
  },
  args: {
    // Minimum required props
    title: "With Tabs",
    children: <></> // Empty fragment
  }
}`,...(O=(L=u.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var z,H,E;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
            <ThemeAwareHeading>Property Panel Example</ThemeAwareHeading>
            <ThemeAwareBody>
                Dropdown panels can be used to organize properties in a
                properties panel, with collapsible sections for different
                categories.
            </ThemeAwareBody>

            <div className="w-96 mx-auto h-screen bg-bg-dark border-l border-accent-dark-neutral">
                {/* Header with component name */}
                <div className="p-2 border-b border-accent-dark-neutral">
                    <h2 className="text-lg font-medium">PanelName</h2>
                    <div className="text-xs text-font-dark-muted">
                        Name: panelName
                    </div>
                </div>
                <ScrollBox maxHeight="100%">
                    {/* Content Section */}
                    <DropdownPanel title="Content" defaultOpen={true} variant="ghost" contentLayout="list" className="border-b border-accent-dark-neutral/50">
                        <div className="p-2">
                            <PropertyRow label="Children">
                                <div className="max-h-32 overflow-y-auto border border-accent-dark-neutral rounded p-1">
                                    <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                        ◦ TitleOfPanel
                                    </div>
                                    <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                        ◦ Button
                                    </div>
                                    <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                        ◦ TabSet
                                    </div>
                                    <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                        ◦ BottomBarPanel
                                    </div>
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Input Type">
                                <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1" aria-label="Input Type">
                                    <option>Number</option>
                                    <option>Text</option>
                                    <option>Boolean</option>
                                </select>
                            </PropertyRow>

                            <PropertyRow label="Format">
                                <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1" aria-label="Format">
                                    <option>Value Box</option>
                                    <option>Slider</option>
                                </select>
                            </PropertyRow>

                            <PropertyRow label="Size">
                                <div className="flex gap-1">
                                    <Input value="2" className="w-14 bg-bg-dark-darker" prefix={{
                  content: "W"
                }} />
                                    <Input value="1" className="w-14 bg-bg-dark-darker" prefix={{
                  content: "H"
                }} />
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Default Value">
                                <div className="flex gap-1">
                                    <Input value="0.00" className="w-full bg-bg-dark-darker" />
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Range">
                                <div className="flex gap-1 items-center">
                                    <Input value="0.00" className="w-14 bg-bg-dark-darker" />
                                    <span className="text-font-dark-muted">
                                        to
                                    </span>
                                    <Input value="1.00" className="w-14 bg-bg-dark-darker" />
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Description" className="items-start">
                                <div className="flex flex-col gap-1">
                                    <textarea className="w-full h-20 bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-sm" defaultValue="You can place a bunch of text in this box and it can then be used for docs, tooltips, or other purposes." title="Description" />
                                    <div className="text-xs text-right text-font-dark-muted cursor-pointer hover:text-font-dark">
                                        Help
                                    </div>
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Unit Type">
                                <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1" aria-label="Unit Type">
                                    <option>Degrees °</option>
                                    <option>Pixels px</option>
                                    <option>Percentage %</option>
                                </select>
                            </PropertyRow>
                        </div>
                    </DropdownPanel>

                    {/* Layout & Style Section */}
                    <DropdownPanel title="Layout & Style" defaultOpen={true} variant="ghost" contentLayout="list" className="border-b border-accent-dark-neutral/50">
                        <div className="p-2">
                            <PropertyRow label="Position">
                                <div className="flex flex-col gap-2">
                                    <ButtonStrip items={[{
                  id: "left",
                  icon: <AlignLeftIcon size={16} />,
                  tooltip: "Align Left"
                }, {
                  id: "center",
                  icon: <AlignCenterIcon size={16} />,
                  tooltip: "Align Center"
                }, {
                  id: "right",
                  icon: <AlignRightIcon size={16} />,
                  tooltip: "Align Right"
                }, {
                  id: "justify",
                  icon: <AlignJustifyIcon size={16} />,
                  tooltip: "Justify"
                }]} selectionMode="single" defaultSelected={["center"]} className="bg-bg-dark-darker border border-accent-dark-neutral rounded p-1" />
                                    <div className="grid grid-cols-2 gap-1">
                                        <Input value="" className="bg-bg-dark-darker" prefix={{
                    content: "X"
                  }} />
                                        <Input value="60" className="bg-bg-dark-darker" prefix={{
                    content: "Y"
                  }} />
                                    </div>
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Size">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-end">
                                        <label htmlFor="autoSizeCheckbox" className="flex items-center">
                                            <span className="text-xs text-font-dark-muted mr-1">
                                                auto
                                            </span>
                                            <input id="autoSizeCheckbox" type="checkbox" className="mr-2" aria-label="Auto size" />
                                        </label>
                                        <span className="text-xs text-font-dark-muted mr-1">
                                            px
                                        </span>
                                        <select className="bg-bg-dark-darker border border-accent-dark-neutral rounded text-xs p-0.5" aria-label="Unit Type">
                                            <option>px</option>
                                            <option>%</option>
                                            <option>em</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                        <Input value="" className="bg-bg-dark-darker" prefix={{
                    content: "W"
                  }} />
                                        <Input value="110" className="bg-bg-dark-darker" prefix={{
                    content: "H"
                  }} />
                                    </div>
                                </div>
                            </PropertyRow>

                            <PropertyRow label="Style">
                                <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1" aria-label="Style">
                                    <option>Simple Panel</option>
                                    <option>Elevated Panel</option>
                                    <option>Custom</option>
                                </select>
                            </PropertyRow>

                            <PropertyRow label="Overrides">
                                <button className="w-full text-left bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-font-dark-muted">
                                    ◢
                                </button>
                            </PropertyRow>
                        </div>
                    </DropdownPanel>

                    {/* Events & Actions Section */}
                    <DropdownPanel title="Events & Actions" defaultOpen={true} variant="ghost" contentLayout="list">
                        <div className="p-2">
                            <div className="mb-2">
                                <div className="flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1">
                                    <span className="text-sm">◦ onHover</span>
                                </div>
                                <div className="flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral">
                                    ▸ ShowTooltip(description)
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1">
                                    <span className="text-sm">◦ onClick</span>
                                </div>
                                <div className="flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral">
                                    ▸ No handlers defined
                                </div>
                            </div>

                            <button className="w-full p-2 bg-bg-dark-darker border border-accent-dark-neutral rounded text-center text-font-dark-muted hover:text-font-dark">
                                Add Event + Handler
                            </button>
                        </div>
                    </DropdownPanel>
                </ScrollBox>
            </div>
        </div>,
  args: {
    // Minimum required props
    title: "Property Panel",
    children: <></> // Empty fragment
  }
}`,...(E=(H=b.parameters)==null?void 0:H.docs)==null?void 0:E.source}}};const he=["Default","ComponentPalette","WithTabs","PropertyPanel"];export{m as ComponentPalette,p as Default,b as PropertyPanel,u as WithTabs,he as __namedExportsOrder,xe as default};
