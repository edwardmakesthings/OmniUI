import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{P as t}from"./PushButton-Cr_VAFuk.js";import{w as fe,E as r,G as Be,C as S,b as n,P as xe,k as Pe}from"./ThemeAwareText-Dzv815Gu.js";import"./index-CFacQ8Bc.js";import{f as Ie}from"./index-DykKLRIS.js";import"./utils-CQ0JLh54.js";import"./button-CUq80kjz.js";import"./iframe-CiDI7u4-.js";import"./_commonjsHelpers-CqkleIqs.js";const ze={title:"Atoms/Buttons/PushButton",component:t,tags:["autodocs"],argTypes:{children:{control:"text",description:"Button text content"},startIcon:{description:"Icon to display before the text"},endIcon:{description:"Icon to display after the text"},iconSize:{control:"select",options:["xs","sm","md","lg","xl"],description:"Size of the icon"},variant:{control:"select",options:["default","ghost","bright","outline"],description:"Visual style variant of the button"},type:{control:"select",options:["button","submit","reset"],description:"HTML button type attribute"},disabled:{control:"boolean",description:"Whether the button is disabled"},loading:{control:"boolean",description:"Whether to show a loading indicator"},currentState:{description:"Current state for stateful buttons (controlled)"},states:{description:"Configuration for stateful buttons"},onStateChange:{description:"Callback when button state changes"}},args:{children:"Button",variant:"default",type:"button",disabled:!1,loading:!1},decorators:[fe],parameters:{docs:{description:{component:"`PushButton` is a button component with text and optional icons.\nIt supports various styles, states, and can display loading indicators."}}}},s={args:{children:"Click Me"}},o={args:{children:"Edit",startIcon:r}},a={args:{children:"Settings",endIcon:Be}},c={args:{children:"Confirm",startIcon:S,endIcon:e.jsx("span",{children:"→"})}},i={render:()=>e.jsxs("div",{className:"flex flex-col items-start gap-4",children:[e.jsx(n,{uppercase:!0,children:"Default"}),e.jsx(t,{variant:"default",children:"Default Button"}),e.jsx(n,{uppercase:!0,children:"Ghost"}),e.jsx(t,{variant:"ghost",children:"Ghost Button"}),e.jsx(n,{uppercase:!0,children:"Bright"}),e.jsx(t,{variant:"bright",children:"Bright Button"}),e.jsx(n,{uppercase:!0,children:"Outline"}),e.jsx(t,{variant:"outline",children:"Outline Button"})]})},l={render:()=>e.jsxs("div",{className:"flex flex-col items-start gap-4",children:[e.jsx(n,{uppercase:!0,children:"Extra Small (xs)"}),e.jsx(t,{startIcon:r,iconSize:"xs",children:"XS Icon"}),e.jsx(n,{uppercase:!0,children:"Small (sm)"}),e.jsx(t,{startIcon:r,iconSize:"sm",children:"SM Icon"}),e.jsx(n,{uppercase:!0,children:"Medium (md)"}),e.jsx(t,{startIcon:r,iconSize:"md",children:"MD Icon"}),e.jsx(n,{uppercase:!0,children:"Large (lg)"}),e.jsx(t,{startIcon:r,iconSize:"lg",children:"LG Icon"}),e.jsx(n,{uppercase:!0,children:"Extra Large (xl)"}),e.jsx(t,{startIcon:r,iconSize:"xl",children:"XL Icon"})]})},u={render:()=>e.jsxs("div",{className:"flex flex-col items-start gap-4",children:[e.jsx(n,{uppercase:!0,children:"Normal"}),e.jsx(t,{children:"Normal Button"}),e.jsx(n,{uppercase:!0,children:"Disabled"}),e.jsx(t,{disabled:!0,children:"Disabled Button"}),e.jsx(n,{uppercase:!0,children:"Loading"}),e.jsx(t,{loading:!0,children:"Loading Button"})]})},d={args:{children:"Play",states:{count:2,labels:["Play","Pause"],startIcons:[xe,Pe],variants:["default","bright"]},onStateChange:Ie(g=>console.log(`State changed to: ${g}`))}},p={args:{children:"Start",states:{count:3,labels:["Start","Processing","Complete"],startIcons:[xe,null,S],variants:["default","ghost","bright"]},onStateChange:Ie(g=>console.log(`State changed to: ${g}`))}},h={args:{children:"Submit Form",type:"submit",variant:"bright",startIcon:S}},m={args:{children:"Custom Style",className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md"}};var b,x,I,f,B;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: "Click Me"
  }
}`,...(I=(x=s.parameters)==null?void 0:x.docs)==null?void 0:I.source},description:{story:"Default button with text only.",...(B=(f=s.parameters)==null?void 0:f.docs)==null?void 0:B.description}}};var P,w,y,L,j;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    children: "Edit",
    startIcon: EditIcon
  }
}`,...(y=(w=o.parameters)==null?void 0:w.docs)==null?void 0:y.source},description:{story:"Button with start icon.",...(j=(L=o.parameters)==null?void 0:L.docs)==null?void 0:j.description}}};var T,v,A,C,E;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Settings",
    endIcon: GearIcon
  }
}`,...(A=(v=a.parameters)==null?void 0:v.docs)==null?void 0:A.source},description:{story:"Button with end icon.",...(E=(C=a.parameters)==null?void 0:C.docs)==null?void 0:E.description}}};var z,D,k,N,W;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    children: "Confirm",
    startIcon: CheckIcon,
    endIcon: <span>→</span>
  }
}`,...(k=(D=c.parameters)==null?void 0:D.docs)==null?void 0:k.source},description:{story:"Button with both start and end icons.",...(W=(N=c.parameters)==null?void 0:N.docs)==null?void 0:W.description}}};var G,M,O,X,$;i.parameters={...i.parameters,docs:{...(G=i.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <PushButton variant="default">Default Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <PushButton variant="ghost">Ghost Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <PushButton variant="bright">Bright Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <PushButton variant="outline">Outline Button</PushButton>
        </div>
}`,...(O=(M=i.parameters)==null?void 0:M.docs)==null?void 0:O.source},description:{story:"Different style variants of the button.",...($=(X=i.parameters)==null?void 0:X.docs)==null?void 0:$.description}}};var F,V,_,H,R;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>
                Extra Small (xs)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="xs">
                XS Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Small (sm)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="sm">
                SM Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Medium (md)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="md">
                MD Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Large (lg)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="lg">
                LG Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Extra Large (xl)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="xl">
                XL Icon
            </PushButton>
        </div>
}`,...(_=(V=l.parameters)==null?void 0:V.docs)==null?void 0:_.source},description:{story:"Different icon sizes for the button.",...(R=(H=l.parameters)==null?void 0:H.docs)==null?void 0:R.description}}};var q,J,K,Q,U;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Normal</ThemeAwareSectionLabel>
            <PushButton>Normal Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Disabled</ThemeAwareSectionLabel>
            <PushButton disabled>Disabled Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Loading</ThemeAwareSectionLabel>
            <PushButton loading>Loading Button</PushButton>
        </div>
}`,...(K=(J=u.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:"Button in different states.",...(U=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:U.description}}};var Y,Z,ee,te,ne;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    children: "Play",
    states: {
      count: 2,
      labels: ["Play", "Pause"],
      startIcons: [PlayIcon, PauseIcon],
      variants: ["default", "bright"]
    },
    onStateChange: fn(state => console.log(\`State changed to: \${state}\`))
  }
}`,...(ee=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:"Stateful button that cycles through states when clicked.",...(ne=(te=d.parameters)==null?void 0:te.docs)==null?void 0:ne.description}}};var re,se,oe,ae,ce;p.parameters={...p.parameters,docs:{...(re=p.parameters)==null?void 0:re.docs,source:{originalSource:`{
  args: {
    children: "Start",
    states: {
      count: 3,
      labels: ["Start", "Processing", "Complete"],
      startIcons: [PlayIcon, null, CheckIcon],
      variants: ["default", "ghost", "bright"]
    },
    onStateChange: fn(state => console.log(\`State changed to: \${state}\`))
  }
}`,...(oe=(se=p.parameters)==null?void 0:se.docs)==null?void 0:oe.source},description:{story:"Button with three states that cycle on click.",...(ce=(ae=p.parameters)==null?void 0:ae.docs)==null?void 0:ce.description}}};var ie,le,ue,de,pe;h.parameters={...h.parameters,docs:{...(ie=h.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    children: "Submit Form",
    type: "submit",
    variant: "bright",
    startIcon: CheckIcon
  }
}`,...(ue=(le=h.parameters)==null?void 0:le.docs)==null?void 0:ue.source},description:{story:"Form submit button example.",...(pe=(de=h.parameters)==null?void 0:de.docs)==null?void 0:pe.description}}};var he,me,ge,Se,be;m.parameters={...m.parameters,docs:{...(he=m.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    children: "Custom Style",
    className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md"
  }
}`,...(ge=(me=m.parameters)==null?void 0:me.docs)==null?void 0:ge.source},description:{story:"Button with custom styling.",...(be=(Se=m.parameters)==null?void 0:Se.docs)==null?void 0:be.description}}};const De=["Default","WithStartIcon","WithEndIcon","WithBothIcons","Variants","IconSizes","States","WithStates","ThreeStateButton","SubmitButton","CustomStyled"];export{m as CustomStyled,s as Default,l as IconSizes,u as States,h as SubmitButton,p as ThreeStateButton,i as Variants,c as WithBothIcons,a as WithEndIcon,o as WithStartIcon,d as WithStates,De as __namedExportsOrder,ze as default};
