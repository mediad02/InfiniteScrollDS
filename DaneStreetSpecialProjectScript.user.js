// ==UserScript==
// @name         DaneStreet  Special Project Script
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetSpecialProjectScript.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/DaneStreetSpecialProjectScript.user.js
// ==/UserScript==
"use strict";(()=>{var c=`.highlighted {
    background-color: #cfffdc;
}

`;GM_registerMenuCommand("Authorize Google",()=>GM_openInTab("https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ds_sp"));document.head.appendChild(document.createElement("style")).textContent=c;var u=f();h("table-02",n=>{console.log("\u2705 Table loaded:",n),u.then(m),b("table-02",t=>{console.log("\u2705 Table changed:",t),u.then(m)})});function b(n,t){let o=document.getElementById(n),e;if(!o){console.warn(`Element with ID "${n}" not found.`);return}new MutationObserver((l,a)=>{let s=!1;for(let r of l)r.type==="childList"&&(r.addedNodes.length>0||r.removedNodes.length>0)&&(s=!0);s&&(clearTimeout(e),e=setTimeout(()=>{t(o.querySelector("table.index"))},200))}).observe(o,{childList:!0,subtree:!0})}function h(n,t){let o=document.getElementById(n);if(!o){console.warn(`Element with ID "${n}" not found.`);return}let e=o.querySelector("table.index");if(e){t(e);return}new MutationObserver((l,a)=>{for(let s of l)if(s.addedNodes.length!==0)for(let r of Array.from(s.addedNodes)){if(!(r instanceof HTMLElement))continue;if(r.matches("table.index")){t(r),a.disconnect();return}let d=r.querySelector("table.index");if(d){t(d),a.disconnect();return}}}).observe(o,{childList:!0,subtree:!0})}function f(){return new Promise((n,t)=>{GM_xmlhttpRequest({method:"GET",url:"https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ds_sp",onload:o=>{try{let e=JSON.parse(o.responseText);Array.isArray(e)?n(e.map(i=>String(i))):t(new Error("Response is not an array"))}catch(e){t(new Error("Failed to parse response as JSON: "+e))}},onerror:()=>{t(new Error("Request failed"))}})})}function m(n){document.querySelectorAll("table.index tbody tr").forEach(o=>{let e=o.querySelector("td:nth-child(2) a")?.textContent?.trim();e&&n.includes(e)&&o.classList.add("highlighted")})}})();
