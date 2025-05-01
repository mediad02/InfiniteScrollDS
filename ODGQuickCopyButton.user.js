// ==UserScript==
// @name         ODGQuick Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  try to take over the world!
// @author       Adolfo Medina
// @match        https://www.odgbymcg.com/treatment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odgbymcg.com
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ODGQuickCopyButton.user.js
// @downloadURL  https://raw.githubusercontent.com/mediad02/InfiniteScrollDS/main/ODGQuickCopyButton.user.js
// ==/UserScript==

(function () {
    'use strict';

    function addButtons() {
        document.querySelectorAll('h2.tab-header')
            .forEach(treatmentHeader => {
                let button = createCopyButton();

                treatmentHeader.parentElement.prepend(button);
            });
    }

    function createCopyButton() {
        let button = document.createElement('button');

        button.textContent = "Copy";
        button.className = 'copy-guideline-btn btn btn-primary';
        button.style.marginLeft = '10px';
        button.style.textAlign = 'left';

        button.addEventListener('click', (event) => {
            let guidelineElement = event.target.parentElement;
            copyHTMLToClipboard(guidelineElement);
        });

        return button;
    }

    async function copyHTMLToClipboard(element) {
        let cloneElement = element.cloneNode(true);

        let modifiedDate = cloneElement.querySelector('div.modified-date').cloneNode(true).textContent;
        let treatmentTypeNode = Array.from(cloneElement.querySelectorAll('article div.row div.col-md-11 div.col-md-12'))
            .find(div => div.textContent.includes('Treatment type:'));
        let treatmentType = treatmentTypeNode?.textContent ?? '';

        let bodySystemNode = Array.from(cloneElement.querySelectorAll('article div.row div.col-md-11 div.col-md-12'))
            .find(div => div.textContent.includes('Body system:'));
        let bodySystem = bodySystemNode?.textContent ?? '';

        let relatedTopicsNode = Array.from(cloneElement.querySelectorAll('article div.row div.col-md-11 div.col-md-12'))
            .find(div => div.textContent.includes('Related Topics:'));
        let relatedTopics = relatedTopicsNode?.innerText ?? '';
        relatedTopics = relatedTopics.replace(/\n/, " ");
        console.log(relatedTopics);

        let header = cloneElement.querySelector('h2.tab-header').cloneNode(true).textContent;

        cloneElement.querySelector('article div.row div.col-md-11 div.recommendation-section h3.page-subheader').firstChild.data += " - "

        cloneElement.querySelector('.copy-guideline-btn').remove();
        cloneElement.querySelector('h2.tab-header').remove();
        cloneElement.querySelector('div.proc-code-section').remove();
        cloneElement.querySelectorAll('article div.row div.col-md-11 div.col-md-12').forEach(div => {
            if (!cloneElement.querySelector('article div.row div.col-md-11 div.recommendation-section h3.page-subheader').textContent.includes('See Reference')) {
                if (div.innerHTML.includes('<p>Citations</p>') || div.textContent.includes('Body system:') || div.textContent.includes('Related Topics:') || div.textContent.includes('Treatment type:')) {
                    div.remove();
                }
            }
            if (div.textContent.includes('Body system:')) {
                div.remove();
            }
        });
        cloneElement.querySelector('article div.row div.col-md-11 br').remove();
        cloneElement.querySelector('div.modified-date').remove();

        let guideline = cloneElement.outerHTML;
        let guidelineText = cloneElement.outerText;

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob(
                        ['<b><div>ODG by MCG</div>', modifiedDate, '<div>', header, '</div></b>', treatmentType, guideline],
                        { type: 'text/html' }
                    ),
                    'text/plain': new Blob(
                        ['ODG by MCG\n', modifiedDate + "\n", header, treatmentType, guidelineText],
                        { type: 'text/plain' }
                    )
                })
            ]);
            console.log('HTML copied to clipboard successfully');
        } catch (err) {
            console.error('Failed to copy HTML to clipboard:', err);
        }
    }

    window.addEventListener('load', addButtons);
})();