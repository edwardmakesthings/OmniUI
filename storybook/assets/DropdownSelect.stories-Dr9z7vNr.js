import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{D as a}from"./DropdownSelect-C_xrwEPZ.js";import{w as re,b as l,E as ie,G as ce,C as pe,X as de}from"./ThemeAwareText-Dzv815Gu.js";import{r as se}from"./index-CFacQ8Bc.js";import"./dropdown-wJJ0wzB7.js";import"./iframe-CiDI7u4-.js";import"./_commonjsHelpers-CqkleIqs.js";const we={title:"Atoms/Controls/DropdownSelect",component:a,tags:["autodocs"],argTypes:{value:{description:"Selected value(s) - string for single select, string[] for multiple"},onChange:{description:"Callback when selection changes"},label:{description:"Label to display instead of the selected value"},placeholder:{control:"text",description:"Text to display when no option is selected"},options:{description:"Array of options to display in the dropdown"},multiple:{control:"boolean",description:"Whether multiple options can be selected"},variant:{control:"select",options:["default","ghost","bright","outline"],description:"Visual style variant of the dropdown"},disabled:{control:"boolean",description:"Whether the dropdown is disabled"},showCaret:{control:"boolean",description:"Whether to show the dropdown caret icon"},closeOnSelect:{control:"boolean",description:"Whether to close the dropdown after selection"}},args:{placeholder:"Select an option",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}],variant:"default",showCaret:!0,closeOnBlur:!0,multiple:!1},decorators:[re],parameters:{docs:{description:{component:"`DropdownSelect` is a form control that displays a dropdown list of options.\nIt supports single and multiple selection, and can be customized with icons and placeholders."}}}},o={args:{placeholder:"Select an option",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]}},s={args:{value:"2",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]}},r={render:()=>{const[t,n]=se.useState([]);return e.jsxs("div",{className:"space-y-4",children:[e.jsx(l,{uppercase:!0,children:"Multi-Select Dropdown"}),e.jsx(a,{placeholder:"Select multiple options",multiple:!0,value:t,onChange:v=>n(v),options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"},{label:"Option 4",value:"4"}]}),e.jsxs("div",{className:"mt-2",children:["Selected: ",t.length?t.join(", "):"None"]})]})}},i={args:{placeholder:"Select an action",options:[{label:"Edit",value:"edit",icon:e.jsx(ie,{size:16})},{label:"Settings",value:"settings",icon:e.jsx(ce,{size:16})},{label:"Approve",value:"approve",icon:e.jsx(pe,{size:16})},{label:"Reject",value:"reject",icon:e.jsx(de,{size:16})}]}},c={render:()=>e.jsxs("div",{className:"flex flex-col items-start gap-4",children:[e.jsx(l,{uppercase:!0,children:"Default"}),e.jsx(a,{placeholder:"Default variant",variant:"default",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(l,{uppercase:!0,children:"Ghost"}),e.jsx(a,{placeholder:"Ghost variant",variant:"ghost",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(l,{uppercase:!0,children:"Bright"}),e.jsx(a,{placeholder:"Bright variant",variant:"bright",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}),e.jsx(l,{uppercase:!0,children:"Outline"}),e.jsx(a,{placeholder:"Outline variant",variant:"outline",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]})]})},p={args:{placeholder:"Disabled dropdown",disabled:!0,options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"}]}},d={args:{placeholder:"Some options disabled",options:[{label:"Available Option",value:"1"},{label:"Disabled Option",value:"2",disabled:!0},{label:"Another Available Option",value:"3"}]}},u={args:{label:e.jsx("span",{className:"text-accent-dark-bright",children:"Custom Label"}),options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]}},b={render:()=>{const[t,n]=se.useState("");return e.jsxs("div",{className:"space-y-4",children:[e.jsx(l,{uppercase:!0,children:"Controlled Dropdown"}),e.jsx(a,{placeholder:"Select an option",value:t,onChange:v=>n(v),options:[{label:"Red",value:"red"},{label:"Green",value:"green"},{label:"Blue",value:"blue"}]}),e.jsxs("div",{className:"mt-2",children:["Selected: ",t||"None"]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>n("red"),className:"px-2 py-1 bg-red-500 text-white rounded",children:"Set Red"}),e.jsx("button",{onClick:()=>n("green"),className:"px-2 py-1 bg-green-500 text-white rounded",children:"Set Green"}),e.jsx("button",{onClick:()=>n("blue"),className:"px-2 py-1 bg-blue-500 text-white rounded",children:"Set Blue"}),e.jsx("button",{onClick:()=>n(""),className:"px-2 py-1 bg-gray-500 text-white rounded",children:"Clear"})]})]})}};var h,m,g,S,w;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    placeholder: "Select an option",
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
}`,...(g=(m=o.parameters)==null?void 0:m.docs)==null?void 0:g.source},description:{story:"Default select dropdown with basic options.",...(w=(S=o.parameters)==null?void 0:S.docs)==null?void 0:w.description}}};var O,x,j,f,y;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    value: "2",
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
}`,...(j=(x=s.parameters)==null?void 0:x.docs)==null?void 0:j.source},description:{story:"Select dropdown with a pre-selected value.",...(y=(f=s.parameters)==null?void 0:f.docs)==null?void 0:y.description}}};var C,D,N,A,L;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <div className="space-y-4">
                <ThemeAwareSectionLabel uppercase>
                    Multi-Select Dropdown
                </ThemeAwareSectionLabel>
                <DropdownSelect placeholder="Select multiple options" multiple value={selected} onChange={value => setSelected(value as string[])} options={[{
        label: "Option 1",
        value: "1"
      }, {
        label: "Option 2",
        value: "2"
      }, {
        label: "Option 3",
        value: "3"
      }, {
        label: "Option 4",
        value: "4"
      }]} />

                <div className="mt-2">
                    Selected: {selected.length ? selected.join(", ") : "None"}
                </div>
            </div>;
  }
}`,...(N=(D=r.parameters)==null?void 0:D.docs)==null?void 0:N.source},description:{story:"Multiple selection dropdown.",...(L=(A=r.parameters)==null?void 0:A.docs)==null?void 0:L.description}}};var T,V,k,G,I;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    placeholder: "Select an action",
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
}`,...(k=(V=i.parameters)==null?void 0:V.docs)==null?void 0:k.source},description:{story:"Select dropdown with icons.",...(I=(G=i.parameters)==null?void 0:G.docs)==null?void 0:I.description}}};var W,z,B,E,R;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <DropdownSelect placeholder="Default variant" variant="default" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <DropdownSelect placeholder="Ghost variant" variant="ghost" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <DropdownSelect placeholder="Bright variant" variant="bright" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <DropdownSelect placeholder="Outline variant" variant="outline" options={[{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]} />
        </div>
}`,...(B=(z=c.parameters)==null?void 0:z.docs)==null?void 0:B.source},description:{story:"Different style variants of the select dropdown.",...(R=(E=c.parameters)==null?void 0:E.docs)==null?void 0:R.description}}};var M,X,_,P,q;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    placeholder: "Disabled dropdown",
    disabled: true,
    options: [{
      label: "Option 1",
      value: "1"
    }, {
      label: "Option 2",
      value: "2"
    }]
  }
}`,...(_=(X=p.parameters)==null?void 0:X.docs)==null?void 0:_.source},description:{story:"Disabled select dropdown.",...(q=(P=p.parameters)==null?void 0:P.docs)==null?void 0:q.description}}};var F,H,J,K,Q;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    placeholder: "Some options disabled",
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
}`,...(J=(H=d.parameters)==null?void 0:H.docs)==null?void 0:J.source},description:{story:"Select dropdown with disabled options.",...(Q=(K=d.parameters)==null?void 0:K.docs)==null?void 0:Q.description}}};var U,Y,Z,$,ee;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: <span className="text-accent-dark-bright">Custom Label</span>,
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
}`,...(Z=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Select dropdown with a custom label.",...(ee=($=u.parameters)==null?void 0:$.docs)==null?void 0:ee.description}}};var ne,ae,te,le,oe;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <div className="space-y-4">
                <ThemeAwareSectionLabel uppercase>
                    Controlled Dropdown
                </ThemeAwareSectionLabel>
                <DropdownSelect placeholder="Select an option" value={value} onChange={newValue => setValue(newValue as string)} options={[{
        label: "Red",
        value: "red"
      }, {
        label: "Green",
        value: "green"
      }, {
        label: "Blue",
        value: "blue"
      }]} />

                <div className="mt-2">Selected: {value || "None"}</div>

                <div className="flex gap-2">
                    <button onClick={() => setValue("red")} className="px-2 py-1 bg-red-500 text-white rounded">
                        Set Red
                    </button>
                    <button onClick={() => setValue("green")} className="px-2 py-1 bg-green-500 text-white rounded">
                        Set Green
                    </button>
                    <button onClick={() => setValue("blue")} className="px-2 py-1 bg-blue-500 text-white rounded">
                        Set Blue
                    </button>
                    <button onClick={() => setValue("")} className="px-2 py-1 bg-gray-500 text-white rounded">
                        Clear
                    </button>
                </div>
            </div>;
  }
}`,...(te=(ae=b.parameters)==null?void 0:ae.docs)==null?void 0:te.source},description:{story:"Controlled select dropdown with state management.",...(oe=(le=b.parameters)==null?void 0:le.docs)==null?void 0:oe.description}}};const Oe=["Default","WithSelectedValue","MultiSelect","WithIcons","Variants","Disabled","DisabledOptions","WithCustomLabel","Controlled"];export{b as Controlled,o as Default,p as Disabled,d as DisabledOptions,r as MultiSelect,c as Variants,u as WithCustomLabel,i as WithIcons,s as WithSelectedValue,Oe as __namedExportsOrder,we as default};
