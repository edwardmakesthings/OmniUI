import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as T,T as c,a as d,X as p}from"./ThemeAwareText-aBl3ngNK.js";import{r as h}from"./index-CFacQ8Bc.js";import{D as s,P as I}from"./componentRegistry-C1pIfR8x.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import{I as f}from"./IconButton-CmKgifoD.js";import"./Input-BphtCn-1.js";import{P as r}from"./PushButton-Ceh3LIjb.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const G={title:"Atoms/Overlay/Drawer",component:s,tags:["autodocs"],decorators:[T],parameters:{layout:"fullscreen",docs:{description:{component:"`Drawer` is a slide-in panel component that appears from the edges of the screen.\nIt can be configured to appear from left, right, top, or bottom edges and\nsupports custom width/height and backdrop options."}}},argTypes:{variant:{control:"select",options:["left","right","top","bottom"],description:"Determines which edge the drawer slides in from"},width:{control:"text",description:"Width of the drawer when using left/right variants"},height:{control:"text",description:"Height of the drawer when using top/bottom variants"},closeOnOverlayClick:{control:"boolean",description:"Whether clicking the backdrop closes the drawer"},closeOnEscape:{control:"boolean",description:"Whether pressing Escape key closes the drawer"},showOverlay:{control:"boolean",description:"Whether to show a backdrop overlay"}}},a={render:()=>{const[n,t]=h.useState(!1);return e.jsxs("div",{className:"p-6 space-y-6 h-200 flex flex-col justify-center",children:[e.jsx(c,{children:"Left Drawer"}),e.jsx(d,{children:"A drawer that slides in from the left side of the screen."}),e.jsx(r,{onClick:()=>t(!0),children:"Open Left Drawer"}),e.jsx(s,{open:n,onClose:()=>t(!1),variant:"left",width:480,showOverlay:!1,children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-accent-dark-neutral shrink-0",children:[e.jsx("h2",{className:"text-lg font-bold",children:"Drawer Title"}),e.jsx(f,{icon:p,variant:"ghost",onClick:()=>t(!1)})]}),e.jsx("div",{className:"flex-1 overflow-y-auto p-4",children:Array.from({length:20},(A,m)=>e.jsxs("div",{className:"mb-4 p-4 bg-bg-dark-darker border border-accent-dark-neutral rounded",children:[e.jsxs("h3",{className:"text-font-dark font-medium",children:["Item ",m+1]}),e.jsx("p",{className:"text-font-dark-muted mt-2",children:"This is a content item that demonstrates proper scrolling behavior in the drawer content area."})]},m))}),e.jsxs("div",{className:"flex justify-end gap-2 p-4 border-t border-accent-dark-neutral shrink-0",children:[e.jsx(r,{variant:"ghost",onClick:()=>t(!1),children:"Cancel"}),e.jsx(r,{variant:"bright",children:"Save"})]})]})})]})}},o={render:()=>{const[n,t]=h.useState(!1);return e.jsxs("div",{className:"p-6 space-y-6 h-200 flex flex-col justify-center",children:[e.jsx(c,{children:"Right Drawer"}),e.jsx(d,{children:"A drawer that slides in from the right side of the screen."}),e.jsx(r,{onClick:()=>t(!0),children:"Open Right Drawer"}),e.jsx(s,{open:n,onClose:()=>t(!1),variant:"right",width:400,children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-accent-dark-neutral",children:[e.jsx("h2",{className:"text-lg font-bold",children:"Settings"}),e.jsx(f,{icon:p,variant:"ghost",onClick:()=>t(!1)})]}),e.jsx("div",{className:"flex-1 p-4 overflow-auto",children:e.jsx("p",{children:"Right drawer content with custom width."})})]})})]})}},i={render:()=>{const[n,t]=h.useState(!1);return e.jsxs("div",{className:"p-6 space-y-6 h-200 flex flex-col justify-center",children:[e.jsx(c,{children:"Unstyled Right Drawer"}),e.jsx(d,{children:"A drawer that uses a Panel component for its content."}),e.jsx(r,{onClick:()=>t(!0),children:"Open Right Drawer (Unstyled)"}),e.jsx(s,{open:n,onClose:()=>t(!1),variant:"right",width:400,children:e.jsx(I,{header:"Unstyled Test",children:e.jsx("p",{children:"Unstyled right drawer content with custom width."})})})]})}},l={render:()=>{const[n,t]=h.useState(!1);return e.jsxs("div",{className:"p-6 space-y-6 h-200 flex flex-col justify-center",children:[e.jsx(c,{children:"Top Drawer"}),e.jsx(d,{children:"A drawer that slides in from the top of the screen."}),e.jsx(r,{onClick:()=>t(!0),children:"Open Top Drawer"}),e.jsx(s,{open:n,onClose:()=>t(!1),variant:"top",height:320,children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-accent-dark-neutral",children:[e.jsx("h2",{className:"text-lg font-bold",children:"Notifications"}),e.jsx(f,{icon:p,variant:"ghost",onClick:()=>t(!1)})]}),e.jsx("div",{className:"flex-1 p-4 overflow-auto",children:e.jsx("p",{children:"Top drawer content with custom height."})})]})})]})}};var u,w,x;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Left Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the left side of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Left Drawer
                </PushButton>

                <Drawer open={isOpen} onClose={() => setIsOpen(false)} variant="left" width={480} showOverlay={false}>
                    <div className="flex flex-col h-full">
                        {/* Header - Fixed height */}
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral shrink-0">
                            <h2 className="text-lg font-bold">Drawer Title</h2>
                            <IconButton icon={XIcon} variant="ghost" onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Demo content */}
                            {Array.from({
              length: 20
            }, (_, i) => <div key={i} className="mb-4 p-4 bg-bg-dark-darker border border-accent-dark-neutral rounded">
                                    <h3 className="text-font-dark font-medium">
                                        Item {i + 1}
                                    </h3>
                                    <p className="text-font-dark-muted mt-2">
                                        This is a content item that demonstrates
                                        proper scrolling behavior in the drawer
                                        content area.
                                    </p>
                                </div>)}
                        </div>

                        {/* Footer - Fixed height */}
                        <div className="flex justify-end gap-2 p-4 border-t border-accent-dark-neutral shrink-0">
                            <PushButton variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancel
                            </PushButton>
                            <PushButton variant="bright">Save</PushButton>
                        </div>
                    </div>
                </Drawer>
            </div>;
  }
}`,...(x=(w=a.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var g,v,j;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Right Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the right side of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Right Drawer
                </PushButton>

                <Drawer open={isOpen} onClose={() => setIsOpen(false)} variant="right" width={400}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                            <h2 className="text-lg font-bold">Settings</h2>
                            <IconButton icon={XIcon} variant="ghost" onClick={() => setIsOpen(false)} />
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <p>Right drawer content with custom width.</p>
                        </div>
                    </div>
                </Drawer>
            </div>;
  }
}`,...(j=(v=o.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var b,y,O;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Unstyled Right Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that uses a Panel component for its content.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Right Drawer (Unstyled)
                </PushButton>

                <Drawer open={isOpen} onClose={() => setIsOpen(false)} variant="right" width={400}>
                    <Panel header="Unstyled Test">
                        <p>Unstyled right drawer content with custom width.</p>
                    </Panel>
                </Drawer>
            </div>;
  }
}`,...(O=(y=i.parameters)==null?void 0:y.docs)==null?void 0:O.source}}};var k,N,D;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Top Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the top of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Top Drawer
                </PushButton>

                <Drawer open={isOpen} onClose={() => setIsOpen(false)} variant="top" height={320}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                            <h2 className="text-lg font-bold">Notifications</h2>
                            <IconButton icon={XIcon} variant="ghost" onClick={() => setIsOpen(false)} />
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <p>Top drawer content with custom height.</p>
                        </div>
                    </div>
                </Drawer>
            </div>;
  }
}`,...(D=(N=l.parameters)==null?void 0:N.docs)==null?void 0:D.source}}};const J=["LeftDrawer","RightDrawer","UnstyledRightDrawer","TopDrawer"];export{a as LeftDrawer,o as RightDrawer,l as TopDrawer,i as UnstyledRightDrawer,J as __namedExportsOrder,G as default};
