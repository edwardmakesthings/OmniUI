import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as y,T as N,a as j,E as C,S as B}from"./ThemeAwareText-Dzv815Gu.js";import"./index-CFacQ8Bc.js";import{T as r,P as c,b as S}from"./componentRegistry-Bydd8upc.js";import"./Dropdown-BYWDEqO5.js";import"./DropdownSelect-C_xrwEPZ.js";import"./IconButton-BMcvz6tv.js";import"./Input-B6MG042b.js";import{P as n}from"./PushButton-Cr_VAFuk.js";import"./iframe-CiDI7u4-.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-CQ0JLh54.js";import"./panel-CTYQAhhj.js";import"./dropdown-wJJ0wzB7.js";import"./button-CUq80kjz.js";const U={title:"Atoms/Navigation/Tabs",component:r,tags:["autodocs"],decorators:[y],argTypes:{tabs:{description:"Array of tab objects with id, label, and content"},variant:{control:"select",options:["default","inset"],description:"Visual style variant of the tabs"},defaultTab:{control:"text",description:"ID of the initially selected tab (uncontrolled mode)"},selectedTab:{control:"text",description:"ID of the selected tab (controlled mode)"},disabled:{control:"boolean",description:"Whether the entire tabs component is disabled"},onTabChange:{description:"Called when the selected tab changes"}},parameters:{docs:{description:{component:"`Tabs` provides a way to organize content into multiple sections.\nEach tab panel can contain any content, and only one panel is shown at a time."}}}},t={args:{variant:"default",tabs:[{id:"tab1",label:"First Tab",content:e.jsx("div",{className:"p-4",children:"Content for the first tab"})},{id:"tab2",label:"Second Tab",content:e.jsx("div",{className:"p-4",children:"Content for the second tab"})},{id:"tab3",label:"Third Tab",content:e.jsx("div",{className:"p-4",children:"Content for the third tab"})}]}},a={args:{variant:"inset",tabs:[{id:"tab1",label:"First Tab",content:e.jsx("div",{className:"p-4",children:"Content for the first tab"})},{id:"tab2",label:"Second Tab",content:e.jsx("div",{className:"p-4",children:"Content for the second tab"})},{id:"tab3",label:"Third Tab",content:e.jsx("div",{className:"p-4",children:"Content for the third tab"})}]}},s={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(N,{children:"Tabs with Button Content"}),e.jsx(j,{children:"Tabs can contain various types of content, including buttons and other interactive elements."}),e.jsx(r,{variant:"default",tabs:[{id:"tab1",label:"First Tab",content:e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx(n,{endIcon:C,variant:"ghost",children:"Continue"}),e.jsx(n,{disabled:!0,children:"Unavailable"})]})},{id:"tab2",label:"Second Tab",content:e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx(n,{children:"Click Me"}),e.jsx(n,{startIcon:B,variant:"bright",children:"Search"})]})}]})]}),args:{tabs:[]}},i={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(N,{children:"Nested Tabs"}),e.jsx(j,{children:"Tabs can be nested within other tabs to create hierarchical navigation."}),e.jsx(r,{variant:"default",tabs:[{id:"settings",label:"Settings",content:e.jsx(r,{variant:"inset",tabs:[{id:"general",label:"General",content:e.jsx(c,{variant:"elevated",header:"General Settings",children:e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx("p",{className:"text-font-dark-muted",children:"Configure basic application settings here."}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(n,{variant:"ghost",children:"Reset"}),e.jsx(n,{variant:"bright",children:"Save"})]})]})})},{id:"appearance",label:"Appearance",content:e.jsx(c,{variant:"elevated",className:"mt-4",children:e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Appearance Settings"}),e.jsx("p",{className:"text-font-dark-muted",children:"Customize the look and feel of the application."}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(n,{variant:"ghost",children:"Reset Theme"}),e.jsx(n,{variant:"bright",children:"Apply"})]})]})})}]})},{id:"content",label:"Content",content:e.jsx(S,{maxHeight:400,variant:"inset",className:"mt-4",children:e.jsxs("div",{className:"space-y-4 p-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Content Management"}),Array.from({length:5},(P,o)=>e.jsxs("div",{className:"p-4 bg-bg-dark border border-accent-dark-neutral rounded",children:[e.jsxs("h4",{className:"font-medium",children:["Content Item ",o+1]}),e.jsx("p",{className:"text-font-dark-muted mt-2",children:"This is a content item that demonstrates scrolling behavior in the tab panel area."})]},o))]})})}]})]}),args:{tabs:[]}};var d,l,h;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: "default",
    tabs: [{
      id: "tab1",
      label: "First Tab",
      content: <div className="p-4">Content for the first tab</div>
    }, {
      id: "tab2",
      label: "Second Tab",
      content: <div className="p-4">Content for the second tab</div>
    }, {
      id: "tab3",
      label: "Third Tab",
      content: <div className="p-4">Content for the third tab</div>
    }]
  }
}`,...(h=(l=t.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};var b,m,p;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    variant: "inset",
    tabs: [{
      id: "tab1",
      label: "First Tab",
      content: <div className="p-4">Content for the first tab</div>
    }, {
      id: "tab2",
      label: "Second Tab",
      content: <div className="p-4">Content for the second tab</div>
    }, {
      id: "tab3",
      label: "Third Tab",
      content: <div className="p-4">Content for the third tab</div>
    }]
  }
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,v,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Tabs with Button Content</ThemeAwareHeading>
                <ThemeAwareBody>
                    Tabs can contain various types of content, including buttons
                    and other interactive elements.
                </ThemeAwareBody>

                <Tabs variant="default" tabs={[{
        id: "tab1",
        label: "First Tab",
        content: <div className="space-y-4 p-4">
                                    <PushButton endIcon={EditIcon} variant="ghost">
                                        Continue
                                    </PushButton>
                                    <PushButton disabled>
                                        Unavailable
                                    </PushButton>
                                </div>
      }, {
        id: "tab2",
        label: "Second Tab",
        content: <div className="space-y-4 p-4">
                                    <PushButton>Click Me</PushButton>
                                    <PushButton startIcon={SearchIcon} variant="bright">
                                        Search
                                    </PushButton>
                                </div>
      }]} />
            </div>;
  },
  args: {
    // Minimum required props
    tabs: []
  }
}`,...(g=(v=s.parameters)==null?void 0:v.docs)==null?void 0:g.source}}};var x,T,f;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Nested Tabs</ThemeAwareHeading>
                <ThemeAwareBody>
                    Tabs can be nested within other tabs to create hierarchical
                    navigation.
                </ThemeAwareBody>

                <Tabs variant="default" tabs={[{
        id: "settings",
        label: "Settings",
        content: <Tabs variant="inset" tabs={[{
          id: "general",
          label: "General",
          content: <Panel variant="elevated" header="General Settings">
                                                    <div className="space-y-4 p-4">
                                                        <p className="text-font-dark-muted">
                                                            Configure basic
                                                            application settings
                                                            here.
                                                        </p>
                                                        <div className="space-x-2">
                                                            <PushButton variant="ghost">
                                                                Reset
                                                            </PushButton>
                                                            <PushButton variant="bright">
                                                                Save
                                                            </PushButton>
                                                        </div>
                                                    </div>
                                                </Panel>
        }, {
          id: "appearance",
          label: "Appearance",
          content: <Panel variant="elevated" className="mt-4">
                                                    <div className="space-y-4 p-4">
                                                        <h3 className="text-lg font-semibold">
                                                            Appearance Settings
                                                        </h3>
                                                        <p className="text-font-dark-muted">
                                                            Customize the look
                                                            and feel of the
                                                            application.
                                                        </p>
                                                        <div className="space-x-2">
                                                            <PushButton variant="ghost">
                                                                Reset Theme
                                                            </PushButton>
                                                            <PushButton variant="bright">
                                                                Apply
                                                            </PushButton>
                                                        </div>
                                                    </div>
                                                </Panel>
        }]} />
      }, {
        id: "content",
        label: "Content",
        content: <ScrollBox maxHeight={400} variant="inset" className="mt-4">
                                    <div className="space-y-4 p-4">
                                        <h3 className="text-lg font-semibold">
                                            Content Management
                                        </h3>
                                        {Array.from({
              length: 5
            }, (_, i) => <div key={i} className="p-4 bg-bg-dark border border-accent-dark-neutral rounded">
                                                <h4 className="font-medium">
                                                    Content Item {i + 1}
                                                </h4>
                                                <p className="text-font-dark-muted mt-2">
                                                    This is a content item that
                                                    demonstrates scrolling
                                                    behavior in the tab panel
                                                    area.
                                                </p>
                                            </div>)}
                                    </div>
                                </ScrollBox>
      }]} />
            </div>;
  },
  args: {
    // Minimum required props
    tabs: []
  }
}`,...(f=(T=i.parameters)==null?void 0:T.docs)==null?void 0:f.source}}};const O=["DefaultTabs","InsetTabs","TabsWithButtons","NestedTabs"];export{t as DefaultTabs,a as InsetTabs,i as NestedTabs,s as TabsWithButtons,O as __namedExportsOrder,U as default};
