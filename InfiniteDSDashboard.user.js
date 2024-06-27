// ==UserScript==
// @name         Infinite DS Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load all pages of DaneStreet dashboard
// @author       Adolfo Medina
// @match        https://danestreet.com/dashboard*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      file:///c%3A/Users/Adolfo/Documents/C%23%20Projects/InfiniteScrollDS/InfiniteDSDashboard.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Create a notification element
    const notification = document.createElement('div');
    notification.textContent = 'Text copied to clipboard!';
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.left = '10px';
    notification.style.padding = '10px';
    notification.style.background = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.opacity = 0;
    notification.style.transition = 'opacity 0.5s ease-out';
    notification.style.display = 'none';

    document.body.appendChild(notification);

    // Wait for the DOM to be ready
    $(function () {
        loadAllPages();
    });

    function loadAllPages() {
        // selector constants
        const NEEDS_CASE_PREPARATION_SELECTOR = 'div.needs-case-preparation table tbody';
        const NEEDS_CLINICAL_PREPARATION_SELECTOR = 'div.needs-clinical-preparation table tbody';
        const CASE_PREP_PAGINATION_SELECTOR = 'div.needs-case-preparation div.pagination';
        const CLINICAL_PREP_PAGINATION_SELECTOR = 'div.needs-clinical-preparation div.pagination';

        function loadNextPage() {
            // check for next page link
            let nextPageLink = document.querySelector('div.pagination a.next_page');
            let nextPageUrl = nextPageLink ? nextPageLink.href : undefined;
            let hasMorePages = nextPageUrl !== undefined;

            if (!hasMorePages) {
                // Add buttons to each row for copying individual row data
                addCopyButtons();
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: nextPageUrl,
                onload: function (response) {
                    if (response.status !== 200) {
                        console.error('Error fetching next page:', response.statusText);
                        hasMorePages = false;
                        return;
                    }
                    try {
                        let newDoc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        let newRows_NeedsCasePreparation = $(newDoc).find('div.needs-case-preparation table tbody tr');
                        $(NEEDS_CASE_PREPARATION_SELECTOR).append(newRows_NeedsCasePreparation);
                        let newRows_NeedsClinicalPreparation = $(newDoc).find('div.needs-clinical-preparation table tbody tr');
                        $(NEEDS_CLINICAL_PREPARATION_SELECTOR).append(newRows_NeedsClinicalPreparation);
                        $(CASE_PREP_PAGINATION_SELECTOR).replaceWith($(newDoc).find(CASE_PREP_PAGINATION_SELECTOR));
                        $(CLINICAL_PREP_PAGINATION_SELECTOR).replaceWith($(newDoc).find(CLINICAL_PREP_PAGINATION_SELECTOR));
                        loadNextPage();
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        hasMorePages = false;
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching next page:', error);
                    hasMorePages = false;
                }
            });
        }

        function addCopyButtons() {
            const rows = document.querySelectorAll('div.needs-case-preparation table tbody tr, div.needs-clinical-preparation table tbody tr');
            rows.forEach(row => {
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy Row';
                copyButton.addEventListener('click', () => {
                    copyRowData(row);
                });
                row.appendChild(copyButton);
            });
        }

        function copyRowData(row) {
            // Extract text content from the row and join them with new lines
            let rowData = getRowData(row);

            // Copy the text to the clipboard
            copyToClipboard(rowData);
        }

        loadNextPage();
    }

    function getRowData(row) {
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();

        let rowData = '';
        let formattedDate = month + '/' + day + '/' + year;
        let referralNumber = row.querySelector('td:nth-child(2) a')?.textContent.trim();
        let rushIndicator = row.querySelector('td:nth-child(2) span[style]')?.textContent.trim();
        // let checkCaseNotification = row.querySelector('td:nth-child(2) img[src="https://assets.us-east-2.danestreet.com/assets/megaphone-289437a2616136dacdb75d47cdbecd3523c74c15d2be5ad7e4027ba2d38968ba.png"]')
        let isRush = rushIndicator === "!!!" ? "X" : "";
        // let dueDate = getTimeSubOneHr(row.querySelector('td:nth-child(2)').lastChild?.textContent.trim());
        let teamAssignment = getTeam(row.querySelector('td:nth-child(3)').firstChild?.textContent.trim());
        let client = row.querySelector('td:nth-child(4)')?.textContent.trim();
        // let claimantName = row.querySelector('td:nth-child(5)').firstChild.textContent.trim();
        // let claimantNumber = row.querySelector('td:nth-child(5)').lastChild.textContent.trim();
        let stateJurisdiction = row.querySelector('td:nth-child(7)')?.textContent.trim();
        let timeReceived = getTimeSubHr(row.querySelector('td:nth-child(8)').lastChild?.textContent.trim(), -1);
        let timeDue = getTimeSubHr(row.querySelector('td:nth-child(8)').lastChild?.textContent.trim(), rushIndicator === "!!!" ? 1 : 3)
        let initialPageCount = row.querySelector('td:nth-child(9)')?.textContent.trim();

        rowData = formattedDate + '\t' + referralNumber + "\t" + isRush + '\t' + timeReceived + '\t' + timeReceived + '\t' + timeDue + '\t\t\t\t' + teamAssignment + '\t' + stateJurisdiction + '\t' + initialPageCount + '\t\t' + client + "\n";
        return rowData;
    }

    function getTeam(teamString) {
        switch (teamString) {
            case 'PAS Division 1':
                return 'PAS Div 1';
            case 'PAS Division 2':
                return 'PAS Div 2';
            case 'PAS Division 3':
                return 'PAS Div 3';
            case 'PAS Division 4':
                return 'PAS Div 4';
            case 'Group Health Division 1':
                return 'DIV1';
            case 'Group Health Division 2':
                return 'DIV2';
            case 'Group Health Division 3':
                return 'DIV3';
            default:
                return teamString;
        }
    }

        function getTimeSubHr(DateTimeString, hoursToAdd) {
            let [, hours, minutes, ampm] = DateTimeString.match(/(\d+):(\d+)(AM|PM)/) || [];
            hours = parseInt(hours);
            if (ampm === 'PM' && hours !== 12) {
                hours += 12;
            } else if (ampm === 'AM' && hours === 12) {
                hours = 0;
            }
            // Add the hours
            hours = (((hours + hoursToAdd) % 24) + 24) % 24;

            // Handle the wrap-around past midnight
            ampm = 'AM';
            if (hours >= 12) {
                ampm = "PM";
            }
            if (hours >= 12) {
                ampm = 'PM';
                if (hours > 12) {
                    hours -= 12;
                }
            } else if (hours === 0) {
                hours = 12;
            }
            // Format the new time
            let newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${ampm}`;
            return newTime;
        }

        // Function to create and insert the button
        function addButton() {
            // Create the button
            const button = document.createElement('button');
            button.id = 'copyButton';
            button.textContent = 'Copy List to Clipboard';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.zIndex = '1000';
            button.style.padding = '10px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.cursor = 'pointer';

            // Append the button to the body
            document.body.appendChild(button);

            // Add click event listener to the button
            button.addEventListener('click', copyListToClipboard);
        }

        // Function to copy list data to clipboard
        function copyListToClipboard() {
            // Get the list items (adjust the selector as needed)
            const listItems = document.querySelectorAll('div.needs-case-preparation table tbody tr, div.needs-clinical-preparation table tbody tr');

            if (listItems.length === 0) {
                alert('No list items found!');
                return;
            }

            // Extract text content from list items and join them with new lines
            let listText = '';
            listItems.forEach(item => {
                let rowData = getRowData(item);
                listText += rowData;
            });

            // Copy the text to the clipboard
            copyToClipboard(listText);
        }

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text).then(() => {
                    // Show the immediate notification
                    notification.style.opacity = 1;
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.opacity = 0;
                    }, 1000); // Notification fades out after 1 seconds
                });
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }

        // Run the function to add the button after the page has loaded
        window.addEventListener('load', addButton);
    }) ();
