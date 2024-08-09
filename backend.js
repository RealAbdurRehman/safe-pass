export function generatePassword(length, numbers = false, upperAndLower = false, symbols = false, upper = false, lower = false) {

    let numbersArr = generateNumbers();
    let upperStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let lowerStr = "abcdefghijklmnopqrstuvwxyz"
    let charactersStr = `${upperStr}${lower}`;
    let symbolsStr = '!@#$%^&*()_+[]{}|;:,.<>?/`~-=\\\'\"';
    let randomPasswordSet = new Set();
    let randomPassword = ""

    for (let i = 0; i < length; i++) {

        let randomUpper = generateConfig(upper, upperStr);
        let randomLower = generateConfig(lower, lowerStr);
        let randomNum = generateConfig(numbers, numbersArr);
        let randomChar = generateConfig(upperAndLower, charactersStr);
        let randomSymbol = generateConfig(symbols, symbolsStr);

        if (!randomNum && !randomChar && !randomSymbol && !randomUpper && !randomLower) {
            console.error("Insufficent parameters!");
zz
            return;
        }

        for (let i = 0; i <= length; i++) {

            randomPasswordSet.add(`${randomNum}${randomChar}${randomUpper}${randomSymbol}${randomLower}`);
        }

    }

    for (let pair of randomPasswordSet) {

        randomPassword += pair;
    }
    
    return generateRandomConfig(randomPassword, length);
}


function generateNumbers() {

    let numbersArr = [];
    for (let i = 0; i < 10; i++) {
        numbersArr.push(i);
    }
    
    return numbersArr;
}

function generateConfig(bool, inputArr) {

    return bool ? inputArr[(Math.floor(Math.random() * inputArr.length))] : "";
}

function generateRandomConfig(password, limit) {

    let randomPassword = "";
    for (let i = 0; i < password.length; i++) {
        randomPassword += `${password[Math.floor(Math.random() * password.length)]}`;
    }

    return randomPassword.slice(0, limit);
}
