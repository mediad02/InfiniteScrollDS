// ==UserScript==
// @name         Ethos Script
// @namespace    http://tampermonkey.net/
// @version      0.01
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
"use strict";(()=>{var s="https://script.google.com/macros/s/AKfycbwJo_lVDhGnVBiuY6RiR-Yxo0UthaqrQ2dJIV2pmmwIqa-GlKRrjL4_n5ed14I_QgIsDQ/exec?route=ethos";GM_registerMenuCommand("\u{1F511} Authorize Google Script API",()=>GM_openInTab(s));GM_addStyle(GM_getResourceText("NOTYF_CSS"));GM_xmlhttpRequest({method:"GET",url:s,onload:c});sessionStorage.getItem("scriptLoaded")||(new Notyf({duration:0,position:{x:"right",y:"top"},dismissible:!0}).success("Ethos Script V0.1 Loaded Successfully"),sessionStorage.setItem("scriptLoaded","true"));function c(e){document.getElementById("MainContent_btnSearch").addEventListener("click",()=>{GM_xmlhttpRequest({method:"GET",url:s,onload:c})});let n=new Notyf({duration:3e3,position:{x:"right",y:"top"},dismissible:!0});e.status!==200&&n.error("Request failed with status: "+e.status),n.success("Current Cases Retrieved Successfully");let l=JSON.parse(e.responseText),r=document.getElementById("MainContent_grdSearchResults").rows;for(let o=1;o<r.length;o++){let t=r[o]?.cells[6],i=t?.innerText;i&&l.includes(i)&&t&&t.style&&(t.style.backgroundColor="chartreuse",t.style.fontWeight="bold")}}})();
