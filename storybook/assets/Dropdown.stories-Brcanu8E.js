import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{D as r}from"./Dropdown-DNZchKtb.js";import{w as q,E as F,G as J,C as K,X as Q,b as p}from"./ThemeAwareText-aBl3ngNK.js";import"./index-CFacQ8Bc.js";import"./dropdown-BgeGm6tg.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";const ae={title:"Atoms/Controls/DropdownButton",component:r,tags:["autodocs"],argTypes:{label:{control:"text",description:"The text or node displayed on the button"},options:{description:"Array of options to display in the dropdown"},variant:{control:"select",options:["default","ghost","bright","outline"],description:"Visual style variant of the dropdown"},disabled:{control:"boolean",description:"Whether the dropdown is disabled"},showCaret:{control:"boolean",description:"Whether to show the dropdown caret icon"},closeOnBlur:{control:"boolean",description:"Whether to close the dropdown when clicking outside"},closeOnMouseLeave:{control:"boolean",description:"Whether to close the dropdown when the mouse leaves"},closeDelay:{control:"number",description:"Delay in ms before closing (for mouseLeave)"},onOpenChange:{description:"Callback when dropdown opens or closes"}},args:{label:"Dropdown",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}],variant:"default",showCaret:!0,closeOnBlur:!0,closeOnMouseLeave:!1,closeDelay:150},decorators:[q],parameters:{docs:{description:{component:"`DropdownButton` is a button that displays a dropdown menu when clicked.\nIt supports various options, icons, and customizations."}}}},o={args:{label:"Dropdown",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]}},n={args:{label:"Actions",options:[{label:"Edit",value:"edit",icon:e.jsx(F,{size:16})},{label:"Settings",value:"settings",icon:e.jsx(J,{size:16})},{label:"Approve",value:"approve",icon:e.jsx(K,{size:16})},{label:"Reject",value:"reject",icon:e.jsx(Q,{size:16})}]}},a={render:()=>e.jsxs("div",{className:"flex flex-col items-start gap-4",children:[e.jsx(p,{uppercase:!0,children:"Default"}),e.jsx(r,{label:"Default",variant:"default",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(p,{uppercase:!0,children:"Ghost"}),e.jsx(r,{label:"Ghost",variant:"ghost",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(p,{uppercase:!0,children:"Bright"}),e.jsx(r,{label:"Bright",variant:"bright",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(p,{uppercase:!0,children:"Outline"}),e.jsx(r,{label:"Outline",variant:"outline",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]})]})},t={args:{label:"Disabled Dropdown",disabled:!0,options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}},l={args:{label:"Dropdown with Disabled Options",options:[{label:"Available Option",value:"1"},{label:"Disabled Option",value:"2",disabled:!0},{label:"Another Available Option",value:"3"}]}},s={args:{label:"Hover Out to Close",closeOnMouseLeave:!0,closeDelay:300,options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]}},i={args:{label:"Interactive Options",options:[{label:"Click me",value:"click",onClick:()=>alert("Option 1 clicked!")},{label:"Click me too",value:"click2",onClick:()=>alert("Option 2 clicked!")}]}};var c,d,u,b,v;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: "Dropdown",
    options: [{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }, {
      label: "Option 3",
      value: "3"
    }]
  }
}`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source},description:{story:"Default dropdown button with basic options.",...(v=(b=o.parameters)==null?void 0:b.docs)==null?void 0:v.description}}};var m,h,O,w,D;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Actions",
    options: [{
      label: "Edit",
      value: "edit",
      icon: <EditIcon size={16} />
    }, {
      label: "Settings",
      value: "settings",
      icon: <GearIcon size={16} />
    }, {
      label: "Approve",
      value: "approve",
      icon: <CheckIcon size={16} />
    }, {
      label: "Reject",
      value: "reject",
      icon: <XIcon size={16} />
    }]
  }
}`,...(O=(h=n.parameters)==null?void 0:h.docs)==null?void 0:O.source},description:{story:"Dropdown with icons in the options.",...(D=(w=n.parameters)==null?void 0:w.docs)==null?void 0:D.description}}};var g,f,k,x,C;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <DropdownButton label="Default" variant="default" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <DropdownButton label="Ghost" variant="ghost" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <DropdownButton label="Bright" variant="bright" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <DropdownButton label="Outline" variant="outline" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />
        </div>
}`,...(k=(f=a.parameters)==null?void 0:f.docs)==null?void 0:k.source},description:{story:"Different style variants of the dropdown.",...(C=(x=a.parameters)==null?void 0:x.docs)==null?void 0:C.description}}};var A,j,y,S,L;t.parameters={...t.parameters,docs:{...(A=t.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: "Disabled Dropdown",
    disabled: true,
    options: [{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]
  }
}`,...(y=(j=t.parameters)==null?void 0:j.docs)==null?void 0:y.source},description:{story:"Dropdown in disabled state.",...(L=(S=t.parameters)==null?void 0:S.docs)==null?void 0:L.description}}};var B,I,T,z,W;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: "Dropdown with Disabled Options",
    options: [{
      label: "Available Option",
      value: "1"
    }, {
      label: "Disabled Option",
      value: "2",
      disabled: true
    }, {
      label: "Another Available Option",
      value: "3"
    }]
  }
}`,...(T=(I=l.parameters)==null?void 0:I.docs)==null?void 0:T.source},description:{story:"Dropdown with disabled options.",...(W=(z=l.parameters)==null?void 0:z.docs)==null?void 0:W.description}}};var E,G,M,H,R;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: "Hover Out to Close",
    closeOnMouseLeave: true,
    closeDelay: 300,
    options: [{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }, {
      label: "Option 3",
      value: "3"
    }]
  }
}`,...(M=(G=s.parameters)==null?void 0:G.docs)==null?void 0:M.source},description:{story:"Dropdown that closes when mouse leaves.",...(R=(H=s.parameters)==null?void 0:H.docs)==null?void 0:R.description}}};var V,X,N,_,P;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: "Interactive Options",
    options: [{
      label: "Click me",
      value: "click",
      onClick: () => alert("Option 1 clicked!")
    }, {
      label: "Click me too",
      value: "click2",
      onClick: () => alert("Option 2 clicked!")
    }]
  }
}`,...(N=(X=i.parameters)==null?void 0:X.docs)==null?void 0:N.source},description:{story:"Dropdown with custom click handlers for options.",...(P=(_=i.parameters)==null?void 0:_.docs)==null?void 0:P.description}}};const te=["Default","WithIcons","Variants","Disabled","DisabledOptions","CloseOnMouseLeave","WithClickHandlers"];export{s as CloseOnMouseLeave,o as Default,t as Disabled,l as DisabledOptions,a as Variants,i as WithClickHandlers,n as WithIcons,te as __namedExportsOrder,ae as default};
