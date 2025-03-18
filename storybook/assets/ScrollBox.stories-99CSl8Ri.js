import{j as e}from"./jsx-runtime-t1Y7DJZC.js";import{w,T as c,a as l}from"./ThemeAwareText-Dzv815Gu.js";import"./index-CFacQ8Bc.js";import{b as i}from"./componentRegistry-Bydd8upc.js";import"./Dropdown-BYWDEqO5.js";import"./DropdownSelect-C_xrwEPZ.js";import"./IconButton-BMcvz6tv.js";import"./Input-B6MG042b.js";import"./PushButton-Cr_VAFuk.js";import"./iframe-CiDI7u4-.js";import"./_commonjsHelpers-CqkleIqs.js";import"./utils-CQ0JLh54.js";import"./panel-CTYQAhhj.js";import"./dropdown-wJJ0wzB7.js";import"./button-CUq80kjz.js";const P={title:"Atoms/Containers/ScrollBox",component:i,tags:["autodocs"],decorators:[w],args:{maxHeight:200,variant:"default",scrollbarStyle:"dark",scrollbarSize:"normal"},argTypes:{variant:{control:"select",options:["default","inset","ghost"],description:"Visual style variant of the scrollbox"},maxHeight:{control:{type:"number",min:200,max:500,step:10},description:"Maximum height of the container before scrolling"},scrollToTop:{control:"boolean",description:"When true, scrolls the content to the top"},scrollbarStyle:{control:"select",options:["dark","light","accent","invisible"],description:"Style of the scrollbar"},scrollbarSize:{control:"select",options:["normal","thin"],description:"Size of the scrollbar"}},parameters:{docs:{description:{component:"`ScrollBox` provides a scrollable container with consistent scrollbar styling.\nIt supports different variants and scrollbar customization."}}}},d=r=>Array.from({length:r},(a,N)=>`Item ${N+1}`),t={args:{maxHeight:200,children:e.jsx("div",{className:"space-y-2 w-96",children:d(20).map(r=>e.jsx("div",{className:"p-2 border border-accent-dark-neutral",children:r},r))})}},n={render:()=>{const r=d(20);return e.jsxs("div",{className:"space-y-6",children:[e.jsx(c,{children:"Unstyled ScrollBox"}),e.jsx(l,{children:"The basic ScrollBox without any additional styling."}),e.jsx(i,{maxHeight:300,children:e.jsx("div",{className:"divide-y divide-accent-dark-neutral",children:r.map(a=>e.jsx("div",{className:"text-font-dark hover:bg-bg-dark-lighter transition-colors p-2",children:a},a))})})]})}},o={render:()=>{const r=d(20);return e.jsxs("div",{className:"space-y-6",children:[e.jsx(c,{children:"Styled ScrollBox"}),e.jsx(l,{children:"A ScrollBox with custom border and background styling."}),e.jsx(i,{maxHeight:300,className:"bg-bg-dark border border-accent-dark-neutral rounded-md",children:e.jsx("div",{className:"divide-y divide-accent-dark-neutral",children:r.map(a=>e.jsx("div",{className:"p-3 text-font-dark hover:bg-bg-dark-lighter transition-colors",children:a},a))})})]})}},s={render:()=>{const r=d(20);return e.jsxs("div",{className:"space-y-6",children:[e.jsx(c,{children:"Inset ScrollBox"}),e.jsx(l,{children:"The inset variant adds an inset shadow around the scrollable area, which helps to visually indicate that the content is scrollable."}),e.jsx(i,{variant:"inset",maxHeight:400,className:"bg-bg-dark-darker rounded-md border border-accent-dark-neutral",children:e.jsx("div",{className:"p-4 space-y-3",children:r.map(a=>e.jsxs("div",{className:`bg-bg-dark p-4 rounded-md border border-accent-dark-neutral
                     hover:border-accent-dark-bright transition-colors`,children:[e.jsx("h3",{className:"text-font-dark font-medium",children:a}),e.jsxs("p",{className:"text-font-dark-muted mt-1",children:["Description for ",a.toLowerCase()]})]},a))})})]})}};var m,h,p;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    maxHeight: 200,
    children: <div className="space-y-2 w-96">
                {generateItems(20).map(item => <div key={item} className="p-2 border border-accent-dark-neutral">
                        {item}
                    </div>)}
            </div>
  }
}`,...(p=(h=t.parameters)==null?void 0:h.docs)==null?void 0:p.source}}};var x,g,b;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => {
    const items = generateItems(20);
    return <div className="space-y-6">
                <ThemeAwareHeading>Unstyled ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    The basic ScrollBox without any additional styling.
                </ThemeAwareBody>

                <ScrollBox maxHeight={300}>
                    <div className="divide-y divide-accent-dark-neutral">
                        {items.map(item => <div key={item} className="text-font-dark hover:bg-bg-dark-lighter transition-colors p-2">
                                {item}
                            </div>)}
                    </div>
                </ScrollBox>
            </div>;
  }
}`,...(b=(g=n.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var u,v,y;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const items = generateItems(20);
    return <div className="space-y-6">
                <ThemeAwareHeading>Styled ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    A ScrollBox with custom border and background styling.
                </ThemeAwareBody>

                <ScrollBox maxHeight={300} className="bg-bg-dark border border-accent-dark-neutral rounded-md">
                    <div className="divide-y divide-accent-dark-neutral">
                        {items.map(item => <div key={item} className="p-3 text-font-dark hover:bg-bg-dark-lighter transition-colors">
                                {item}
                            </div>)}
                    </div>
                </ScrollBox>
            </div>;
  }
}`,...(y=(v=o.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var k,S,B;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => {
    const items = generateItems(20);
    return <div className="space-y-6">
                <ThemeAwareHeading>Inset ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    The inset variant adds an inset shadow around the scrollable
                    area, which helps to visually indicate that the content is
                    scrollable.
                </ThemeAwareBody>

                <ScrollBox variant="inset" maxHeight={400} className="bg-bg-dark-darker rounded-md border border-accent-dark-neutral">
                    <div className="p-4 space-y-3">
                        {items.map(item => <div key={item} className="bg-bg-dark p-4 rounded-md border border-accent-dark-neutral
                     hover:border-accent-dark-bright transition-colors">
                                <h3 className="text-font-dark font-medium">
                                    {item}
                                </h3>
                                <p className="text-font-dark-muted mt-1">
                                    Description for {item.toLowerCase()}
                                </p>
                            </div>)}
                    </div>
                </ScrollBox>
            </div>;
  }
}`,...(B=(S=s.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};const R=["Basic","UnstyledScrollBox","StyledScrollBox","InsetScrollBox"];export{t as Basic,s as InsetScrollBox,o as StyledScrollBox,n as UnstyledScrollBox,R as __namedExportsOrder,P as default};
