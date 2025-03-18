import{j as a}from"./jsx-runtime-t1Y7DJZC.js";import{I as n}from"./IconButton-CmKgifoD.js";import{P as e,k as g,C as b,X as sa,E as ca,G as la,w as ma,b as u}from"./ThemeAwareText-aBl3ngNK.js";import"./index-CFacQ8Bc.js";import{f as p}from"./index-DykKLRIS.js";import"./utils-Dv6imMev.js";import"./iframe-BGiDNlN8.js";import"./_commonjsHelpers-CqkleIqs.js";const ya={title:"Atoms/Buttons/IconButton",component:n,tags:["autodocs"],argTypes:{icon:{control:"select",options:["PlayIcon","PauseIcon","CheckIcon","XIcon","EditIcon","GearIcon"],mapping:{PlayIcon:e,PauseIcon:g,CheckIcon:b,XIcon:sa,EditIcon:ca,GearIcon:la}},size:{control:"select",options:["xs","sm","md","lg","xl"]},iconSize:{control:"select",options:["xs","sm","md","lg","xl"]},containerSize:{control:"select",options:["xs","sm","md","lg","xl"]},variant:{control:"select",options:["default","ghost","bright","outline"]},disabled:{control:"boolean"},tooltip:{control:"text"},onClick:{action:"clicked"},onStateChange:{action:"state changed"}},parameters:{layout:"centered",docs:{description:{component:"`IconButton` is a button component that displays an icon. It supports various sizes,\nvariants, and state management."}}},args:{onClick:p(),onStateChange:p()},decorators:[ma]},o={args:{icon:e,"aria-label":"Play button"}},i={render:()=>a.jsxs("div",{className:"w-full space-y-1",children:[a.jsx(u,{uppercase:!0,children:"Size"}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(n,{icon:e,size:"xs","aria-label":"Extra Small"}),a.jsx(n,{icon:e,size:"sm","aria-label":"Small"}),a.jsx(n,{icon:e,size:"md","aria-label":"Medium"}),a.jsx(n,{icon:e,size:"lg","aria-label":"Large"}),a.jsx(n,{icon:e,size:"xl","aria-label":"Extra Large"})]}),a.jsx(u,{uppercase:!0,children:"Icon Size"}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(n,{icon:e,iconSize:"xs","aria-label":"Extra Small"}),a.jsx(n,{icon:e,iconSize:"sm","aria-label":"Small"}),a.jsx(n,{icon:e,iconSize:"md","aria-label":"Medium"}),a.jsx(n,{icon:e,iconSize:"lg","aria-label":"Large"}),a.jsx(n,{icon:e,iconSize:"xl","aria-label":"Extra Large"})]}),a.jsx(u,{uppercase:!0,children:"Icon Size + Container Size"}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(n,{icon:e,iconSize:"xs",containerSize:"xs","aria-label":"Extra Small"}),a.jsx(n,{icon:e,iconSize:"sm",containerSize:"sm","aria-label":"Small"}),a.jsx(n,{icon:e,iconSize:"md",containerSize:"md","aria-label":"Medium"}),a.jsx(n,{icon:e,iconSize:"lg",containerSize:"lg","aria-label":"Large"}),a.jsx(n,{icon:e,iconSize:"xl",containerSize:"xl","aria-label":"Extra Large"})]})]})},t={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(n,{icon:e,variant:"default","aria-label":"Default"}),a.jsx(n,{icon:e,variant:"ghost","aria-label":"Ghost"}),a.jsx(n,{icon:e,variant:"bright","aria-label":"Bright"}),a.jsx(n,{icon:e,variant:"outline","aria-label":"Outline"})]})},r={args:{icon:e,disabled:!0,"aria-label":"Disabled button"}},s={args:{icon:e,tooltip:"Play item","aria-label":"Play item"}},c={args:{icon:e,states:{count:2,icons:[e,g],tooltips:["Play item","Pause item"],variants:["default","bright"]},"aria-label":"Toggle action"}},l={args:{icon:e,"aria-label":"Interactive Button",onClick:p(da=>console.log("Button clicked!"))}},m={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(n,{icon:e,variant:"default","aria-label":"Play"}),a.jsx(n,{icon:g,variant:"bright","aria-label":"Pause"}),a.jsx(n,{icon:b,variant:"outline","aria-label":"Confirm"}),a.jsx(n,{icon:sa,variant:"outline","aria-label":"Cancel"}),a.jsx(n,{icon:ca,variant:"bright","aria-label":"Edit"}),a.jsx(n,{icon:la,variant:"default","aria-label":"Settings"})]})},d={args:{icon:b,className:"bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md","aria-label":"Custom styled button"}};var I,x,S,h,y;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    icon: PlayIcon,
    "aria-label": "Play button"
  }
}`,...(S=(x=o.parameters)==null?void 0:x.docs)==null?void 0:S.source},description:{story:"Default icon button using the default settings.",...(y=(h=o.parameters)==null?void 0:h.docs)==null?void 0:y.description}}};var z,f,v,P,B;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="w-full space-y-1">
            <ThemeAwareSectionLabel uppercase>Size</ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton icon={PlayIcon} size="xs" aria-label="Extra Small" />
                <IconButton icon={PlayIcon} size="sm" aria-label="Small" />
                <IconButton icon={PlayIcon} size="md" aria-label="Medium" />
                <IconButton icon={PlayIcon} size="lg" aria-label="Large" />
                <IconButton icon={PlayIcon} size="xl" aria-label="Extra Large" />
            </div>

            <ThemeAwareSectionLabel uppercase>Icon Size</ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton icon={PlayIcon} iconSize="xs" aria-label="Extra Small" />
                <IconButton icon={PlayIcon} iconSize="sm" aria-label="Small" />
                <IconButton icon={PlayIcon} iconSize="md" aria-label="Medium" />
                <IconButton icon={PlayIcon} iconSize="lg" aria-label="Large" />
                <IconButton icon={PlayIcon} iconSize="xl" aria-label="Extra Large" />
            </div>

            <ThemeAwareSectionLabel uppercase>
                Icon Size + Container Size
            </ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton icon={PlayIcon} iconSize="xs" containerSize="xs" aria-label="Extra Small" />
                <IconButton icon={PlayIcon} iconSize="sm" containerSize="sm" aria-label="Small" />
                <IconButton icon={PlayIcon} iconSize="md" containerSize="md" aria-label="Medium" />
                <IconButton icon={PlayIcon} iconSize="lg" containerSize="lg" aria-label="Large" />
                <IconButton icon={PlayIcon} iconSize="xl" containerSize="xl" aria-label="Extra Large" />
            </div>
        </div>
}`,...(v=(f=i.parameters)==null?void 0:f.docs)==null?void 0:v.source},description:{story:"Different size variations of the IconButton.",...(B=(P=i.parameters)==null?void 0:P.docs)==null?void 0:B.description}}};var j,w,C,E,L;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
            <IconButton icon={PlayIcon} variant="default" aria-label="Default" />
            <IconButton icon={PlayIcon} variant="ghost" aria-label="Ghost" />
            <IconButton icon={PlayIcon} variant="bright" aria-label="Bright" />
            <IconButton icon={PlayIcon} variant="outline" aria-label="Outline" />
        </div>
}`,...(C=(w=t.parameters)==null?void 0:w.docs)==null?void 0:C.source},description:{story:"Different style variants of the IconButton.",...(L=(E=t.parameters)==null?void 0:E.docs)==null?void 0:L.description}}};var k,N,T,D,A;r.parameters={...r.parameters,docs:{...(k=r.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    icon: PlayIcon,
    disabled: true,
    "aria-label": "Disabled button"
  }
}`,...(T=(N=r.parameters)==null?void 0:N.docs)==null?void 0:T.source},description:{story:"Disabled state of the IconButton.",...(A=(D=r.parameters)==null?void 0:D.docs)==null?void 0:A.description}}};var M,G,W,V,X;s.parameters={...s.parameters,docs:{...(M=s.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    icon: PlayIcon,
    tooltip: "Play item",
    "aria-label": "Play item"
  }
}`,...(W=(G=s.parameters)==null?void 0:G.docs)==null?void 0:W.source},description:{story:"IconButton with tooltip.",...(X=(V=s.parameters)==null?void 0:V.docs)==null?void 0:X.description}}};var _,O,R,U,Y;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    icon: PlayIcon,
    states: {
      count: 2,
      icons: [PlayIcon, PauseIcon],
      tooltips: ["Play item", "Pause item"],
      variants: ["default", "bright"]
    },
    "aria-label": "Toggle action"
  }
}`,...(R=(O=c.parameters)==null?void 0:O.docs)==null?void 0:R.source},description:{story:"IconButton with state management (toggleable).",...(Y=(U=c.parameters)==null?void 0:U.docs)==null?void 0:Y.description}}};var q,F,H,J,K;l.parameters={...l.parameters,docs:{...(q=l.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    icon: PlayIcon,
    "aria-label": "Interactive Button",
    onClick: fn(_e => console.log("Button clicked!")) // Using fn with a callback
  }
  // play: async ({ canvasElement, args }) => {
  // This function will automatically run when the story renders
  // You can use it to simulate interactions
  // },
}`,...(H=(F=l.parameters)==null?void 0:F.docs)==null?void 0:H.source},description:{story:"Interactive example showing action tracking",...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.description}}};var Q,Z,$,aa,ea;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
            <IconButton icon={PlayIcon} variant="default" aria-label="Play" />
            <IconButton icon={PauseIcon} variant="bright" aria-label="Pause" />
            <IconButton icon={CheckIcon} variant="outline" aria-label="Confirm" />
            <IconButton icon={XIcon} variant="outline" aria-label="Cancel" />
            <IconButton icon={EditIcon} variant="bright" aria-label="Edit" />
            <IconButton icon={GearIcon} variant="default" aria-label="Settings" />
        </div>
}`,...($=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:$.source},description:{story:"Multiple IconButtons showcasing different icons.",...(ea=(aa=m.parameters)==null?void 0:aa.docs)==null?void 0:ea.description}}};var na,oa,ia,ta,ra;d.parameters={...d.parameters,docs:{...(na=d.parameters)==null?void 0:na.docs,source:{originalSource:`{
  args: {
    icon: CheckIcon,
    className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md",
    "aria-label": "Custom styled button"
  }
}`,...(ia=(oa=d.parameters)==null?void 0:oa.docs)==null?void 0:ia.source},description:{story:"IconButton with custom styling.",...(ra=(ta=d.parameters)==null?void 0:ta.docs)==null?void 0:ra.description}}};const za=["Default","Sizes","Variants","Disabled","WithTooltip","WithState","WithInteraction","IconVariations","CustomStyling"];export{d as CustomStyling,o as Default,r as Disabled,m as IconVariations,i as Sizes,t as Variants,l as WithInteraction,c as WithState,s as WithTooltip,za as __namedExportsOrder,ya as default};
