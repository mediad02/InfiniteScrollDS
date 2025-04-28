// ==UserScript==
// @name         ArbicareAccession
// @namespace    http://tampermonkey.net/
// @version      v0.01
// @description  try to take over the world!
// @author       Adolfo Medina
// @match        https://partners.arbicare.com/s/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arbicare.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      file://D:/Documents/Projects/JavaScript/InfiniteScrollDS/ArbicareAccession.user.js
// ==/UserScript==

(function() {
    'use strict';

    function parseData(){
        let today = new Date().toLocaleDateString();

        let rows = document.querySelectorAll('table.slds-table.forceRecordLayout.uiVirtualDataTable tr');
        

        console.log(rows[1].innerText);
        console.log("hello");
    }

    parseData();
    
})();