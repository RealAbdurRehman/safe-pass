import { generatePassword } from "./backend.js";

const sliderInput = document.getElementById("slider");
const textInput = document.getElementById("pass-lngth-txt");
const lengthDisplay = document.getElementById("display-length");
const decrementBtn = document.getElementById("decrement-slider-btn");
const incrementBtn = document.getElementById("increment-slider-btn");
const passwordDisplay = document.getElementById("pass-display");
let randomPassword;
const strengthImg = document.getElementById("password-strngth-img");
const passStrength = document.getElementById("pass-strength");
const reloadBtn = document.getElementById("reload-btn");
const copyBtn = document.getElementById("copy-btn");
const history = document.querySelector(".prev-pass-container");
let prevPasswords = [];
const prevPasswordsParsed = JSON.parse(localStorage.getItem("passwords"));
const deleteAllBtn = document.getElementById("delete-all");
const allCharsCheckbox = document.getElementById("all-chars");
const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
let hasAllChars;
let hasUppercase;
let hasLowercase;
let hasNums;
let hasSymbols;

function passwordUpdater(passLength) {
    updateLengthDisplayItems();
    randomPassword = generatePassword(passLength, hasNums, hasAllChars, hasSymbols, hasUppercase, hasLowercase);
    updateDisplay(randomPassword);
    updateButtons(passLength);
    checkStrength();
}

function updateLengthDisplayItems() {
    lengthDisplay.textContent = sliderInput.value;
    textInput.placeholder = sliderInput.value;
    textInput.value = "";
    updateSliderBackground();
}

function updateSliderBackground() {
    const value = (sliderInput.value - sliderInput.min) / (sliderInput.max - sliderInput.min) * 100;
    sliderInput.style.setProperty('--value', value + '%');
}

function updateDisplay(password) {
    const maxLength = 14;
    if (!password) {
        passwordDisplay.textContent = "An Error Ocurred";
        return;
    }
    if (password.length > maxLength) {
        passwordDisplay.textContent = password.slice(0, maxLength) + "...";
    } else {
        passwordDisplay.textContent = password;
    }
}

function updateButtons(sliderValue) {
    incrementBtn.disabled = sliderValue >= 50;
    decrementBtn.disabled = sliderValue <= 1;
}

function checkStrength() {
    if (randomPassword.length <= 4) {
        passStrength.textContent = "Very Weak";
        passStrength.style.background = "#FF7800";
        strengthImg.src = "Public/veryweak.svg";
    } else if (randomPassword.length <= 7) {
        passStrength.textContent = "Weak";
        passStrength.style.background = "#FFB370";
        strengthImg.src = "Public/weak.svg";
    } else if (randomPassword.length <= 9) {
        passStrength.textContent = "Good";
        passStrength.style.background = "#FFDDBF";
        strengthImg.src = "Public/good.svg";
    } else if (randomPassword.length <= 11) {
        passStrength.textContent = "Strong";
        passStrength.style.background = "#D5F2A5";
        strengthImg.src = "Public/strong.svg";
    } else {
        passStrength.textContent = "Very Strong";
        passStrength.style.background = "#9AE437";
        strengthImg.src = "Public/verystrong.svg";
    }
}

function renderPrevPasswords(passwordsArray) {
    let passwords = "";
    for (let i = 0; i < prevPasswords.length; i++) {
        passwords += prevPasswords[i];
    }
    history.innerHTML = passwords;
}

function addToHistory(password) {
    prevPasswords.push(`<div class="prev-pass">${password}</div>`);
    localStorage.setItem("passwords", JSON.stringify(prevPasswords));
    renderPrevPasswords(prevPasswords);
}

sliderInput.addEventListener("input", function() {
    const value = Number(sliderInput.value);
    passwordUpdater(value);
})

incrementBtn.addEventListener("click", function() {
    sliderInput.value = Number(sliderInput.value) + 1;
    const value = sliderInput.value;
    passwordUpdater(value);
})

