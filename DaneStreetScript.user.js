// ==UserScript==
// @name         DaneStreet Script
// @namespace    http://tampermonkey.net/
// @version      0.05
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @require      https://cdn.jsdelivr.net/npm/docx@9.5.1/dist/index.iife.min.js
// @tag          productivity
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetScript.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetScript.user.js
// ==/UserScript==
"use strict";(()=>{var P=class{constructor(t){this.container=t,this.button=document.createElement("button"),this.button.textContent="Copy Row",this.button.classList.add("copy-button"),this.button.type="button",this.container.appendChild(this.button),this.button.addEventListener("click",this.HandleClick.bind(this))}async HandleClick(){let t=this.button,n=this.container;t.disabled=!0,t.textContent="Loading...",t.style.backgroundColor="orange";let e=this.extractRowData(n),a=await this.fetchReferralDetails(e.referralNum),c=this.extractReferralDetailsHtmlData(a,e.isRush);e={...e,...c},this.CopyToClipboard(e.expeditedDate+"	"+e.referralNum+"	"+e.isRush+"	"+e.expeditedTime+"	"+e.timeInQueue+"	"+e.timeDueString+"				X	"+e.referralDiv+"	"+e.stateJurisdiction+"	"+e.initialPageCount+"		"+e.client),t.textContent="Copied!",t.style.backgroundColor="green"}extractRowData(t){let n={"PAS Division 1":"PAS Div 1","PAS Division 2":"PAS Div 2","PAS Division 3":"PAS Div 3","PAS Division 4":"PAS Div 4","Group Health Division 1":"DIV1","Group Health Division 2":"DIV2","Group Health Division 3":"DIV3"},e=t.querySelectorAll("td"),a=e[1].querySelector("a")?.textContent.trim()||"",c=e[1]?.querySelector("span[style]")?.textContent.trim()==="!!!",p=e[1]?.querySelector('img[src*="megaphone"]')!==null,h=e[2].firstChild?.textContent.trim()||"",d=n[h]||h,s=e[3]?.textContent.trim()||"",i=e[6]?.textContent.trim()||"",u=e[7]?.lastChild?.textContent.trim()||"",f=this.parseTimeString(u,"hasDashes").toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),l=e[8]?.textContent.trim()||"",o="";return s==="AMER"&&i==="CA"||s==="CORV"&&i==="NY"?o="XX":(c||p)&&(o="X"),{referralNum:a,isRush:o,timeInQueue:f,referralDiv:d,stateJurisdiction:i,initialPageCount:l,client:s}}parseTimeString(t,n){let e="";switch(n){case"hasDashes":e=t.replace(/(\d{1,2}:\d{2})(AM|PM)/,"$1 $2");break;case"hasAt":e=t.replace(/ at (\d{2}:\d{2})(AM|PM)/," $1 $2");break}let a=new Date(e);return a.setHours(a.getHours()+1),a}async fetchReferralDetails(t){let n="https://danestreet.com/referrals/"+t;try{let e=await fetch(n,{credentials:"include"});if(!e.ok)throw new Error("Error fetching next page: "+e.statusText);return await e.text()}catch(e){return console.error("Error fetching referral details HTML:",e),{}}}extractReferralDetailsHtmlData(t,n){if(!t)return{};let e=new DOMParser().parseFromString(t,"text/html"),a=e.querySelectorAll('body table.index tbody tr[data-org-name="Oristech"] td:nth-child(3)'),c=[];e.querySelectorAll("table.index tbody tr").forEach(d=>{let s=d.querySelectorAll("td")||[];for(let i=0;i<s.length-1;i++)if(s[i]?.textContent.includes("Clinical Prepared")){c.push(s[i+1]);break}});let p=[...a,...c];console.log(p);let h=(p[p.length-1]?.textContent||"").trim();if(h){let d=this.parseTimeString(h,"hasAt"),s=d.toLocaleDateString(),i=d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),u=new Date(d),m={XX:1,X:2,default:4},f=m[n]!==void 0?m[n]:m.default;u.setHours(u.getHours()+f);let l=u.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return{expeditedDate:s,expeditedTime:i,timeDueString:l}}else return{}}async CopyToClipboard(t){if(!document.hasFocus()){let n=async()=>{try{await navigator.clipboard.writeText(t)}catch(e){console.error("Failed to copy: ",e)}window.removeEventListener("focus",n)};window.addEventListener("focus",n);return}try{await navigator.clipboard.writeText(t)}catch(n){console.error("Failed to copy: ",n)}}},R=P;var L=`.highlighted {
    background-color: #cfffdc;
}

`;var A=`.copy-button {
  background-color: blue;
  display: block;
  margin: 0 auto;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;
}

.copy-button:hover {
  box-shadow: 0 0 20px rgba(0, 0, 255, 0.5);
	animation: shake 0.5s ease-in-out infinite;
}

.copy-button:active {
	background-color: #3e8e41;
	box-shadow: 0 5px #666;
	transform: translateY(4px);
	animation: shake 0.5s ease-in-out infinite;
	animation-iteration-count: 10;
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25%, 75% { transform: translateX(5px); }
	50% { transform: translateX(-5px); }
}`;function v(){document.head.appendChild(document.createElement("style")).textContent=L,document.head.appendChild(document.createElement("style")).textContent=A;let E="div.needs-case-preparation table.index",t="div.needs-clinical-preparation table.index",n="div.needs-case-preparation table.index tbody tr",e="div.needs-clinical-preparation table.index tbody tr",a="div.needs-case-preparation div.pagination",c="div.needs-clinical-preparation div.pagination",p="div.needs-case-preparation a.next_page",h="div.needs-clinical-preparation a.next_page",d="https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec";u();let s=m();function i(){document.querySelectorAll(`${n}, ${e}`).forEach(o=>new R(o))}function u(){let l=document.querySelector(`${p}, ${h}`);l?GM_xmlhttpRequest({method:"GET",url:l.href,onload:r=>{o(r),g(r),u()}}):(i(),s.then(r=>f(r)));function o(r){let b=new DOMParser().parseFromString(r.responseText,"text/html"),D=document.querySelector(E),w=document.querySelector(t),x=b.querySelectorAll(n),y=b.querySelectorAll(e);x.forEach(T=>D?.querySelector("tbody")?.appendChild(T)),y.forEach(T=>w?.querySelector("tbody")?.appendChild(T))}function g(r){let b=new DOMParser().parseFromString(r.responseText,"text/html"),D=document.querySelector(a),w=document.querySelector(c),x=b.querySelector(a),y=b.querySelector(c);x&&D?.replaceWith(x),y&&w?.replaceWith(y)}}function m(){return new Promise((l,o)=>{GM_xmlhttpRequest({method:"GET",url:d,onload:g=>{try{let r=JSON.parse(g.responseText);Array.isArray(r)?l(r.map(S=>String(S))):o(new Error("Response is not an array"))}catch(r){o(new Error("Failed to parse response as JSON: "+r))}},onerror:()=>{o(new Error("Request failed"))}})})}function f(l){document.querySelectorAll(`${n}, ${e}`).forEach(g=>{let r=g.querySelector("td:nth-child(2) a")?.textContent?.trim();r&&l.includes(r)&&g.classList.add("highlighted")})}}var C=window.location.href;C.startsWith("https://danestreet.com/referrals")?H():C.startsWith("https://danestreet.com/dashboard")?v():C.startsWith("https://danestreet.com/preparations")&&H();function H(){console.log("handleSomeOtherRoute")}})();
