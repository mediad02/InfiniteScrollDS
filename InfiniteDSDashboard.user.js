// ==UserScript==
// @name         Infinite DS Dashboard (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        addCopyButtons();
    });

    function addCopyButtons() {
        document.body.addEventListener('click', async (event) => {
            if (event.target.classList.contains('copy-btn')) {
                const button = event.target;
                const row = button.closest('tr');
                button.textContent = 'Loading...';
                button.style.backgroundColor = 'orange';

                try {
                    let rowData = getRowData(row);
                    let additionalData = await fetchReferralData(rowData.referralNumber);
                    let finalData = { ...rowData, ...additionalData };

                    copyToClipboard(finalData);
                    button.textContent = 'Copied!';
                    button.style.backgroundColor = 'green';
                    button.disabled = true;
                } catch (error) {
                    console.error('Error processing row:', error);
                    button.textContent = 'Error!';
                    button.style.backgroundColor = 'red';
                }
            }
        });

        document.querySelectorAll('div.needs-case-preparation table tbody tr, div.needs-clinical-preparation table tbody tr')
            .forEach(row => {
                const button = document.createElement('button');
                button.textContent = 'Copy Row';
                button.className = 'copy-btn';
                row.appendChild(button);
            });
    }

    async function fetchReferralData(referralNumber) {
        const url = `https://danestreet.com/referrals/${referralNumber}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status !== 200) {
                        reject('Failed to fetch referral data');
                        return;
                    }
                    let doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    let expeditedTime = doc.querySelector('table.index tbody tr[data-org-name="Oristech"] td:nth-child(3)')?.textContent.trim();
                    resolve(parseDateTime(expeditedTime));
                },
                onerror: () => reject('Request failed')
            });
        });
    }

    function getRowData(row) {
        let cells = row.children;
        return {
            formattedDate: new Date().toLocaleDateString(),
            referralNumber: cells[1].querySelector('a')?.textContent.trim(),
            isRush: checkRush(row),
            teamAssignment: getTeam(cells[2].textContent.trim()),
            client: cells[3].textContent.trim(),
            stateJurisdiction: cells[6].textContent.trim(),
            initialPageCount: cells[8].textContent.trim(),
        };
    }

    function checkRush(row) {
        let rushIndicator = row.querySelector('td:nth-child(2) span[style]')?.textContent.trim();
        let hasCaseNotification = row.querySelector('td:nth-child(2) img[src*="megaphone"]');
        return (rushIndicator === '!!!' || hasCaseNotification) ? 'X' : '';
    }

    function parseDateTime(dateStr) {
        if (!dateStr) return {};
        let date = new Date(dateStr.replace(' at ', 'T'));
        return {
            formattedDate: date.toLocaleDateString(),
            formattedTime: date.toLocaleTimeString(),
        };
    }

    function getTeam(teamName) {
        const teamMap = {
            'PAS Division 1': 'PAS Div 1',
            'PAS Division 2': 'PAS Div 2',
            'PAS Division 3': 'PAS Div 3',
            'PAS Division 4': 'PAS Div 4',
            'Group Health Division 1': 'DIV1',
            'Group Health Division 2': 'DIV2',
            'Group Health Division 3': 'DIV3'
        };
        return teamMap[teamName] || teamName;
    }

    function copyToClipboard(data) {
        let text = `${data.formattedDate}\t${data.referralNumber}\t${data.isRush}\t${data.formattedTime}\t${data.teamAssignment}\t${data.stateJurisdiction}\t${data.initialPageCount}\t${data.client}`;
        GM_setClipboard(text);
    }
})();
