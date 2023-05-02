import { DictType, WordData } from "./types";

export function randomChoice(array: any[]): any { 
    const randomIndex = Math.round(Math.random()*(array.length-1));
    return array[randomIndex];
}

export function weightedRandomWord(words: string[], dictionary: DictType): string {
    let totalWeight: number = 0;
    let cumWeights: number[] = [];
    
    words.forEach((word: string) => {
        totalWeight += dictionary[word].frequency;
        cumWeights.push(totalWeight);
    });
    
    const randomFactor = Math.random() * totalWeight;
    
    for (let i = 0; i < cumWeights.length; i++) {
        if (cumWeights[i] > randomFactor) {
          return words[i];
        }
    }
    return words[0];
}