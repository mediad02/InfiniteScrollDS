// ==UserScript==
// @name         DaneStreet Overhaul Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Upgrades and Overhauls to DaneStreet website for Oristech Purpuses
// @author       Adolfo Medina
// @match        https://danestreet.com/dashboard*
// @match        https://danestreet.com/referrals/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      file://D:/Documents/Projects/JavaScript/InfiniteScrollDS/DaneStreetOverhaulScript.user.js
// ==/UserScript==

(function () {
    'use strict';

    const strategies = {
        dashboard: () => {
            console.log('Dashboard strategy running...');
            // logic here
        },
        case: () => {
            console.log('Case strategy running...');
            // logic here
        }
    };

    const path = location.pathname;

    if (path.includes('/dashboard')) strategies.dashboard();
    else if (/^\/referrals\/\d{7}$/.test(path)) strategies.case();
    else console.log('No strategy found for this page.');
})();
