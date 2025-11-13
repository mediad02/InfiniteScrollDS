// ==UserScript==
// @name         DaneStreet  Special Project Script
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetSpecialProjectScript.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetSpecialProjectScript.user.js
// ==/UserScript==
"use strict";(()=>{var c=`.highlighted-missing-default {
    background-color: #cfffdc;
}

.highlighted-completed-stuck {
    background-color: #ffcccc;
}

.highlighted-drafted-returned {
    background-color: #b9cfff;
}

.highlighted-uploading-working {
    background-color: #ffb6ff;
}`;GM_registerMenuCommand("Authorize Google",()=>GM_openInTab("https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ds_sp"));document.head.appendChild(document.createElement("style")).textContent=c;var u=m();f("table-02",r=>{console.log("\u2705 Table loaded:",r),u.then(h),g("table-02",o=>{console.log("\u2705 Table changed:",o),u.then(h)})});function g(r,o){let e=document.getElementById(r),t;if(!e){console.warn(`Element with ID "${r}" not found.`);return}new MutationObserver((i,l)=>{let s=!1;for(let a of i)a.type==="childList"&&(a.addedNodes.length>0||a.removedNodes.length>0)&&(s=!0);s&&(clearTimeout(t),t=setTimeout(()=>{o(e.querySelector("table.index"))},200))}).observe(e,{childList:!0,subtree:!0})}function f(r,o){let e=document.getElementById(r);if(!e){console.warn(`Element with ID "${r}" not found.`);return}let t=e.querySelector("table.index");if(t){o(t);return}new MutationObserver((i,l)=>{for(let s of i)if(s.addedNodes.length!==0)for(let a of Array.from(s.addedNodes)){if(!(a instanceof HTMLElement))continue;if(a.matches("table.index")){o(a),l.disconnect();return}let d=a.querySelector("table.index");if(d){o(d),l.disconnect();return}}}).observe(e,{childList:!0,subtree:!0})}function m(){return new Promise((r,o)=>{GM_xmlhttpRequest({method:"GET",url:"https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ds_sp",onload:e=>{try{let t=JSON.parse(e.responseText);Array.isArray(t)?r(t.map(n=>Array.isArray(n)?n.map(i=>String(i)):[String(n)])):o(new Error("Response is not an array"))}catch(t){o(new Error("Failed to parse response as JSON: "+t))}},onerror:()=>{o(new Error("Request failed"))}})})}function h(r){document.querySelectorAll("table.index tbody tr").forEach(e=>{let t=e.querySelector("td:nth-child(2) a")?.textContent?.trim();if(t){let n=r.find(i=>i[0]===t);if(n)switch(n[1]){case"pending qa/report upload":e.classList.add("highlighted-drafted-returned");break;case"all process completed-sent":e.classList.add("highlighted-completed-stuck");break;case"ready for qa/report upload":e.classList.add("highlighted-uploading-working");break;default:e.classList.add("highlighted-missing-default");break}}})}})();
