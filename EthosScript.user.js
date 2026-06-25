// ==UserScript==
// @name         Ethos Script
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Enhances Sightline Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://sightline.ethosrisk.com/Cases/CaseSearch
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ethosrisk.com
// @tag          productivity
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/EthosScript.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/EthosScript.user.js
// @resource     NOTYF_CSS https://cdnjs.cloudflare.com/ajax/libs/notyf/3.10.0/notyf.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/notyf/3.10.0/notyf.min.js
// ==/UserScript==
"use strict";(()=>{var n="https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ethos";GM_registerMenuCommand("\u{1F511} Authorize Google Script API",()=>GM_openInTab(n));GM_addStyle(GM_getResourceText("NOTYF_CSS"));GM_xmlhttpRequest({method:"GET",url:n,onload:i});sessionStorage.getItem("scriptLoaded")||(new Notyf({duration:0,position:{x:"right",y:"top"},dismissible:!0}).success("Ethos Script V0.2 Loaded Successfully"),sessionStorage.setItem("scriptLoaded","true"));function i(t){document.getElementById("MainContent_btnSearch").addEventListener("click",()=>{GM_xmlhttpRequest({method:"GET",url:n,onload:i})});let e=new Notyf({duration:3e3,position:{x:"right",y:"top"},dismissible:!0});t.status!==200&&e.error("Request failed with status: "+t.status),e.success("Current Cases Retrieved Successfully");let o=JSON.parse(t.responseText);c(o)}function c(t){document.querySelectorAll("#MainContent_grdSearchResults tbody tr").forEach(e=>{let o=e.querySelector("td:nth-child(7) a")?.textContent?.trim(),s=e.querySelector("td:nth-child(7)");if(o){let r=t.find(a=>a[0]===o);r&&(r[1]===""?(s.style.backgroundColor="chartreuse",s.style.fontWeight="bold"):(s.style.backgroundColor="gold",s.style.fontWeight="bold"))}})}})();
