// ==UserScript==
// @name         ArbicareAccession
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Accession data from Arbicare.
// @author       Adolfo Medina
// @match        https://partners.arbicare.com/s/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arbicare.com
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ArbicareAccession.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ArbicareAccession.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the table to be fully loaded and populated
    function waitForTable() {
        const table = document.querySelector('div.test-listViewManager table.slds-table');
        if (table && table.querySelectorAll('tbody tr').length > 0) {
            addCopyButtons();
        } else {
            setTimeout(waitForTable, 500); // Retry after 500ms
        }
    }

    // Add a floating button beside each row
    function addCopyButtons() {
        const rows = document.querySelectorAll('div.test-listViewManager table.slds-table tbody tr');
        rows.forEach((row, index) => {
            // Create the button
            const button = document.createElement('button');
            button.textContent = 'Copy';
            button.style.position = 'absolute';
            button.style.marginLeft = '10px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.borderRadius = '5px';
            button.style.fontSize = '12px';

            // Position the button relative to the row
            row.style.position = 'relative';
            row.appendChild(button);

            // Add click event to copy row data
            button.addEventListener('click', () => {
                let date = new Date();
                let timeString = date.toLocaleTimeString();
                let dateString = date.toLocaleDateString();
                
                const rowDataArray = Array.from(row.querySelectorAll('th, td')).map(cell => cell.innerText.trim());

                const formattedRowData = `${dateString}\t` +
                    `\t` +
                    `${rowDataArray[3]}\t` +
                    `${rowDataArray[2]}\t` +
                    `${rowDataArray[5]}\t` +
                    `${rowDataArray[13]}\t` +
                    `\t` +
                    `${rowDataArray[6]}\t` +
                    `${timeString}\t`;
                
                GM_setClipboard(formattedRowData);
                alert(`Row ${index + 1} data copied to clipboard!`);
            });
        });
    }

    // Start the script
    waitForTable();
})();

