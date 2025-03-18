import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{I as t}from"./Input-BphtCn-1.js";import{w as oe,b as r,S as re,X as ae}from"./ThemeAwareText-aBl3ngNK.js";import{r as h}from"./index-CFacQ8Bc.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";const he={title:"Atoms/Forms/Input",component:t,tags:["autodocs"],argTypes:{value:{control:"text",description:"Current value of the input (controlled)"},defaultValue:{control:"text",description:"Initial value of the input (uncontrolled)"},onChange:{description:"Callback when input value changes"},type:{control:"select",options:["text","password","email","number","search"],description:"Type of input field"},placeholder:{control:"text",description:"Placeholder text when input is empty"},variant:{control:"select",options:["default","ghost","outline"],description:"Visual style variant of the input"},disabled:{control:"boolean",description:"Whether the input is disabled"},error:{control:"boolean",description:"Whether the input has an error state"},readOnly:{control:"boolean",description:"Whether the input is read-only"},required:{control:"boolean",description:"Whether the input is required"},prefix:{description:"Content to display before the input"},suffix:{description:"Content to display after the input"}},args:{type:"text",placeholder:"Enter text...",variant:"default"},decorators:[oe],parameters:{docs:{description:{component:"`Input` is a form component for text entry.\nIt supports different input types, addons, and states."}}}},s={args:{placeholder:"Enter text..."}},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Text Input"}),e.jsx(t,{type:"text",placeholder:"Text input..."}),e.jsx(r,{uppercase:!0,children:"Password Input"}),e.jsx(t,{type:"password",placeholder:"Password input..."}),e.jsx(r,{uppercase:!0,children:"Email Input"}),e.jsx(t,{type:"email",placeholder:"Email input..."}),e.jsx(r,{uppercase:!0,children:"Number Input"}),e.jsx(t,{type:"number",placeholder:"Number input..."}),e.jsx(r,{uppercase:!0,children:"Search Input"}),e.jsx(t,{type:"search",placeholder:"Search input..."})]})},i={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"With Prefix"}),e.jsx(t,{placeholder:"With prefix",prefix:{content:"$"}}),e.jsx(r,{uppercase:!0,children:"With Suffix"}),e.jsx(t,{placeholder:"With suffix",suffix:{content:"kg"}}),e.jsx(r,{uppercase:!0,children:"With Both"}),e.jsx(t,{placeholder:"Amount",prefix:{content:"$"},suffix:{content:".00"}}),e.jsx(r,{uppercase:!0,children:"With Icon"}),e.jsx(t,{placeholder:"Search...",prefix:{content:e.jsx(re,{size:16})},suffix:{content:e.jsx(ae,{size:16}),action:()=>alert("Clear search"),tooltip:"Clear search"}})]})},l={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Default"}),e.jsx(t,{placeholder:"Default variant",variant:"default"}),e.jsx(r,{uppercase:!0,children:"Ghost"}),e.jsx(t,{placeholder:"Ghost variant",variant:"ghost"}),e.jsx(r,{uppercase:!0,children:"Outline"}),e.jsx(t,{placeholder:"Outline variant",variant:"outline"})]})},c={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Normal"}),e.jsx(t,{placeholder:"Normal state"}),e.jsx(r,{uppercase:!0,children:"Disabled"}),e.jsx(t,{placeholder:"Disabled state",disabled:!0}),e.jsx(r,{uppercase:!0,children:"Error"}),e.jsx(t,{placeholder:"Error state",error:!0}),e.jsx(r,{uppercase:!0,children:"Read Only"}),e.jsx(t,{value:"Read-only content",readOnly:!0})]})},p={render:()=>{const[a,n]=h.useState("");return e.jsxs("div",{className:"space-y-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Controlled Input"}),e.jsx(t,{placeholder:"Type something...",value:a,onChange:n}),e.jsxs("div",{className:"mt-2",children:["Current value: ",a?`"${a}"`:"(empty)"]}),e.jsx("button",{onClick:()=>n(""),className:"px-2 py-1 bg-gray-500 text-white rounded",children:"Clear"})]})}},d={render:()=>{const[a,n]=h.useState("");return e.jsxs("div",{className:"space-y-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Interactive Search"}),e.jsx(t,{placeholder:"Search...",value:a,onChange:n,prefix:{content:e.jsx(re,{size:16})},suffix:{content:e.jsx(ae,{size:16}),action:()=>n(""),tooltip:"Clear search",isInteractive:!0}})]})}},u={render:()=>{const[a,n]=h.useState(""),[x,ne]=h.useState(!0),se=m=>{n(m),ne(m===""||/\S+@\S+\.\S+/.test(m))};return e.jsxs("div",{className:"space-y-4 w-64",children:[e.jsx(r,{uppercase:!0,children:"Email Validation"}),e.jsx(t,{type:"email",placeholder:"Enter email...",value:a,onChange:se,error:!x,required:!0}),!x&&e.jsx("div",{className:"text-red-500 text-sm",children:"Please enter a valid email address"})]})}};var f,S,v,w,b;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter text..."
  }
}`,...(v=(S=s.parameters)==null?void 0:S.docs)==null?void 0:v.source},description:{story:"Basic text input with placeholder.",...(b=(w=s.parameters)==null?void 0:w.docs)==null?void 0:b.description}}};var I,y,j,T,A;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>
                Text Input
            </ThemeAwareSectionLabel>
            <Input type="text" placeholder="Text input..." />

            <ThemeAwareSectionLabel uppercase>
                Password Input
            </ThemeAwareSectionLabel>
            <Input type="password" placeholder="Password input..." />

            <ThemeAwareSectionLabel uppercase>
                Email Input
            </ThemeAwareSectionLabel>
            <Input type="email" placeholder="Email input..." />

            <ThemeAwareSectionLabel uppercase>
                Number Input
            </ThemeAwareSectionLabel>
            <Input type="number" placeholder="Number input..." />

            <ThemeAwareSectionLabel uppercase>
                Search Input
            </ThemeAwareSectionLabel>
            <Input type="search" placeholder="Search input..." />
        </div>
}`,...(j=(y=o.parameters)==null?void 0:y.docs)==null?void 0:j.source},description:{story:"Different types of inputs.",...(A=(T=o.parameters)==null?void 0:T.docs)==null?void 0:A.description}}};var g,L,C,N,V;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>
                With Prefix
            </ThemeAwareSectionLabel>
            <Input placeholder="With prefix" prefix={{
      content: "$"
    }} />

            <ThemeAwareSectionLabel uppercase>
                With Suffix
            </ThemeAwareSectionLabel>
            <Input placeholder="With suffix" suffix={{
      content: "kg"
    }} />

            <ThemeAwareSectionLabel uppercase>With Both</ThemeAwareSectionLabel>
            <Input placeholder="Amount" prefix={{
      content: "$"
    }} suffix={{
      content: ".00"
    }} />

            <ThemeAwareSectionLabel uppercase>With Icon</ThemeAwareSectionLabel>
            <Input placeholder="Search..." prefix={{
      content: <SearchIcon size={16} />
    }} suffix={{
      content: <XIcon size={16} />,
      action: () => alert("Clear search"),
      tooltip: "Clear search"
    }} />
        </div>
}`,...(C=(L=i.parameters)==null?void 0:L.docs)==null?void 0:C.source},description:{story:"Input with prefix and suffix addons.",...(V=(N=i.parameters)==null?void 0:N.docs)==null?void 0:V.description}}};var E,W,D,O,P;l.parameters={...l.parameters,docs:{...(E=l.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <Input placeholder="Default variant" variant="default" />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <Input placeholder="Ghost variant" variant="ghost" />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <Input placeholder="Outline variant" variant="outline" />
        </div>
}`,...(D=(W=l.parameters)==null?void 0:W.docs)==null?void 0:D.source},description:{story:"Different style variants.",...(P=(O=l.parameters)==null?void 0:O.docs)==null?void 0:P.description}}};var z,$,k,R,q;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>Normal</ThemeAwareSectionLabel>
            <Input placeholder="Normal state" />

            <ThemeAwareSectionLabel uppercase>Disabled</ThemeAwareSectionLabel>
            <Input placeholder="Disabled state" disabled />

            <ThemeAwareSectionLabel uppercase>Error</ThemeAwareSectionLabel>
            <Input placeholder="Error state" error />

            <ThemeAwareSectionLabel uppercase>Read Only</ThemeAwareSectionLabel>
            <Input value="Read-only content" readOnly />
        </div>
}`,...(k=($=c.parameters)==null?void 0:$.docs)==null?void 0:k.source},description:{story:"Input in different states.",...(q=(R=c.parameters)==null?void 0:R.docs)==null?void 0:q.description}}};var G,X,B,F,_;p.parameters={...p.parameters,docs:{...(G=p.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Controlled Input
                </ThemeAwareSectionLabel>
                <Input placeholder="Type something..." value={value} onChange={setValue} />

                <div className="mt-2">
                    Current value: {value ? \`"\${value}"\` : "(empty)"}
                </div>

                <button onClick={() => setValue("")} className="px-2 py-1 bg-gray-500 text-white rounded">
                    Clear
                </button>
            </div>;
  }
}`,...(B=(X=p.parameters)==null?void 0:X.docs)==null?void 0:B.source},description:{story:"Controlled input with state.",...(_=(F=p.parameters)==null?void 0:F.docs)==null?void 0:_.description}}};var H,J,K,M,Q;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("");
    return <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Interactive Search
                </ThemeAwareSectionLabel>
                <Input placeholder="Search..." value={value} onChange={setValue} prefix={{
        content: <SearchIcon size={16} />
      }} suffix={{
        content: <XIcon size={16} />,
        action: () => setValue(""),
        tooltip: "Clear search",
        isInteractive: true
      }} />
            </div>;
  }
}`,...(K=(J=d.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Interactive input with addons.",...(Q=(M=d.parameters)==null?void 0:M.docs)==null?void 0:Q.description}}};var U,Y,Z,ee,te;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(true);
    const handleChange = (value: string) => {
      setEmail(value);
      // Simple email validation
      setIsValid(value === "" || /\\S+@\\S+\\.\\S+/.test(value));
    };
    return <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Email Validation
                </ThemeAwareSectionLabel>
                <Input type="email" placeholder="Enter email..." value={email} onChange={handleChange} error={!isValid} required />

                {!isValid && <div className="text-red-500 text-sm">
                        Please enter a valid email address
                    </div>}
            </div>;
  }
}`,...(Z=(Y=u.parameters)==null?void 0:Y.docs)==null?void 0:Z.source},description:{story:"Form validation example.",...(te=(ee=u.parameters)==null?void 0:ee.docs)==null?void 0:te.description}}};const me=["Default","InputTypes","WithAddons","Variants","States","Controlled","InteractiveAddons","Validation"];export{p as Controlled,s as Default,o as InputTypes,d as InteractiveAddons,c as States,u as Validation,l as Variants,i as WithAddons,me as __namedExportsOrder,he as default};
