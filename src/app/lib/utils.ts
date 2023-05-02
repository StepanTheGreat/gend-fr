export function randomChoice(array: any[]): any { 
    const randomIndex = Math.round(Math.random()*(array.length-1));
    return array[randomIndex];
}