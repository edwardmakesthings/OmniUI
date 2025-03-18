import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as v,T as f,a as x,S as g}from"./ThemeAwareText-aBl3ngNK.js";import{r as u}from"./index-CFacQ8Bc.js";import{M as i,b as k}from"./componentRegistry-C1pIfR8x.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import"./IconButton-CmKgifoD.js";import"./Input-BphtCn-1.js";import{P as n}from"./PushButton-Ceh3LIjb.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const R={title:"Atoms/Overlay/Modal",component:i,tags:["autodocs"],decorators:[v],parameters:{layout:"centered",docs:{description:{component:"`Modal` is a dialog component that appears on top of the app content.\nIt captures focus and requires user interaction before returning to the main content."}}},argTypes:{title:{description:"Content for the modal header"},footer:{description:"Content for the modal footer"},open:{control:"boolean",description:"Controls whether the modal is visible"},onClose:{description:"Callback when the modal is requested to close"},variant:{control:"select",options:["default","elevated"],description:"Visual style variant of the modal"},width:{control:"text",description:"Width of the modal"},maxHeight:{control:"text",description:"Maximum height of the modal before content scrolls"},closeOnBackdropClick:{control:"boolean",description:"Whether clicking the backdrop closes the modal"},closeOnEscape:{control:"boolean",description:"Whether pressing Escape key closes the modal"},showHeader:{control:"boolean",description:"Whether to show the header section"},showFooter:{control:"boolean",description:"Whether to show the footer section"}}},s={render:()=>{const[o,t]=u.useState(!1);return e.jsxs("div",{className:"space-y-6 h-80 flex flex-col justify-center",children:[e.jsx(f,{children:"Basic Modal"}),e.jsx(x,{children:"A simple modal with a title, content, and footer."}),e.jsx(n,{variant:"bright",onClick:()=>t(!0),children:"Open Basic Modal"}),e.jsx(i,{open:o,onClose:()=>t(!1),title:e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Basic Modal"}),footer:e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsx(n,{variant:"ghost",onClick:()=>t(!1),children:"Cancel"}),e.jsx(n,{variant:"bright",onClick:()=>t(!1),children:"Confirm"})]}),className:"bg-bg-dark",children:e.jsxs("div",{className:"p-6",children:[e.jsx("p",{className:"text-font-dark",children:"This is a basic modal with header and footer."}),e.jsx("p",{className:"text-font-dark-muted mt-3",children:"Additional content can be added here."})]})})]})}},a={render:()=>{const[o,t]=u.useState(!1);return e.jsxs("div",{className:"space-y-6 h-120 flex flex-col justify-center",children:[e.jsx(f,{children:"Complex Modal"}),e.jsx(x,{children:"A more complex modal with a scrollable content area, custom width, and elevated styling."}),e.jsx(n,{variant:"ghost",onClick:()=>t(!0),children:"Open Complex Modal"}),e.jsx(i,{open:o,onClose:()=>t(!1),variant:"elevated",width:600,title:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(g,{className:"text-font-dark"}),e.jsx("h2",{className:"text-lg font-medium text-font-dark",children:"Search Results"})]}),footer:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("span",{className:"text-font-dark-muted text-sm",children:"Showing 20 of 100 results"}),e.jsxs("div",{className:"space-x-3 flex",children:[e.jsx(n,{variant:"ghost",onClick:()=>t(!1),children:"Cancel"}),e.jsx(n,{variant:"bright",onClick:()=>t(!1),children:"Apply"})]})]}),className:"bg-bg-dark-darker",children:e.jsx(k,{maxHeight:400,children:e.jsx("div",{className:"divide-y divide-accent-dark-neutral",children:Array.from({length:20},(j,r)=>e.jsxs("div",{className:"p-3 hover:bg-bg-dark transition-colors",children:[e.jsxs("h3",{className:"text-font-dark font-medium",children:["Result Item ",r+1]}),e.jsxs("p",{className:"text-font-dark-muted mt-1",children:["Description for result item ",r+1]})]},r))})})})]})}};var l,c,d;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="space-y-6 h-80 flex flex-col justify-center">
                <ThemeAwareHeading>Basic Modal</ThemeAwareHeading>
                <ThemeAwareBody>
                    A simple modal with a title, content, and footer.
                </ThemeAwareBody>

                <PushButton variant="bright" onClick={() => setIsOpen(true)}>
                    Open Basic Modal
                </PushButton>

                <Modal open={isOpen} onClose={() => setIsOpen(false)} title={<h2 className="text-lg font-medium text-font-dark">
                            Basic Modal
                        </h2>} footer={<div className="flex justify-end space-x-3">
                            <PushButton variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancel
                            </PushButton>
                            <PushButton variant="bright" onClick={() => setIsOpen(false)}>
                                Confirm
                            </PushButton>
                        </div>} className="bg-bg-dark">
                    <div className="p-6">
                        <p className="text-font-dark">
                            This is a basic modal with header and footer.
                        </p>
                        <p className="text-font-dark-muted mt-3">
                            Additional content can be added here.
                        </p>
                    </div>
                </Modal>
            </div>;
  }
}`,...(d=(c=s.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var m,h,p;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="space-y-6 h-120 flex flex-col justify-center">
                <ThemeAwareHeading>Complex Modal</ThemeAwareHeading>
                <ThemeAwareBody>
                    A more complex modal with a scrollable content area, custom
                    width, and elevated styling.
                </ThemeAwareBody>

                <PushButton variant="ghost" onClick={() => setIsOpen(true)}>
                    Open Complex Modal
                </PushButton>

                <Modal open={isOpen} onClose={() => setIsOpen(false)} variant="elevated" width={600} title={<div className="flex items-center space-x-3">
                            <SearchIcon className="text-font-dark" />
                            <h2 className="text-lg font-medium text-font-dark">
                                Search Results
                            </h2>
                        </div>} footer={<div className="flex justify-between items-center w-full">
                            <span className="text-font-dark-muted text-sm">
                                Showing 20 of 100 results
                            </span>
                            <div className="space-x-3 flex">
                                <PushButton variant="ghost" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </PushButton>
                                <PushButton variant="bright" onClick={() => setIsOpen(false)}>
                                    Apply
                                </PushButton>
                            </div>
                        </div>} className="bg-bg-dark-darker">
                    <ScrollBox maxHeight={400}>
                        <div className="divide-y divide-accent-dark-neutral">
                            {Array.from({
              length: 20
            }, (_, i) => <div key={i} className="p-3 hover:bg-bg-dark transition-colors">
                                    <h3 className="text-font-dark font-medium">
                                        Result Item {i + 1}
                                    </h3>
                                    <p className="text-font-dark-muted mt-1">
                                        Description for result item {i + 1}
                                    </p>
                                </div>)}
                        </div>
                    </ScrollBox>
                </Modal>
            </div>;
  }
}`,...(p=(h=a.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};const W=["Basic","Complex"];export{s as Basic,a as Complex,W as __namedExportsOrder,R as default};