decrementBtn.addEventListener("click", function() {
    sliderInput.value = Number(sliderInput.value) - 1;
    const value = sliderInput.value;
    passwordUpdater(value);
})

textInput.addEventListener("input", function() {
    const value = Number(textInput.value);
    if (value < 51) {
        sliderInput.value = value;
        updateSliderBackground();
        lengthDisplay.textContent = sliderInput.value;
    } else {
        sliderInput.value = 50;
        updateSliderBackground();
        lengthDisplay.textContent = value;
    }
    randomPassword = generatePassword(value, hasNums, hasAllChars, hasSymbols, hasUppercase, hasLowercase);
    updateDisplay(randomPassword);
    checkStrength();
})

reloadBtn.addEventListener("click", function() {
    if (lengthDisplay.textContent < 51) {
        randomPassword = generatePassword(sliderInput.value, hasNums, hasAllChars, hasSymbols, hasUppercase, hasLowercase);
    } else if (lengthDisplay.textContent > 50) {
        randomPassword = generatePassword(textInput.value, hasNums, hasAllChars, hasSymbols, hasUppercase, hasLowercase);
    }
    updateDisplay(randomPassword);
    checkStrength();
})

copyBtn.addEventListener('click', function() {
    const copiedBox = document.querySelector(".copied-container");
    navigator.clipboard.writeText(randomPassword).then(function() {  
        copiedBox.style.display = "block";
        setTimeout(function() {
            copiedBox.style.display = "none";
        }, 1000)
    }).catch(function(err) {
        console.err("Error while copying text: ", err)
    })
    addToHistory(randomPassword);
})

deleteAllBtn.addEventListener("click", function() {
    localStorage.clear();
    prevPasswords = [];
    renderPrevPasswords(prevPasswords);
})

function checkboxChecker(checkbox) {
    if (checkbox.checked === true && checkbox.id === "all-chars") {
        hasAllChars = true;
    } else if (checkbox.checked === false && checkbox.id === "all-chars") {
        hasAllChars = false;
    } else if (checkbox.checked === true && checkbox.id === "uppercase") {
        hasUppercase = true;
    } else if (checkbox.checked === false && checkbox.id === "uppercase") {
        hasUppercase = false;
    } else if (checkbox.checked === true && checkbox.id === "lowercase") {
        hasLowercase = true;
    } else if (checkbox.checked === false && checkbox.id === "lowercase") {
        hasLowercase = false;
    } else if (checkbox.checked === true && checkbox.id === "numbers") {
        hasNums = true;
    } else if (checkbox.checked === false && checkbox.id === "numbers") {
        hasNums = false;
    } else if (checkbox.checked === true && checkbox.id === "symbols") {
        hasSymbols = true;
    } else if (checkbox.checked === false && checkbox.id === "symbols") {
        hasSymbols = false;
    }
    if (!hasAllChars && !hasUppercase && !hasLowercase && !hasNums && !hasSymbols) {
        allCharsCheckbox.checked = true;
        hasAllChars = true;
        allCharsCheckbox.style.cursor = "not-allowed";
    } else {
        allCharsCheckbox.style.cursor = "pointer";
    }
}

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("input", function() {
        checkboxChecker(checkbox)
    })
})

function init() {
    hasAllChars = true;
    hasUppercase = false;
    hasLowercase = false;
    hasNums = true;
    hasSymbols = false;

    checkboxes.forEach(function(checkbox) {
        checkboxChecker(checkbox);
    })

    lengthDisplay.textContent = sliderInput.value;
    updateSliderBackground();
    
    randomPassword = generatePassword(sliderInput.value, hasNums, hasAllChars, hasSymbols, hasUppercase, hasLowercase);
    updateDisplay(randomPassword);
    checkStrength();

    if (prevPasswordsParsed) {
        prevPasswords = prevPasswordsParsed;
        renderPrevPasswords(prevPasswords);
    }
}

init();