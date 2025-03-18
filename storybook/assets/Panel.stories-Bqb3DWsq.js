import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as T,T as l,a as i,E as k}from"./ThemeAwareText-aBl3ngNK.js";import"./index-CFacQ8Bc.js";import{P as a}from"./componentRegistry-C1pIfR8x.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import{I as b}from"./IconButton-CmKgifoD.js";import"./Input-BphtCn-1.js";import"./PushButton-Ceh3LIjb.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const D={title:"Atoms/Containers/Panel",component:a,tags:["autodocs"],decorators:[T],argTypes:{header:{description:"Content for the panel header"},variant:{control:"select",options:["default","elevated","inset","ghost"],description:"Visual style variant of the panel"},showHeader:{control:"boolean",description:"Whether to show the header area (even if empty)"},className:{control:"text",description:"Additional CSS class for the panel"},headerClassName:{control:"text",description:"Additional CSS class for the header"},contentClassName:{control:"text",description:"Additional CSS class for the content"}},parameters:{docs:{description:{component:"`Panel` is a container component that groups related content.\nIt supports an optional header and different visual styles."}}}},t={args:{header:"Basic Panel",children:e.jsx("p",{children:"This is a basic panel with a simple header and content."})}},n={args:{header:"Elevated Panel",variant:"elevated",children:e.jsx("p",{children:"This panel has the elevated styling variant applied."})}},s={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(l,{children:"Panel Variants"}),e.jsx(i,{children:"Panels can be styled in different ways to suit different uses."}),e.jsxs("div",{className:"space-y-6",children:[e.jsx(a,{header:"Unstyled header",children:e.jsx("p",{children:"Basic, unstyled panel content"})}),e.jsx(a,{header:"Unstyled header (elevated)",variant:"elevated",children:e.jsx("p",{children:"Basic, unstyled panel content with elevated styling"})}),e.jsx(a,{header:e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Panel Title"}),e.jsx(b,{icon:k,variant:"ghost",size:"sm",className:"text-font-dark-muted hover:text-font-dark"})]}),className:"bg-bg-dark",children:e.jsx("p",{className:"text-font-dark m-1 mt-0",children:"Panel with custom header content"})})]})]})},r={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(l,{children:"Nested Panels"}),e.jsx(i,{children:"Panels can be nested inside other panels to create complex layouts."}),e.jsxs(a,{header:e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Parent Panel"}),e.jsx(b,{icon:k,variant:"ghost",size:"sm",className:"text-font-dark-muted hover:text-font-dark"})]}),className:"bg-bg-dark",children:[e.jsx("p",{className:"text-font-dark m-1 mt-0",children:"Panel with header content"}),e.jsx(a,{variant:"elevated",header:e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Elevated Panel Inside Panel"}),className:"bg-bg-dark-darker shadow-lg",children:e.jsxs("div",{className:"p-1",children:[e.jsx("p",{className:"text-font-dark",children:"Elevated panel with custom padding"}),e.jsx("p",{className:"text-font-dark-muted mt-2",children:"Additional content with muted text"})]})})]})]})},d={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(l,{children:"Custom Panel Styling"}),e.jsx(i,{children:"Panels can be customized with additional CSS classes and styles."}),e.jsxs(a,{variant:"elevated",header:e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Styled Panel"}),className:"bg-bg-dark-darker shadow-lg rounded-lg",children:[e.jsx("p",{className:"text-font-dark",children:"Elevated panel with custom padding, rounded corners, and set width."}),e.jsx("p",{className:"text-font-dark-muted mt-2",children:"Additional content with muted text"})]})]})};var o,c,m;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    header: "Basic Panel",
    children: <p>This is a basic panel with a simple header and content.</p>
  }
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var h,p,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    header: "Elevated Panel",
    variant: "elevated",
    children: <p>This panel has the elevated styling variant applied.</p>
  }
}`,...(x=(p=n.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var u,f,v;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Panel Variants</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be styled in different ways to suit different
                    uses.
                </ThemeAwareBody>

                <div className="space-y-6">
                    {/* Basic Panel */}
                    <Panel header="Unstyled header">
                        <p>Basic, unstyled panel content</p>
                    </Panel>

                    <Panel header="Unstyled header (elevated)" variant="elevated">
                        <p>
                            Basic, unstyled panel content with elevated styling
                        </p>
                    </Panel>

                    {/* Panel with Custom Header */}
                    <Panel header={<div className="flex items-center justify-between w-full">
                                <h2 className="text-lg font-medium text-font-dark">
                                    Panel Title
                                </h2>
                                <IconButton icon={EditIcon} variant="ghost" size="sm" className="text-font-dark-muted hover:text-font-dark" />
                            </div>} className="bg-bg-dark">
                        <p className="text-font-dark m-1 mt-0">
                            Panel with custom header content
                        </p>
                    </Panel>
                </div>
            </div>;
  }
}`,...(v=(f=s.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var g,P,w;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Nested Panels</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be nested inside other panels to create complex
                    layouts.
                </ThemeAwareBody>

                <Panel header={<div className="flex items-center justify-between w-full">
                            <h2 className="text-lg font-medium text-font-dark">
                                Parent Panel
                            </h2>
                            <IconButton icon={EditIcon} variant="ghost" size="sm" className="text-font-dark-muted hover:text-font-dark" />
                        </div>} className="bg-bg-dark">
                    <p className="text-font-dark m-1 mt-0">
                        Panel with header content
                    </p>
                    {/* Elevated Panel */}
                    <Panel variant="elevated" header={<h2 className="text-lg font-medium text-font-dark">
                                Elevated Panel Inside Panel
                            </h2>} className="bg-bg-dark-darker shadow-lg">
                        <div className="p-1">
                            <p className="text-font-dark">
                                Elevated panel with custom padding
                            </p>
                            <p className="text-font-dark-muted mt-2">
                                Additional content with muted text
                            </p>
                        </div>
                    </Panel>
                </Panel>
            </div>;
  }
}`,...(w=(P=r.parameters)==null?void 0:P.docs)==null?void 0:w.source}}};var N,y,j;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Custom Panel Styling</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be customized with additional CSS classes and
                    styles.
                </ThemeAwareBody>

                <Panel variant="elevated" header={<h2 className="text-lg font-medium text-font-dark">
                            Styled Panel
                        </h2>} className="bg-bg-dark-darker shadow-lg rounded-lg">
                    <p className="text-font-dark">
                        Elevated panel with custom padding, rounded corners, and
                        set width.
                    </p>
                    <p className="text-font-dark-muted mt-2">
                        Additional content with muted text
                    </p>
                </Panel>
            </div>;
  }
}`,...(j=(y=d.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};const F=["Basic","Elevated","PanelVariants","NestedPanels","CustomStyling"];export{t as Basic,d as CustomStyling,n as Elevated,r as NestedPanels,s as PanelVariants,F as __namedExportsOrder,D as default};
