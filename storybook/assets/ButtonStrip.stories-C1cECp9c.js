import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w as N,p as T,I as b,U as v,A as w,c as C,d as M,q as c,M as L,r as P,T as E,a as k,b as o,s as F,P as y,k as R,C as U}from"./ThemeAwareText-aBl3ngNK.js";import"./index-CFacQ8Bc.js";import{B as r}from"./componentRegistry-C1pIfR8x.js";import"./Dropdown-DNZchKtb.js";import"./DropdownSelect-BUSKISJM.js";import{I as $}from"./IconButton-CmKgifoD.js";import"./Input-BphtCn-1.js";import{P as D}from"./PushButton-Ceh3LIjb.js";import{f as d}from"./index-DykKLRIS.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-Dv6imMev.js";import"./panel-C3E1geOT.js";import"./dropdown-BgeGm6tg.js";import"./button-Blgq2Yxg.js";const te={title:"Molecules/Buttons/ButtonStrip",component:r,tags:["autodocs"],decorators:[N]},i={args:{items:[{id:"bold",icon:e.jsx(T,{}),tooltip:"Bold"},{id:"italic",icon:e.jsx(b,{}),tooltip:"Italic"},{id:"underline",icon:e.jsx(v,{}),tooltip:"Underline"}],selectionMode:"multiple",onSelectionChange:d(n=>console.log("Text format:",n))}},l={args:{items:[{id:"left",icon:e.jsx(w,{}),tooltip:"Align Left"},{id:"center",icon:e.jsx(C,{}),tooltip:"Align Center"},{id:"right",icon:e.jsx(M,{}),tooltip:"Align Right"}],selectionMode:"single",defaultSelected:["left"],onSelectionChange:d(n=>console.log("Alignment:",n[0]))}},s={args:{items:[{id:"notifications",icon:e.jsx(c,{}),tooltip:"Toggle Notifications"},{id:"darkMode",icon:e.jsx(L,{}),tooltip:"Toggle Dark Mode"},{id:"autoSave",icon:e.jsx(P,{}),tooltip:"Toggle Auto Save"}],selectionMode:"toggle",onSelectionChange:d(n=>{const t=n[0];console.log(t?`Enabled: ${t}`:"All features disabled")})}},a={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsx(E,{children:"Button Examples"}),e.jsx(k,{children:"Various ways to use the ButtonStrip component along with stateful buttons."}),e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsxs("div",{children:[e.jsx(o,{children:"Stateful IconButton"}),e.jsx($,{icon:e.jsx(c,{}),states:{count:2,icons:[e.jsx(c,{}),e.jsx(F,{})],tooltips:["Enable Notifications","Disable Notifications"],variants:["default","bright"]},onStateChange:n=>console.log(`Notification state: ${n}`)})]}),e.jsxs("div",{children:[e.jsx(o,{children:"Stateful PushButton"}),e.jsx(D,{states:{count:3,labels:["Initial","Processing","Complete"],startIcons:[e.jsx(y,{}),e.jsx(R,{}),e.jsx(U,{})],variants:["default","ghost","bright"]},onStateChange:n=>console.log(`Button state: ${n}`),children:"Initial"})]}),e.jsxs("div",{children:[e.jsx(o,{children:"Text Formatting"}),e.jsx(r,{items:[{id:"bold",icon:e.jsx(T,{}),tooltip:"Bold"},{id:"italic",icon:e.jsx(b,{}),tooltip:"Italic"},{id:"underline",icon:e.jsx(v,{}),tooltip:"Underline"}],selectionMode:"multiple",onSelectionChange:n=>console.log("Text format:",n)})]}),e.jsxs("div",{children:[e.jsx(o,{children:"Alignment Selection"}),e.jsx(r,{items:[{id:"left",icon:e.jsx(w,{}),tooltip:"Align Left"},{id:"center",icon:e.jsx(C,{}),tooltip:"Align Center"},{id:"right",icon:e.jsx(M,{}),tooltip:"Align Right"}],selectionMode:"single",defaultSelected:["left"],onSelectionChange:n=>console.log("Alignment:",n[0])})]}),e.jsxs("div",{children:[e.jsx(o,{children:"Feature Toggles"}),e.jsx(r,{items:[{id:"notifications",icon:e.jsx(c,{}),tooltip:"Toggle Notifications"},{id:"darkMode",icon:e.jsx(L,{}),tooltip:"Toggle Dark Mode"},{id:"autoSave",icon:e.jsx(P,{}),tooltip:"Toggle Auto Save"}],selectionMode:"toggle",onSelectionChange:n=>{const t=n[0];console.log(t?`Enabled: ${t}`:"All features disabled")}})]})]})]}),args:{items:[]}};var g,u,m;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "bold",
      icon: <BoldIcon />,
      tooltip: "Bold"
    }, {
      id: "italic",
      icon: <ItalicIcon />,
      tooltip: "Italic"
    }, {
      id: "underline",
      icon: <UnderlineIcon />,
      tooltip: "Underline"
    }],
    selectionMode: "multiple",
    onSelectionChange: fn(selected => console.log("Text format:", selected))
  }
}`,...(m=(u=i.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var p,h,f;l.parameters={...l.parameters,docs:{...(p=l.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "left",
      icon: <AlignLeftIcon />,
      tooltip: "Align Left"
    }, {
      id: "center",
      icon: <AlignCenterIcon />,
      tooltip: "Align Center"
    }, {
      id: "right",
      icon: <AlignRightIcon />,
      tooltip: "Align Right"
    }],
    selectionMode: "single",
    defaultSelected: ["left"],
    onSelectionChange: fn(selected => console.log("Alignment:", selected[0]))
  }
}`,...(f=(h=l.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var x,S,I;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    items: [{
      id: "notifications",
      icon: <BellIcon />,
      tooltip: "Toggle Notifications"
    }, {
      id: "darkMode",
      icon: <MoonIcon />,
      tooltip: "Toggle Dark Mode"
    }, {
      id: "autoSave",
      icon: <SaveIcon />,
      tooltip: "Toggle Auto Save"
    }],
    selectionMode: "toggle",
    onSelectionChange: fn(selected => {
      // selected will be either [] or [buttonId]
      const feature = selected[0];
      if (feature) {
        console.log(\`Enabled: \${feature}\`);
      } else {
        console.log("All features disabled");
      }
    })
  }
}`,...(I=(S=s.parameters)==null?void 0:S.docs)==null?void 0:I.source}}};var A,B,j;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    return <div className="space-y-6">
                <ThemeAwareHeading>Button Examples</ThemeAwareHeading>
                <ThemeAwareBody>
                    Various ways to use the ButtonStrip component along with
                    stateful buttons.
                </ThemeAwareBody>

                <div className="flex gap-4 flex-wrap">
                    {/* IconButton with states */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Stateful IconButton
                        </ThemeAwareSectionLabel>
                        <IconButton icon={<BellIcon />} states={{
            count: 2,
            icons: [<BellIcon />, <BellFilledIcon />],
            tooltips: ["Enable Notifications", "Disable Notifications"],
            variants: ["default", "bright"]
          }} onStateChange={state => console.log(\`Notification state: \${state}\`)} />
                    </div>

                    {/* PushButton with states */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Stateful PushButton
                        </ThemeAwareSectionLabel>
                        <PushButton states={{
            count: 3,
            labels: ["Initial", "Processing", "Complete"],
            startIcons: [<PlayIcon />, <PauseIcon />, <CheckIcon />],
            variants: ["default", "ghost", "bright"]
          }} onStateChange={state => console.log(\`Button state: \${state}\`)}>
                            Initial
                        </PushButton>
                    </div>

                    {/* ButtonStrip for text formatting */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Text Formatting
                        </ThemeAwareSectionLabel>
                        <ButtonStrip items={[{
            id: "bold",
            icon: <BoldIcon />,
            tooltip: "Bold"
          }, {
            id: "italic",
            icon: <ItalicIcon />,
            tooltip: "Italic"
          }, {
            id: "underline",
            icon: <UnderlineIcon />,
            tooltip: "Underline"
          }]} selectionMode="multiple" onSelectionChange={selected => console.log("Text format:", selected)} />
                    </div>

                    {/* ButtonStrip for alignment selection */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Alignment Selection
                        </ThemeAwareSectionLabel>
                        <ButtonStrip items={[{
            id: "left",
            icon: <AlignLeftIcon />,
            tooltip: "Align Left"
          }, {
            id: "center",
            icon: <AlignCenterIcon />,
            tooltip: "Align Center"
          }, {
            id: "right",
            icon: <AlignRightIcon />,
            tooltip: "Align Right"
          }]} selectionMode="single" defaultSelected={["left"]} onSelectionChange={selected => console.log("Alignment:", selected[0])} />
                    </div>

                    {/* ButtonStrip with toggle mode */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Feature Toggles
                        </ThemeAwareSectionLabel>
                        <ButtonStrip items={[{
            id: "notifications",
            icon: <BellIcon />,
            tooltip: "Toggle Notifications"
          }, {
            id: "darkMode",
            icon: <MoonIcon />,
            tooltip: "Toggle Dark Mode"
          }, {
            id: "autoSave",
            icon: <SaveIcon />,
            tooltip: "Toggle Auto Save"
          }]} selectionMode="toggle" onSelectionChange={selected => {
            // selected will be either [] or [buttonId]
            const feature = selected[0];
            if (feature) {
              console.log(\`Enabled: \${feature}\`);
            } else {
              console.log("All features disabled");
            }
          }} />
                    </div>
                </div>
            </div>;
  },
  args: {
    // Minimum required props
    items: []
  }
}`,...(j=(B=a.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};const oe=["TextFormatting","AlignmentOptions","FeatureToggles","ButtonExamples"];export{l as AlignmentOptions,a as ButtonExamples,s as FeatureToggles,i as TextFormatting,oe as __namedExportsOrder,te as default};
