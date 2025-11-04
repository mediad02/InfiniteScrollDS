// ==UserScript==
// @name         DaneStreet Script
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @require      https://cdn.jsdelivr.net/npm/docx@9.5.0/dist/index.iife.min.js
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetScript.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetScript.user.js
// ==/UserScript==
"use strict";(()=>{var m=class{constructor(t){this.container=t,this.button=document.createElement("button"),this.button.textContent="Copy Row",this.button.classList.add("copy-button"),this.container.appendChild(this.button),this.button.addEventListener("click",this.HandleClick.bind(this))}async HandleClick(){let t=this.button,n=this.container;t.disabled=!0,t.textContent="Loading...",t.style.backgroundColor="orange";let e=this.extractRowData(n),r=await this.fetchReferralDetails(e.referralNum),a=this.extractReferralDetailsHtmlData(r,e.isRush);e={...e,...a},this.CopyToClipboard(e.expeditedDate+"	"+e.referralNum+"	"+e.isRush+"	"+e.expeditedTime+"	"+e.timeInQueue+"	"+e.timeDueString+"				X	"+e.referralDiv+"	"+e.stateJurisdiction+"	"+e.initialPageCount+"		"+e.client),t.textContent="Copied!",t.style.backgroundColor="green"}extractRowData(t){let n={"PAS Division 1":"PAS Div 1","PAS Division 2":"PAS Div 2","PAS Division 3":"PAS Div 3","PAS Division 4":"PAS Div 4","Group Health Division 1":"DIV1","Group Health Division 2":"DIV2","Group Health Division 3":"DIV3"},e=t.querySelectorAll("td"),r=e[1].querySelector("a")?.textContent.trim()||"",a=e[1]?.querySelector("span[style]")?.textContent.trim()==="!!!",s=e[1]?.querySelector('img[src*="megaphone"]')!==null,c=e[2].firstChild?.textContent.trim()||"",d=n[c]||c,i=e[3]?.textContent.trim()||"",o=e[6]?.textContent.trim()||"",u=e[7]?.lastChild?.textContent.trim()||"",y=this.parseTimeString(u,"hasDashes").toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),D=e[8]?.textContent.trim()||"",p="";return i==="AMER"&&o==="CA"||i==="CORV"&&o==="NY"?p="XX":(a||s)&&(p="X"),{referralNum:r,isRush:p,timeInQueue:y,referralDiv:d,stateJurisdiction:o,initialPageCount:D,client:i}}parseTimeString(t,n){let e="";switch(n){case"hasDashes":e=t.replace(/(\d{1,2}:\d{2})(AM|PM)/,"$1 $2");break;case"hasAt":e=t.replace(/ at (\d{2}:\d{2})(AM|PM)/," $1 $2");break}let r=new Date(e);return r.setHours(r.getHours()),r}async fetchReferralDetails(t){let n="https://danestreet.com/referrals/"+t;try{let e=await fetch(n,{credentials:"include"});if(!e.ok)throw new Error("Error fetching next page: "+e.statusText);return await e.text()}catch(e){return console.error("Error fetching referral details HTML:",e),{}}}extractReferralDetailsHtmlData(t,n){if(!t)return{};let r=new DOMParser().parseFromString(t,"text/html").querySelectorAll('body table.index tbody tr[data-org-name="Oristech"] td:nth-child(3)'),a=(r[r.length-1]?.textContent||"").trim();if(a){let s=this.parseTimeString(a,"hasAt"),c=s.toLocaleDateString(),d=s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i=new Date(s),o={XX:1,X:2,default:4},u=o[n]!==void 0?o[n]:o.default;i.setHours(i.getHours()+u);let h=i.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return{expeditedDate:c,expeditedTime:d,timeDueString:h}}else return{}}async CopyToClipboard(t){if(!document.hasFocus()){let n=async()=>{try{await navigator.clipboard.writeText(t)}catch(e){console.error("Failed to copy: ",e)}window.removeEventListener("focus",n)};window.addEventListener("focus",n);return}try{await navigator.clipboard.writeText(t)}catch(n){console.error("Failed to copy: ",n)}}},g=m;var x=`.highlighted {
    background-color: #cfffdc;
}

`;var b=`.copy-button {
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
}`;document.head.appendChild(document.createElement("style")).textContent=x;document.head.appendChild(document.createElement("style")).textContent=b;f();var w=T();function v(){document.querySelectorAll("div.needs-case-preparation table.index tbody tr, div.needs-clinical-preparation table.index tbody tr").forEach(t=>new g(t))}function f(){let l=document.querySelector("div.needs-case-preparation a.next_page, div.needs-clinical-preparation a.next_page");l?GM_xmlhttpRequest({method:"GET",url:l.href,onload:e=>{t(e),n(e),f()}}):(v(),w.then(e=>S(e)));function t(e){let a=new DOMParser().parseFromString(e.responseText,"text/html"),s=document.querySelector("div.needs-case-preparation table.index"),c=document.querySelector("div.needs-clinical-preparation table.index"),d=a.querySelectorAll("div.needs-case-preparation table.index tbody tr"),i=a.querySelectorAll("div.needs-clinical-preparation table.index tbody tr");d.forEach(o=>s?.querySelector("tbody")?.appendChild(o)),i.forEach(o=>c?.querySelector("tbody")?.appendChild(o))}function n(e){let a=new DOMParser().parseFromString(e.responseText,"text/html"),s=document.querySelector("div.needs-case-preparation div.pagination"),c=document.querySelector("div.needs-clinical-preparation div.pagination"),d=a.querySelector("div.needs-case-preparation div.pagination"),i=a.querySelector("div.needs-clinical-preparation div.pagination");d&&s?.replaceWith(d),i&&c?.replaceWith(i)}}function T(){return new Promise((l,t)=>{GM_xmlhttpRequest({method:"GET",url:"https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec",onload:n=>{try{let e=JSON.parse(n.responseText);Array.isArray(e)?l(e.map(r=>String(r))):t(new Error("Response is not an array"))}catch(e){t(new Error("Failed to parse response as JSON: "+e))}},onerror:()=>{t(new Error("Request failed"))}})})}function S(l){document.querySelectorAll("div.needs-case-preparation table.index tbody tr, div.needs-clinical-preparation table.index tr").forEach(n=>{let e=n.querySelector("td:nth-child(2) a")?.textContent?.trim();e&&l.includes(e)&&n.classList.add("highlighted")})}})();
