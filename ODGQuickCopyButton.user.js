// ==UserScript==
// @name         ODGQuick Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Adolfo Medina
// @match        https://www.odgbymcg.com/treatment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odgbymcg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const elements = document.querySelectorAll('h2.tab-header');

    elements.forEach(element => {
        const button = document.createElement('button');
        button.textContent = 'Copy Guideline';

        button.addEventListener('click', () => {
            let bodyElement = element.nextElementSibling;
            let title = element.firstChild?.textContent.trim();
            let effectiveDate = bodyElement.querySelector('div.modified-date')?.textContent.trim();
            let treatmentType = bodyElement.querySelector('div.col-md-12:nth-child(3)')?.textContent.trim();
            let recommendationTitle = bodyElement.querySelector('div.recommendation-section.col-sm-12.col-md-12.col-lg-12 h3.page-subheader')?.textContent.trim();
            let recommendationTitleBody = bodyElement.querySelector('div.recommendation-section.col-sm-12.col-md-12.col-lg-12 div.evidencethtml')?.textContent.trim();
            let recommendationBody = bodyElement.querySelectorAll('div.col-sm-12.col-md-12.col-lg-12');

            let guideline = title + '\n' + effectiveDate + '\n' + treatmentType + '\n' + recommendation + '\n' + recommendationBody;


            console.log(recommendationTitleBody);
            

            navigator.clipboard.writeText(guideline)
                .then(() => {
                    alert('Text copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });

        element.appendChild(button);
    })
})();