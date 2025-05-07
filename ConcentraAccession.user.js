// ==UserScript==
// @name         Concentra Accession
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Accession data from Concentra.
// @author       Adolfo Medina
// @match        https://genex.cidmcorp.com/default.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cidmcorp.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ConcentraAccession.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ConcentraAccession.user.js
// @require      file://D:/Users/Adolfo/Documents/Projects/JavaScript/InfiniteScrollDS/ConcentraAccession.user.js
// ==/UserScript==


(function() {
    'use strict';

    function addCopyButtons() {
        let rows = document.querySelectorAll('table.k-grid-table.k-table.k-table-md tbody tr.k-master-row')

        rows.forEach((row, index) => {
            // Create the button
            let button = document.createElement('button');
            button.className = 'copy-button';
            button.type = 'button'
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
                let rowDataArray = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText.trim());

                let isCall = row.querySelector('td:nth-child(19)').childElementCount > 0 ? "C" : "NC";

                let isStat = rowDataArray[2].includes("Stat") ? "Stat" : "";

                const orgMap = {
                    "Am Trust North America": "AMT",
                    "Sentry Insurance Company": "SENTRY",
                    "Liberty Mutual": "LM",
                    "Texas Mutual Insurance": "TMI",
                    "Helmsman Management": "Helmsman",
                }

                let organization = rowDataArray[5].trim();
                organization = orgMap[organization] || organization;

                let formattedRowData = `${organization}\t` +
                   `${rowDataArray[16]}\t` +
                   `${isCall}\t\t\t\t` +
                   `${isStat}`;

                navigator.clipboard.writeText(formattedRowData).then(() => {
                    console.log(`Row ${index} data copied to clipboard`);
                }).catch(err => {
                    console.error('Error copying text: ', err);
                });

                button.textContent = "Copied!";
                button.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    button.textContent = "Copy";
                    button.style.backgroundColor = '#007bff';
                }, 2000);
            });
        });
        }
    

    let startButton = document.querySelector('#btnLoadReviews');
    startButton.addEventListener('click', function() {
        setTimeout(addCopyButtons, 500);
    });

})();