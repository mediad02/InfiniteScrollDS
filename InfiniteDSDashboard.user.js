// ==UserScript==
// @name         Infinite DS Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Enhances DaneStreet Dashboard with automation and clipboard features.
// @author       Adolfo Medina
// @match        https://danestreet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/InfiniteDSDashboard.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/InfiniteDSDashboard.user.js
// ==/UserScript==

(function () {
    'use strict';

    const strategies = {
        dashboard: () => {
            console.log('Dashboard strategy running...');
            loadAllPages();
        },
        case: () => {
            console.log('Case strategy running...');
            // logic here
        }
    };

    function loadAllPages() {

        function addCopyButtons() {
            const rows = document.querySelectorAll('div.needs-case-preparation table tbody tr, div.needs-clinical-preparation table tbody tr');
            rows.forEach(row => {
                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy Row';
                copyButton.addEventListener('click', () => {
                    copyRowData(row, copyButton);
                });
                row.appendChild(copyButton);
            });
        }

        function copyRowData(row, button) {

            button.textContent = 'Loading...';
            button.style.backgroundColor = 'orange';

            // Extract text content from the row and join them with new lines
            let rowData = getRowData(row);

            // Load data from within referral number
            LoadDataFromLink(row, rowData.isRush).then((additionalData) => {
                rowData = { ...rowData, ...additionalData };

                // Copy the text to the clipboard
                copyToClipboard(rowData.formattedDate + '\t' + rowData.referralNumber + "\t" + rowData.isRush + '\t' + rowData.formattedTime + '\t' + rowData.timeReceived + '\t' + rowData.timeDue + '\t\t\t\t\t' + rowData.teamAssignment + '\t' + rowData.stateJurisdiction + '\t' + rowData.initialPageCount + '\t\t' + rowData.client);

                button.textContent = 'Copied!';
                button.style.backgroundColor = 'green';
                button.disabled = true;
            }).catch((error) => {
                console.error('Error loading data from link:', error);
            });
        }

        addCopyButtons();
    }

    function LoadDataFromLink(row, isRush) {
        return new Promise((resolve, reject) => {
            let referralNumber = row.querySelector('td:nth-child(2) a')?.textContent.trim();
            let url = 'https://danestreet.com/referrals/' + referralNumber;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    if (response.status !== 200) {
                        reject('Error fetching next page:' + response.statusText);
                        return;
                    }
                    try {
                        let newDoc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        let dateExpedited = newDoc.querySelector('body table.index tbody tr[data-org-name="Oristech"] td:nth-child(3)')?.textContent.trim();
                        
                        if (dateExpedited) {
                            let [datePart, timePart] = dateExpedited.split(' at ');

                            // Parse datePart
                            let datePartDate = new Date(datePart);

                            let month = datePartDate.getMonth()+1;
                            let day = datePartDate.getDate();
                            let year = datePartDate.getFullYear();

                            // Parse timePart
                            let [time, period] = [timePart.slice(0, -6), timePart.slice(-6, -4)];
                            let [hours, minutes] = time.split(':');
                            hours = parseInt(hours);
                            minutes = parseInt(minutes);
                            if (period === 'PM' && hours !== 12) hours += 12;
                            if (period === 'AM' && hours === 12) hours = 0;
                            
                            // Construct the Date object
                            let date = new Date(year, month - 1, day, hours, minutes);
                            date.setHours(date.getHours() - 1); // Subtract 1 hour
                            
                            let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                            let formattedTime = (date.getHours() % 12 || 12) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM');
                            
                            let timeDue = new Date(date);
                            switch (isRush) {
                                case 'XX':
                                    timeDue.setHours(timeDue.getHours() + 1);
                                    break;
                                case 'X':
                                    timeDue.setHours(timeDue.getHours() + 2);
                                    break;
                                default:
                                    timeDue.setHours(timeDue.getHours() + 4);
                                    break;
                            }
                            timeDue = timeDue.toLocaleTimeString();

                            resolve({formattedDate, formattedTime, timeDue});
                        } else {
                            resolve({});
                        }
                    } catch (e) {
                        reject('Error parsing response:' + e);
                    }
                },
                onerror: function (error) {
                    reject('Error fetching next page:' + error);
                }
            });
        });
    }

    function getRowData(row) {
        let today = new Date();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let year = today.getFullYear();

        let formattedDate = month + '/' + day + '/' + year;
        let referralNumber = row.querySelector('td:nth-child(2) a')?.textContent.trim();
        let isRush = checkRush(row);
        let teamAssignment = getTeam(row.querySelector('td:nth-child(3)').firstChild?.textContent.trim());
        let client = row.querySelector('td:nth-child(4)')?.textContent.trim();
        // let claimantName = row.querySelector('td:nth-child(5)').firstChild.textContent.trim();
        // let claimantNumber = row.querySelector('td:nth-child(5)').lastChild.textContent.trim();
        let stateJurisdiction = row.querySelector('td:nth-child(7)')?.textContent.trim();
        let timeReceived = getTimeSubHr(row.querySelector('td:nth-child(8)').lastChild?.textContent.trim(), -1);
        let timeDue = getTimeSubHr(row.querySelector('td:nth-child(8)').lastChild?.textContent.trim(), isRush === "X" ? 1 : 3);
        
        let initialPageCount = row.querySelector('td:nth-child(9)')?.textContent.trim();

        return {
            formattedDate,
            referralNumber,
            isRush,
            timeReceived,
            timeDue,
            teamAssignment,
            stateJurisdiction,
            initialPageCount,
            client
        };
    }

    function checkRush(row) {
        var today = new Date();
        var isFriday = today.getDay() === 5;
        var todayDate = today.getDate();

        let isRush = '';
        let rushIndicator = row.querySelector('td:nth-child(2) span[style]')?.textContent.trim();
        let hasCaseNotification = row.querySelector('td:nth-child(2) img[src*="megaphone"]')
        let stateJurisdiction = row.querySelector('td:nth-child(7)')?.textContent.trim();
        let client = row.querySelector('td:nth-child(4)')?.textContent.trim();
        let dueDate = parseDateTime(row.querySelector('td:nth-child(2)').lastChild?.textContent.trim() ?? "");
        let teamAssignment = getTeam(row.querySelector('td:nth-child(3)').firstChild?.textContent.trim());

        // let timeReceived = parseDateTime(row.querySelector('td:nth-child(8)').lastChild?.textContent.trim());

        // if (!dueDateStr || !timeReceivedStr) {
        //     throw new Error('Missing dueDate or timeReceived information');
        // }

        // const isLessThan24HoursBool = isLessThan24Hours(dueDateStr, timeReceivedStr);

        if (client === 'AMER' && stateJurisdiction === "CA") {
            isRush = 'XX';
        } else if (client === 'CORV' && stateJurisdiction === 'NY') {
            isRush = 'XX';
        } else if (rushIndicator === '!!!' || hasCaseNotification) {
            isRush = 'X';
        }
        
        return isRush;
    }

    function isLessThan24Hours(parsedDateTime1, parsedDateTime2) {

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = Math.abs(parsedDateTime2 - parsedDateTime1);

        // Convert milliseconds to hours
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        // Check if the difference is less than 24 hours
        return differenceInHours <= 24;
    }

    function parseDateTime(dateTimeStr) {
        if (dateTimeStr === "") {
            return;
        }

        // Remove the "EDT" part if it exists
        const cleanedDateTimeStr = dateTimeStr.replace(' EDT', '');

        // Define month mapping
        const months = {
            'Jan': '01',
            'Feb': '02',
            'Mar': '03',
            'Apr': '04',
            'May': '05',
            'Jun': '06',
            'Jul': '07',
            'Aug': '08',
            'Sep': '09',
            'Oct': '10',
            'Nov': '11',
            'Dec': '12'
        };

        // Split the date and time
        const [dateStr, timeStr] = cleanedDateTimeStr.split(' ');

        // Extract time components
        const [time, period] = [timeStr.slice(0, -2), timeStr.slice(-2)];
        let [hour, minute] = time.split(':');
        hour = parseInt(hour, 10);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        // Split the date components
        const dateParts = dateStr.split('-');

        let year, month, monthAbbr, day;

        if (dateParts.length === 3) {
            // Format is "27-Jun-2024"
            [day, monthAbbr, year] = dateParts;
        } else {
            // Format is "21-Aug"
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
            [day, monthAbbr] = dateParts;
            month = months[monthAbbr];
            // Determine the year
            year = currentYear;
            if (parseInt(month) < currentMonth) {
                year += 1;
            }
        }

        // Map the month abbreviation to a number
        month = months[monthAbbr];

        // Construct the final date string in ISO format
        const isoDateTime = `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${minute}:00`;

        // Parse the date string
        return new Date(isoDateTime);
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

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    loadAllPages();

})();
