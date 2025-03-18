import{j as H}from"./jsx-runtime-t1Y7DJZC.js";import{r as P}from"./index-CFacQ8Bc.js";import{x as r,y as J,H as K,J as Q,N as k,Q as U,L as s,K as a,v as Z,t as G}from"./ThemeAwareText-Dzv815Gu.js";import{I as c,a as M}from"./utils-CQ0JLh54.js";const u=r(J.flex.row.centerFull,K.ring.accent,Q.base,k.interactive.base,k.interactive.selectedNeutral,U.default),W={name:"iconButton",elements:["icon"],variants:{default:{root:r(u,s.solid.dark,a.indicatorDark),icon:r("flex-shrink-0",a.indicatorDark)},ghost:{root:r(u,s.solid.transparent,a.indicatorDark),icon:r("flex-shrink-0",a.indicatorDark)},bright:{root:r(u,s.solid.accentBright,a.default.base),icon:r("flex-shrink-0",a.default.base)},outline:{root:r(u,s.solid.transparent,a.indicatorDark,"border border-accent-dark-neutral"),icon:r("flex-shrink-0",a.indicatorDark)}}},X=({icon:v,iconProps:w={},size:i="md",iconSize:q,containerSize:T,variant:x="default",className:N,styleProps:t,tooltip:C,currentState:n,states:e,defaultState:B=0,onStateChange:m,...z})=>{var p,f,y,I,b,g,S;const[V,d]=P.useState(B),o=n!==void 0?typeof n=="boolean"?n?1:0:n:V;P.useEffect(()=>{n!==void 0&&d(typeof n=="boolean"?n?1:0:n)},[n]);const h=(e==null?void 0:e.count)||(typeof n=="boolean"?2:1),A=()=>{if(!e)return;const l=(o+1)%h;d(l),m==null||m(l)},D=((p=e==null?void 0:e.icons)==null?void 0:p[o])||v,E=((f=e==null?void 0:e.iconProps)==null?void 0:f[o])||w,R=((y=e==null?void 0:e.tooltips)==null?void 0:y[o])||C,j=((I=e==null?void 0:e.variants)==null?void 0:I[o])||x,_=((b=e==null?void 0:e.classNames)==null?void 0:b[o])||N,L=c.getIconSize(q||(c.isPresetSize(i)?M[i].icon:i)),O=c.getContainerClasses(T||i),F={...t,variant:j,elements:{root:{base:Z(O,(g=t==null?void 0:t.elements)==null?void 0:g.root,_)},icon:(S=t==null?void 0:t.elements)==null?void 0:S.icon}};return H.jsx(G,{as:"button",type:"button",title:R,stylePreset:W,styleProps:F,state:{isEditable:!1},onClick:e?A:void 0,...z,children:c.render(D,L,E)})};X.__docgenInfo={description:"",methods:[],displayName:"IconButton",props:{icon:{required:!0,tsType:{name:"union",raw:"ComponentType<IconProps> | ReactNode",elements:[{name:"ComponentType",elements:[{name:"IconProps"}],raw:"ComponentType<IconProps>"},{name:"ReactNode"}]},description:""},iconProps:{required:!1,tsType:{name:"Partial",elements:[{name:"IconProps"}],raw:"Partial<IconProps>"},description:"",defaultValue:{value:"{}",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"IconPresetSize | string",elements:[{name:"IconPresetSize"},{name:"string"}]},description:"",defaultValue:{value:'"md"',computed:!1}},iconSize:{required:!1,tsType:{name:"union",raw:"IconPresetSize | number | string",elements:[{name:"IconPresetSize"},{name:"number"},{name:"string"}]},description:""},containerSize:{required:!1,tsType:{name:"union",raw:"IconPresetSize | string",elements:[{name:"IconPresetSize"},{name:"string"}]},description:""},variant:{required:!1,tsType:{name:"IconButtonVariant"},description:"",defaultValue:{value:'"default"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},tooltip:{required:!1,tsType:{name:"string"},description:""},currentState:{required:!1,tsType:{name:"union",raw:"number | boolean",elements:[{name:"number"},{name:"boolean"}]},description:""},states:{required:!1,tsType:{name:"signature",type:"object",raw:`{
    count?: number;
    icons?: (ComponentType<IconProps> | ReactNode)[];
    iconProps?: Partial<IconProps>[];
    tooltips?: string[];
    variants?: IconButtonVariant[];
    classNames?: string[];
}`,signature:{properties:[{key:"count",value:{name:"number",required:!1}},{key:"icons",value:{name:"Array",elements:[{name:"unknown"}],raw:"(ComponentType<IconProps> | ReactNode)[]",required:!1}},{key:"iconProps",value:{name:"Array",elements:[{name:"Partial",elements:[{name:"IconProps"}],raw:"Partial<IconProps>"}],raw:"Partial<IconProps>[]",required:!1}},{key:"tooltips",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1}},{key:"variants",value:{name:"Array",elements:[{name:"IconButtonVariant"}],raw:"IconButtonVariant[]",required:!1}},{key:"classNames",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1}}]}},description:""},defaultState:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},onStateChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(newState: number) => void",signature:{arguments:[{type:{name:"number"},name:"newState"}],return:{name:"void"}}},description:""}},composes:["Omit"]};export{X as I};
