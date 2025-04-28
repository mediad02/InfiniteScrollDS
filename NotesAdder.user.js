// ==UserScript==
// @name         NotesAdder
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  try to take over the world!
// @author       You
// @match        https://danestreet.com/referrals/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danestreet.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Dictionary of words/phrases and corresponding notes
    const dictionary = {
        'Diclofenac': '📌 NOTE: Diclofenac 3% needs to be complemented with NIH 📌',
        'clinical summary': '📌 NOTE: A detailed clinical summary is required 📌',
        'physical therapy': '📌 NOTE: A therapy GL is required 📌',
        'Lidothol': '📌 NOTE: A topical is required 📌',
        // Add more words/phrases and notes as needed
    };



    // Function to add notes based on the dictionary
    function addNotes() {
        let questions = document.querySelectorAll('#body table.form tbody tr:nth-child(3) td.sixty fieldset.questions-info .prompt + td');
        questions.forEach(question => {
            for (let word in dictionary) {
                if (question.innerText.toLowerCase().includes(word.toLowerCase())) {
                    let note = document.createElement('div');
                    note.style.color = 'red';
                    note.innerText = dictionary[word];
                    question.appendChild(note);
                }
            }
        });
    }

    function populateCaseInfo(){
        let claimantNameElement = document.querySelector('fieldset.claimant-info tr:nth-child(1) td:nth-child(2)');
        let dateOfBirthElement = document.querySelector('fieldset.claimant-info tr:nth-child(5) td:nth-child(2)');
        let dateOfInjuryElement = document.querySelector('fieldset.claim-info tr:nth-child(2) td:nth-child(2)');
        let jurisdictionStateElement = document.querySelector('fieldset.claim-info tr:nth-child(5) td:nth-child(2)');

        caseInfo.claimantName = claimantNameElement.innerText;
        caseInfo.dateOfBirth = dateOfBirthElement.innerText;
        caseInfo.dateOfInjury = dateOfInjuryElement.innerText;
        caseInfo.jurisdictionState = jurisdictionStateElement.innerText;

        console.log(caseInfo);
    }


    // Starting point

    var caseInfo = {};
    populateCaseInfo();


    addNotes();

})();