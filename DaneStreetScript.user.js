// ==UserScript==
// @name         DaneStreet Script
// @namespace    http://tampermonkey.net/
// @version      0.04
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
"use strict";(()=>{var g=class{constructor(n){this.container=n,this.button=document.createElement("button"),this.button.textContent="Copy Row",this.button.classList.add("copy-button"),this.container.appendChild(this.button),this.button.addEventListener("click",this.HandleClick.bind(this))}async HandleClick(){let n=this.button,r=this.container;n.disabled=!0,n.textContent="Loading...",n.style.backgroundColor="orange";let e=this.extractRowData(r),c=await this.fetchReferralDetails(e.referralNum),o=this.extractReferralDetailsHtmlData(c,e.isRush);e={...e,...o},this.CopyToClipboard(e.expeditedDate+"	"+e.referralNum+"	"+e.isRush+"	"+e.expeditedTime+"	"+e.timeInQueue+"	"+e.timeDueString+"				X	"+e.referralDiv+"	"+e.stateJurisdiction+"	"+e.initialPageCount+"		"+e.client),n.textContent="Copied!",n.style.backgroundColor="green"}extractRowData(n){let r={"PAS Division 1":"PAS Div 1","PAS Division 2":"PAS Div 2","PAS Division 3":"PAS Div 3","PAS Division 4":"PAS Div 4","Group Health Division 1":"DIV1","Group Health Division 2":"DIV2","Group Health Division 3":"DIV3"},e=n.querySelectorAll("td"),c=e[1].querySelector("a")?.textContent.trim()||"",o=e[1]?.querySelector("span[style]")?.textContent.trim()==="!!!",i=e[1]?.querySelector('img[src*="megaphone"]')!==null,l=e[2].firstChild?.textContent.trim()||"",t=r[l]||l,s=e[3]?.textContent.trim()||"",a=e[6]?.textContent.trim()||"",d=e[7]?.lastChild?.textContent.trim()||"",u=this.parseTimeString(d,"hasDashes").toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),h=e[8]?.textContent.trim()||"",m="";return s==="AMER"&&a==="CA"||s==="CORV"&&a==="NY"?m="XX":(o||i)&&(m="X"),{referralNum:c,isRush:m,timeInQueue:u,referralDiv:t,stateJurisdiction:a,initialPageCount:h,client:s}}parseTimeString(n,r){let e="";switch(r){case"hasDashes":e=n.replace(/(\d{1,2}:\d{2})(AM|PM)/,"$1 $2");break;case"hasAt":e=n.replace(/ at (\d{2}:\d{2})(AM|PM)/," $1 $2");break}let c=new Date(e);return c.setHours(c.getHours()),c}async fetchReferralDetails(n){let r="https://danestreet.com/referrals/"+n;try{let e=await fetch(r,{credentials:"include"});if(!e.ok)throw new Error("Error fetching next page: "+e.statusText);return await e.text()}catch(e){return console.error("Error fetching referral details HTML:",e),{}}}extractReferralDetailsHtmlData(n,r){if(!n)return{};let e=new DOMParser().parseFromString(n,"text/html"),c=e.querySelectorAll('body table.index tbody tr[data-org-name="Oristech"] td:nth-child(3)'),o=[];e.querySelectorAll("table.index tbody tr").forEach(t=>{let s=t.querySelectorAll("td")||[];for(let a=0;a<s.length-1;a++)if(s[a]?.textContent.includes("Clinical Prepared")){o.push(s[a+1]);break}});let i=[...c,...o];console.log(i);let l=(i[i.length-1]?.textContent||"").trim();if(l){let t=this.parseTimeString(l,"hasAt"),s=t.toLocaleDateString(),a=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),d=new Date(t),p={XX:1,X:2,default:4},u=p[r]!==void 0?p[r]:p.default;d.setHours(d.getHours()+u);let h=d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return{expeditedDate:s,expeditedTime:a,timeDueString:h}}else return{}}async CopyToClipboard(n){if(!document.hasFocus()){let r=async()=>{try{await navigator.clipboard.writeText(n)}catch(e){console.error("Failed to copy: ",e)}window.removeEventListener("focus",r)};window.addEventListener("focus",r);return}try{await navigator.clipboard.writeText(n)}catch(r){console.error("Failed to copy: ",r)}}},y=g;var D=`.highlighted {
    background-color: #cfffdc;
}

`;var w=`.copy-button {
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
}`;function f(){document.head.appendChild(document.createElement("style")).textContent=D,document.head.appendChild(document.createElement("style")).textContent=w,r();let x=e();function n(){document.querySelectorAll("div.needs-case-preparation table.index tbody tr, div.needs-clinical-preparation table.index tbody tr").forEach(i=>new y(i))}function r(){let o=document.querySelector("div.needs-case-preparation a.next_page, div.needs-clinical-preparation a.next_page");o?GM_xmlhttpRequest({method:"GET",url:o.href,onload:t=>{i(t),l(t),r()}}):(n(),x.then(t=>c(t)));function i(t){let a=new DOMParser().parseFromString(t.responseText,"text/html"),d=document.querySelector("div.needs-case-preparation table.index"),p=document.querySelector("div.needs-clinical-preparation table.index"),u=a.querySelectorAll("div.needs-case-preparation table.index tbody tr"),h=a.querySelectorAll("div.needs-clinical-preparation table.index tbody tr");u.forEach(m=>d?.querySelector("tbody")?.appendChild(m)),h.forEach(m=>p?.querySelector("tbody")?.appendChild(m))}function l(t){let a=new DOMParser().parseFromString(t.responseText,"text/html"),d=document.querySelector("div.needs-case-preparation div.pagination"),p=document.querySelector("div.needs-clinical-preparation div.pagination"),u=a.querySelector("div.needs-case-preparation div.pagination"),h=a.querySelector("div.needs-clinical-preparation div.pagination");u&&d?.replaceWith(u),h&&p?.replaceWith(h)}}function e(){return new Promise((o,i)=>{GM_xmlhttpRequest({method:"GET",url:"https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec",onload:l=>{try{let t=JSON.parse(l.responseText);Array.isArray(t)?o(t.map(s=>String(s))):i(new Error("Response is not an array"))}catch(t){i(new Error("Failed to parse response as JSON: "+t))}},onerror:()=>{i(new Error("Request failed"))}})})}function c(o){document.querySelectorAll("div.needs-case-preparation table.index tbody tr, div.needs-clinical-preparation table.index tr").forEach(l=>{let t=l.querySelector("td:nth-child(2) a")?.textContent?.trim();t&&o.includes(t)&&l.classList.add("highlighted")})}}var b=window.location.href;b.startsWith("https://danestreet.com/referrals")?T():b.startsWith("https://danestreet.com/dashboard")?f():b.startsWith("https://danestreet.com/preparations")&&T();function T(){console.log("handleSomeOtherRoute")}})();
