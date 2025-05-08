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

(function () {
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
            const button = createCopyButton();

            // Position the button relative to the row
            row.style.position = 'relative';
            row.prepend(button);

            // Add click event to copy row data
            button.addEventListener('click', () => handleCopyClick(row, index));
        });
    }

    // Handle the copy button click event
    function handleCopyClick(row, index) {
        const rowDataArray = Array.from(row.querySelectorAll('th, td')).map(cell => cell.innerText.trim());

        // Rearrange or format the data as needed
        const formattedRowData = formatRowData(rowDataArray);

        // Copy to clipboard
        GM_setClipboard(formattedRowData);
    }

    // Format row data into a tab-separated string
    function formatRowData(rowDataArray) {
        const date = new Date();
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString();

        // Example of rearranging or formatting data
        return [
            dateString,
            '', // Empty column
            rowDataArray[3] || '', // Safely access array elements
            rowDataArray[2] || '',
            rowDataArray[5] || '',
            rowDataArray[13] || '',
            '', // Empty column
            rowDataArray[6] || '',
            timeString,
        ].join('\t');
    }

    // Create a reusable copy button
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        Object.assign(button.style, {
            position: 'absolute',
            marginLeft: '10px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
        });
        return button;
    }

    // Start the script
    waitForTable();
})();

