import { Injectable } from '@angular/core';

const ENDINGS = [
  [
      "age", "an", "c", "d", "eme", "g", "i", "in", "is", "iste",
      "k", "l", "lon", "m", "non", "o", "ome", "r", "ron", "sme", 
      "t", "taire", "ton", "tre", "u", "us"
  ],
  [
      "ade", "aison", "ce", "ee", "ie", "iere", "ine", "ion", "ite",
      "lle", "se", "tte", "ude", "ure"
  ],
  [
    "x", "aux", "ails", "ous"
  ]
]

const wordsArray = [
  [
    "homme", "jour", "temps", "soir", "pays", "travail", "enfant", "monde", "ami", "matin", "père", "frère", "fils", "chef", "mois", "état", "livre", "médecin", 
    "professeur", "numéro", "week-end", "téléphone", "train", "bus", "avion", "homme d'affaires", "ordinateur", "jeu", "vin", "bus"
  ],
  [
    "femme", "vie", "nuit", "maison", "ville", "histoire", "mère", "terre", "mer", "voix", "fleur", "voiture", "chaise", "école", "porte", "fenêtre", "table", 
    "lettre", "clé", "pomme", "orange", "banane", "fraise", "thé", "café", "bière", "musique", "danse", "photo"
  ],
  [
    "gens", "yeux", "mains", "pieds", "vacances", "étoiles", "vêtements", "cheveux", "amis", "parents", "enfants", "livres", "chambres", "maisons", "villes", 
    "voitures", "ordinateurs", "trains", "avions", "bus", "vélos", "fruits", "légumes", "animaux", "oiseaux", "poissons", "émissions", "films", "journaux"
  ]
]

const WORDS: {[gender: number]: string[]} = {
  0: wordsArray[0],
  1: wordsArray[1],
  2: wordsArray[2],
};

@Injectable({
  providedIn: 'root'
})
export class GrammarService {

  constructor() { }

  sliceWord(word: string, gender: number): [string, string] {
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

  grammarError(word: string, suffix: string, gender: number): string {
    let genders = ["masculine", "feminine", "plural"];
    let txt = `The word \"${word+suffix}\" is ${genders[gender]}. `;
    if (suffix) {
        txt += `Pay closer attention to the suffix \"${suffix}\"`;
    } else if (gender != 2){
        txt += `This is an exception.`;
    }   
    return txt;
  }

  generateWord(): [string, number] {
    let gend: number = Math.round(Math.random()*2);
    let words = WORDS[gend];
    let randIndex = Math.round(Math.random()*(words.length-1))
    return [words[randIndex], gend];
  }
}
