
const ENDINGS = [
    [
        "age", "an", "c", "d", "eme", "g", "i", "in", "is", "iste",
        "k", "l", "lon", "m", "non", "o", "ome", "r", "ron", "sme", 
        "t", "taire", "ton", "tre", "u", "us"
    ],
    [
        "ade", "aison", "ce", "ee", "ie", "iere", "ine", "ion", "ite",
        "lle", "se", "tte", "ude", "ure"
    ]
]

export function sliceWord(word: string, gender: number): [string, string] {
    if (gender != 0 && gender != 1) {
        return [word, ""];
    }
    let endingCollection = ENDINGS[gender];
    let result: [string, string] = [word, ""];
    endingCollection.forEach(suff => {
        if (word.endsWith(suff)) {
            result = [
                word.substring(0, word.length - suff.length),
                suff
            ]
        }
    });
    return result;
}

export function grammarError(word: string, suffix: string, gender: number): string {
    let genders = ["masculine", "feminine", "neutral"];
    let txt = `The word \"${word}\" is ${genders[gender]}. `;
    if (suffix) {
        txt += `Pay closer attention to the suffix \"${suffix}\"`;
    } else {
        txt += `This is an exception.`;
    }   
    return txt;
}