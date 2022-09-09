"use strict";(self.webpackChunkvite_ml_platform=self.webpackChunkvite_ml_platform||[]).push([[603],{82621:function(t,e,n){n.d(e,{Z:function(){return l}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"}}]},name:"close-circle",theme:"filled"},i=n(54291),c=function(t,e){return a.createElement(i.Z,(0,r.Z)((0,r.Z)({},t),{},{ref:e,icon:o}))};c.displayName="CloseCircleFilled";var l=a.forwardRef(c)},77106:function(t,e,n){n.d(e,{Z:function(){return l}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"}}]},name:"loading",theme:"outlined"},i=n(54291),c=function(t,e){return a.createElement(i.Z,(0,r.Z)((0,r.Z)({},t),{},{ref:e,icon:o}))};c.displayName="LoadingOutlined";var l=a.forwardRef(c)},11730:function(t,e,n){n.d(e,{Z:function(){return l}});var r=n(1413),a=n(72791),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},i=n(54291),c=function(t,e){return a.createElement(i.Z,(0,r.Z)((0,r.Z)({},t),{},{ref:e,icon:o}))};c.displayName="SearchOutlined";var l=a.forwardRef(c)},61113:function(t,e,n){n.d(e,{l$:function(){return a},Tm:function(){return o}});var r=n(72791),a=r.isValidElement;function o(t,e){return function(t,e,n){return a(t)?r.cloneElement(t,"function"===typeof n?n(t.props||{}):n):e}(t,t,e)}},12833:function(t,e,n){n.d(e,{Z:function(){return Z}});var r=n(15671),a=n(43144),o=n(97326),i=n(60136),c=n(54062),l=n(72791),u=n(85561),s=n(88834),f=n(75314),d=0,m={};function v(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=d++,r=e;function a(){(r-=1)<=0?(t(),delete m[n]):m[n]=(0,f.Z)(a)}return m[n]=(0,f.Z)(a),n}v.cancel=function(t){void 0!==t&&(f.Z.cancel(m[t]),delete m[t])},v.ids=m;var p,h=n(24886),g=n(61113);function y(t){return!t||null===t.offsetParent||t.hidden}function b(t){var e=(t||"").match(/rgba?\((\d*), (\d*), (\d*)(, [\d.]*)?\)/);return!(e&&e[1]&&e[2]&&e[3])||!(e[1]===e[2]&&e[2]===e[3])}var Z=function(t){(0,i.Z)(n,t);var e=(0,c.Z)(n);function n(){var t;return(0,r.Z)(this,n),(t=e.apply(this,arguments)).containerRef=l.createRef(),t.animationStart=!1,t.destroyed=!1,t.onClick=function(e,n){var r,a,i=t.props,c=i.insertExtraNode;if(!(i.disabled||!e||y(e)||e.className.indexOf("-leave")>=0)){t.extraNode=document.createElement("div");var l=(0,o.Z)(t).extraNode,s=t.context.getPrefixCls;l.className="".concat(s(""),"-click-animating-node");var f=t.getAttributeName();if(e.setAttribute(f,"true"),n&&"#ffffff"!==n&&"rgb(255, 255, 255)"!==n&&b(n)&&!/rgba\((?:\d*, ){3}0\)/.test(n)&&"transparent"!==n){l.style.borderColor=n;var d=(null===(r=e.getRootNode)||void 0===r?void 0:r.call(e))||e.ownerDocument,m=d instanceof Document?d.body:null!==(a=d.firstChild)&&void 0!==a?a:d;p=(0,u.h)("\n      [".concat(s(""),"-click-animating-without-extra-node='true']::after, .").concat(s(""),"-click-animating-node {\n        --antd-wave-shadow-color: ").concat(n,";\n      }"),"antd-wave",{csp:t.csp,attachTo:m})}c&&e.appendChild(l),["transition","animation"].forEach((function(n){e.addEventListener("".concat(n,"start"),t.onTransitionStart),e.addEventListener("".concat(n,"end"),t.onTransitionEnd)}))}},t.onTransitionStart=function(e){if(!t.destroyed){var n=t.containerRef.current;e&&e.target===n&&!t.animationStart&&t.resetEffect(n)}},t.onTransitionEnd=function(e){e&&"fadeEffect"===e.animationName&&t.resetEffect(e.target)},t.bindAnimationEvent=function(e){if(e&&e.getAttribute&&!e.getAttribute("disabled")&&!(e.className.indexOf("disabled")>=0)){var n=function(n){if("INPUT"!==n.target.tagName&&!y(n.target)){t.resetEffect(e);var r=getComputedStyle(e).getPropertyValue("border-top-color")||getComputedStyle(e).getPropertyValue("border-color")||getComputedStyle(e).getPropertyValue("background-color");t.clickWaveTimeoutId=window.setTimeout((function(){return t.onClick(e,r)}),0),v.cancel(t.animationStartId),t.animationStart=!0,t.animationStartId=v((function(){t.animationStart=!1}),10)}};return e.addEventListener("click",n,!0),{cancel:function(){e.removeEventListener("click",n,!0)}}}},t.renderWave=function(e){var n=e.csp,r=t.props.children;if(t.csp=n,!l.isValidElement(r))return r;var a=t.containerRef;return(0,s.Yr)(r)&&(a=(0,s.sQ)(r.ref,t.containerRef)),(0,g.Tm)(r,{ref:a})},t}return(0,a.Z)(n,[{key:"componentDidMount",value:function(){var t=this.containerRef.current;t&&1===t.nodeType&&(this.instance=this.bindAnimationEvent(t))}},{key:"componentWillUnmount",value:function(){this.instance&&this.instance.cancel(),this.clickWaveTimeoutId&&clearTimeout(this.clickWaveTimeoutId),this.destroyed=!0}},{key:"getAttributeName",value:function(){var t=this.context.getPrefixCls,e=this.props.insertExtraNode;return"".concat(t(""),e?"-click-animating":"-click-animating-without-extra-node")}},{key:"resetEffect",value:function(t){var e=this;if(t&&t!==this.extraNode&&t instanceof Element){var n=this.props.insertExtraNode,r=this.getAttributeName();t.setAttribute(r,"false"),p&&(p.innerHTML=""),n&&this.extraNode&&t.contains(this.extraNode)&&t.removeChild(this.extraNode),["transition","animation"].forEach((function(n){t.removeEventListener("".concat(n,"start"),e.onTransitionStart),t.removeEventListener("".concat(n,"end"),e.onTransitionEnd)}))}}},{key:"render",value:function(){return l.createElement(h.C,null,this.renderWave)}}]),n}(l.Component);Z.contextType=h.E_},6417:function(t,e,n){n.d(e,{n:function(){return P},Z:function(){return R}});var r=n(87462),a=n(4942),o=n(29439),i=n(71002),c=n(72791),l=n(81694),u=n.n(l),s=n(41818),f=n(24886),d=n(43144),m=n(15671),v=(0,d.Z)((function t(e){(0,m.Z)(this,t),this.error=new Error("unreachable case: ".concat(JSON.stringify(e)))})),p=function(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(t);a<r.length;a++)e.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(t,r[a])&&(n[r[a]]=t[r[a]])}return n},h=function(t){return c.createElement(f.C,null,(function(e){var n,o=e.getPrefixCls,i=e.direction,l=t.prefixCls,s=t.size,f=t.className,d=p(t,["prefixCls","size","className"]),m=o("btn-group",l),h="";switch(s){case"large":h="lg";break;case"small":h="sm";break;case"middle":case void 0:break;default:console.warn(new v(s).error)}var g=u()(m,(n={},(0,a.Z)(n,"".concat(m,"-").concat(h),h),(0,a.Z)(n,"".concat(m,"-rtl"),"rtl"===i),n),f);return c.createElement("div",(0,r.Z)({},d,{className:g}))}))},g=n(12833),y=n(79393),b=n(14824),Z=n(1815),E=n(14897),C=n(77106),x=function(){return{width:0,opacity:0,transform:"scale(0)"}},N=function(t){return{width:t.scrollWidth,opacity:1,transform:"scale(1)"}},k=function(t){var e=t.prefixCls,n=!!t.loading;return t.existIcon?c.createElement("span",{className:"".concat(e,"-loading-icon")},c.createElement(C.Z,null)):c.createElement(E.Z,{visible:n,motionName:"".concat(e,"-loading-icon-motion"),removeOnLeave:!0,onAppearStart:x,onAppearActive:N,onEnterStart:x,onEnterActive:N,onLeaveStart:N,onLeaveActive:x},(function(t,n){var r=t.className,a=t.style;return c.createElement("span",{className:"".concat(e,"-loading-icon"),style:a,ref:n},c.createElement(C.Z,{className:r}))}))},w=n(61113),S=function(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(t);a<r.length;a++)e.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(t,r[a])&&(n[r[a]]=t[r[a]])}return n},O=/^[\u4e00-\u9fa5]{2}$/,T=O.test.bind(O);function A(t){return"text"===t||"link"===t}function L(t,e){if(null!=t){var n,r=e?" ":"";return"string"!==typeof t&&"number"!==typeof t&&"string"===typeof t.type&&T(t.props.children)?(0,w.Tm)(t,{children:t.props.children.split("").join(r)}):"string"===typeof t?T(t)?c.createElement("span",null,t.split("").join(r)):c.createElement("span",null,t):(n=t,c.isValidElement(n)&&n.type===c.Fragment?c.createElement("span",null,t):t)}}(0,y.b)("default","primary","ghost","dashed","link","text"),(0,y.b)("default","circle","round"),(0,y.b)("submit","button","reset");function P(t){return"danger"===t?{danger:!0}:{type:t}}var I=function(t,e){var n,l=t.loading,d=void 0!==l&&l,m=t.prefixCls,v=t.type,p=t.danger,h=t.shape,y=void 0===h?"default":h,E=t.size,C=t.className,x=t.children,N=t.icon,w=t.ghost,O=void 0!==w&&w,P=t.block,I=void 0!==P&&P,j=t.htmlType,R=void 0===j?"button":j,z=S(t,["loading","prefixCls","type","danger","shape","size","className","children","icon","ghost","block","htmlType"]),_=c.useContext(Z.Z),B=c.useState(!!d),M=(0,o.Z)(B,2),W=M[0],V=M[1],D=c.useState(!1),U=(0,o.Z)(D,2),$=U[0],F=U[1],G=c.useContext(f.E_),H=G.getPrefixCls,J=G.autoInsertSpaceInButton,Q=G.direction,Y=e||c.createRef(),q=c.useRef(),K=function(){return 1===c.Children.count(x)&&!N&&!A(v)},X="object"===(0,i.Z)(d)&&d.delay?d.delay||!0:!!d;c.useEffect((function(){clearTimeout(q.current),"number"===typeof X?q.current=window.setTimeout((function(){V(X)}),X):V(X)}),[X]),c.useEffect((function(){if(Y&&Y.current&&!1!==J){var t=Y.current.textContent;K()&&T(t)?$||F(!0):$&&F(!1)}}),[Y]);var tt=function(e){var n,r=t.onClick,a=t.disabled;W||a?e.preventDefault():null===(n=r)||void 0===n||n(e)};(0,b.Z)(!("string"===typeof N&&N.length>2),"Button","`icon` is using ReactNode instead of string naming in v4. Please check `".concat(N,"` at https://ant.design/components/icon")),(0,b.Z)(!(O&&A(v)),"Button","`link` or `text` button can't be a `ghost` button.");var et=H("btn",m),nt=!1!==J,rt=E||_,at=rt&&{large:"lg",small:"sm",middle:void 0}[rt]||"",ot=W?"loading":N,it=u()(et,(n={},(0,a.Z)(n,"".concat(et,"-").concat(v),v),(0,a.Z)(n,"".concat(et,"-").concat(y),"default"!==y&&y),(0,a.Z)(n,"".concat(et,"-").concat(at),at),(0,a.Z)(n,"".concat(et,"-icon-only"),!x&&0!==x&&!!ot),(0,a.Z)(n,"".concat(et,"-background-ghost"),O&&!A(v)),(0,a.Z)(n,"".concat(et,"-loading"),W),(0,a.Z)(n,"".concat(et,"-two-chinese-chars"),$&&nt),(0,a.Z)(n,"".concat(et,"-block"),I),(0,a.Z)(n,"".concat(et,"-dangerous"),!!p),(0,a.Z)(n,"".concat(et,"-rtl"),"rtl"===Q),n),C),ct=N&&!W?N:c.createElement(k,{existIcon:!!N,prefixCls:et,loading:!!W}),lt=x||0===x?function(t,e){var n=!1,r=[];return c.Children.forEach(t,(function(t){var e=(0,i.Z)(t),a="string"===e||"number"===e;if(n&&a){var o=r.length-1,c=r[o];r[o]="".concat(c).concat(t)}else r.push(t);n=a})),c.Children.map(r,(function(t){return L(t,e)}))}(x,K()&&nt):null,ut=(0,s.Z)(z,["navigate"]);if(void 0!==ut.href)return c.createElement("a",(0,r.Z)({},ut,{className:it,onClick:tt,ref:Y}),ct,lt);var st=c.createElement("button",(0,r.Z)({},z,{type:R,className:it,onClick:tt,ref:Y}),ct,lt);return A(v)?st:c.createElement(g.Z,{disabled:!!W},st)},j=c.forwardRef(I);j.displayName="Button",j.Group=h,j.__ANT_BUTTON=!0;var R=j},87309:function(t,e,n){var r=n(6417);e.Z=r.Z},84506:function(t,e,n){n.d(e,{Z:function(){return c}});var r=n(83878),a=n(59199),o=n(40181),i=n(25267);function c(t){return(0,r.Z)(t)||(0,a.Z)(t)||(0,o.Z)(t)||(0,i.Z)()}},24400:function(t,e,n){function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n.d(e,{Z:function(){return r}})},72781:function(t,e,n){function r(t){if(Array.isArray(t))return t}n.d(e,{Z:function(){return r}})},64501:function(t,e,n){function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}n.d(e,{Z:function(){return r}})},50678:function(t,e,n){n.d(e,{Z:function(){return i}});var r=n(72781);var a=n(72327),o=n(64501);function i(t,e){return(0,r.Z)(t)||function(t,e){var n=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,a,o=[],i=!0,c=!1;try{for(n=n.call(t);!(i=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);i=!0);}catch(l){c=!0,a=l}finally{try{i||null==n.return||n.return()}finally{if(c)throw a}}return o}}(t,e)||(0,a.Z)(t,e)||(0,o.Z)()}},72327:function(t,e,n){n.d(e,{Z:function(){return a}});var r=n(24400);function a(t,e){if(t){if("string"===typeof t)return(0,r.Z)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?(0,r.Z)(t,e):void 0}}}}]);