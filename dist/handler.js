!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.curriedForage=r():e.curriedForage=r()}(global,(function(){return function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r,t){var n,o=this&&this.__awaiter||function(e,r,t,n){return new(t||(t=Promise))((function(o,u){function a(e){try{i(n.next(e))}catch(e){u(e)}}function c(e){try{i(n.throw(e))}catch(e){u(e)}}function i(e){var r;e.done?o(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(a,c)}i((n=n.apply(e,r||[])).next())}))},u=this&&this.__generator||function(e,r){var t,n,o,u,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return u={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function c(u){return function(c){return function(u){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,n&&(o=2&u[0]?n.return:u[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,u[1])).done)return o;switch(n=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return a.label++,{value:u[1],done:!1};case 5:a.label++,n=u[1],u=[0];continue;case 7:u=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===u[0]||2===u[0])){a=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){a.label=u[1];break}if(6===u[0]&&a.label<o[1]){a.label=o[1],o=u;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(u);break}o[2]&&a.ops.pop(),a.trys.pop();continue}u=r.call(e,a)}catch(e){u=[6,e],n=0}finally{t=o=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,c])}}};void 0===(n=function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.handler={returner:function(e,r){return function(t){r||(r=t);var n=typeof r;if("number"!==n&&"string"!==n)return e;switch(r){case 1:case"quiet":return;case 2:case"console":console.log(e);break;case 3:case"break":throw e instanceof Error?(e.message||(e.message="No value"),e):new Error(e||"No result");case 4:case"truthy":return null!=e&&!1!==e;case 5:case"typeof":if(null===e)return"null";if(void 0===e)return"undefined";if(e instanceof Error)return"error";try{return e.map((function(e){return e})),"array"}catch(r){return typeof e}case 6:case"trace":console.trace("TRACE: "+e);break;case 7:case"passthrough":case"default":default:return e}}},logger:function(e,r){return function(t){if(r||(r=t),"string"==typeof r&&e)switch(r){case"none":return;case"string":return e;case"trace":return void console.trace("TRACE: "+e);case"console":return void console.error(e);case"throw":throw e instanceof Error?(e.message||(e.message="No message"),e):new Error(e||"No result")}}},maybeCurry:function(e){return function(r){return"function"==typeof e?e(r):r}},jsonPurify:function(e){var r,t=void 0===e?{}:e,n=t.model,a=t.maxLen,c={};return function(e){return o(this,void 0,void 0,(function(){return u(this,(function(t){try{return a&&e.length>a?[2,null]:("object"!=typeof(r=JSON.parse(e))||Array.isArray(r)?c=r:n.forEach((function(e){r.hasOwnProperty(e)&&(c[e]=r[e])})),[2,c])}catch(e){return[2,e]}return[2]}))}))}}},r.default={handler:r.handler}}.apply(r,[t,r]))||(e.exports=n)}])}));
//# sourceMappingURL=handler.js.map