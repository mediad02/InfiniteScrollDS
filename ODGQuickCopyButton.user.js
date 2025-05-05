// ==UserScript==
// @name         ODGQuick Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  try to take over the world!
// @author       Adolfo Medina
// @match        https://www.odgbymcg.com/treatment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odgbymcg.com
// @tag          productivity
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ODGQuickCopyButton.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ODGQuickCopyButton.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to add buttons to each treatment header
    function addButtons() {
        document.querySelectorAll('h2.tab-header')
            .forEach(treatmentHeader => {
                let button = createCopyButton();

                treatmentHeader.parentElement.prepend(button);
            });
    }

    // Function to create the copy button
    function createCopyButton() {
        let button = document.createElement('button');

        button.textContent = "Copy";
        button.className = 'copy-guideline-btn btn btn-primary';
        button.style.marginTop = '10px';

        button.addEventListener('click', async (event) => {
            let guidelineElement = event.target.parentElement;

            await copyHTMLToClipboard(guidelineElement);

            button.textContent = "Copied!";
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');

            setTimeout(() => {
                button.textContent = "Copy";
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }, 2000);
        });

        return button;
    }

    function findElementByText(container, selector, text) {
        return Array.from(container.querySelectorAll(selector))
            .find(element => element.textContent.includes(text));
    }

    // Parses the HTML to extract the relevant information
    function parseGuidelineInfo(guidelineElement) {

        let modifiedDate = guidelineElement.querySelector('div.modified-date')?.textContent.trim() ?? '';
        let header = guidelineElement.querySelector('h2.tab-header')?.textContent.trim() ?? '';

        let treatmentTypeLabel = findElementByText(guidelineElement, '.treatment-list-label', 'Treatment type:');
        let treatmentType = treatmentTypeLabel ? treatmentTypeLabel.parentElement.textContent.trim() : '';

        let bodySystemLabel = findElementByText(guidelineElement, '.treatment-list-label', 'Body system:');
        let bodySystem = bodySystemLabel ? bodySystemLabel.parentElement.textContent.trim() : '';

        let relatedTopicsLabel = findElementByText(guidelineElement, '.treatment-list-label', 'Related Topics:');
        let relatedTopics = '';
        if (relatedTopicsLabel) {
            let relatedTopicsItems = Array.from(relatedTopicsLabel.nextSibling.querySelectorAll('a.related-topic'))
                .map(element => element.textContent.trim());
            relatedTopics = relatedTopicsLabel.textContent.trim() + ' ' + relatedTopicsItems.join(',<br>').trim();
        }

        return { modifiedDate, treatmentType, bodySystem, relatedTopics, header };
    }

    // Function to copy HTML to clipboard
    async function copyHTMLToClipboard(element) {
        let cloneElement = element.cloneNode(true);

        let { modifiedDate, treatmentType, bodySystem, relatedTopics, header } = parseGuidelineInfo(cloneElement);

        // Modify element format
        cloneElement.querySelector('article div.row div.col-md-11 div.recommendation-section h3.page-subheader').firstChild.data += " - "

        // Remove unnecessary elements
        const selectorsToRemove = [
            '.copy-guideline-btn',
            'h2.tab-header',
            'div.proc-code-section',
            'div.modified-date'
        ];

        cloneElement.querySelector('div.recommendation-section').previousElementSibling.remove();

        selectorsToRemove.forEach(selector => {
            const element = cloneElement.querySelector(selector);
            if (element) element.remove();
        });

        cloneElement.querySelectorAll('article div.row div.col-md-11 div.col-md-12').forEach(div => {
            const subheaderText = cloneElement.querySelector('article div.row div.col-md-11 div.recommendation-section h3.page-subheader')?.textContent || '';

            if (!subheaderText.includes('See Reference') &&
                (div.innerHTML.includes('<p>Citations</p>') ||
                    div.textContent.includes('Body system:') ||
                    div.textContent.includes('Related Topics:') ||
                    div.textContent.includes('Treatment type:'))) {
                div.remove();
            }
            if (div.textContent.includes('Body system:') ||
                div.textContent.includes('Related Topics:')) {
                div.remove();
            }
        });

        // gets HTML blob and text blob
        let guideline = cloneElement.outerHTML;

        // conditional Blob creation
        let htmlBlob;
        if (cloneElement.querySelector('div.recommendation-section h3.page-subheader').textContent.includes('See Reference')) {
            htmlBlob = `<b><div>ODG by MCG</div>${modifiedDate}<div>${header}</div></b>${treatmentType}${relatedTopics}${guideline}`;

        } else {
            htmlBlob = `<b><div>ODG by MCG</div>${modifiedDate}<div>${header}</div></b>${treatmentType}${guideline}`;
        }

        // add blob to the clipboard
        try {
            await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([htmlBlob], { type: 'text/html' }) })]);
            console.log('HTML copied to clipboard successfully');
        } catch (err) {
            console.error('Failed to copy HTML to clipboard:', err);
        }
    }

    // Wait for the page to load before adding buttons
    window.addEventListener('load', addButtons);
})();