const {createAvatar}=require('@dicebear/core');const {avataaars}=require('@dicebear/collection');const fs=require('fs');
const base={skinColor:['614335'],hairColor:['2c1b18'],facialHairColor:['2c1b18'],accessoriesProbability:0,facialHairProbability:0,backgroundColor:['transparent'],style:['default']};
const CH={
 papa:{top:['shortFlat'],facialHair:['beardMedium'],facialHairProbability:100,clothing:['collarAndSweater'],clothesColor:['0e8a5f']},
 maman:{top:['froBand'],clothing:['shirtScoopNeck'],clothesColor:['8e1f3a'],hatColor:['ffc72c']},
 maman2:{top:['turban'],clothing:['shirtScoopNeck'],clothesColor:['8e1f3a'],hatColor:['ffc72c']},
 maman3:{top:['bun'],clothing:['shirtScoopNeck'],clothesColor:['8e1f3a']},
 kid:{top:['shortRound'],clothing:['shirtCrewNeck'],clothesColor:['2f6fe0']},
 frere:{top:['fro'],clothing:['hoodie'],clothesColor:['d7263d']},
 prof:{top:['curvy'],clothing:['blazerAndShirt'],clothesColor:['f2b53a'],accessories:['round'],accessoriesProbability:100},
 prof2:{top:['dreads01'],clothing:['blazerAndShirt'],clothesColor:['f2b53a'],accessories:['prescription02'],accessoriesProbability:100},
};
const EX={neutre:['default','defaultNatural','default'],sourire:['happy','defaultNatural','smile'],perdu:['squint','sadConcernedNatural','concerned'],panique:['surprised','raisedExcitedNatural','grimace'],gene:['side','upDownNatural','twinkle'],joie:['happy','raisedExcitedNatural','smile'],reflechit:['eyeRoll','upDownNatural','serious'],oh:['surprised','raisedExcitedNatural','disbelief'],fier:['wink','raisedExcitedNatural','smile'],clin:['closed','defaultNatural','smile']};
for(const [n,c] of Object.entries(CH))for(const [e,[eyes,eyebrows,mouth]] of Object.entries(EX)){
 const svg=createAvatar(avataaars,{...base,...c,eyes:[eyes],eyebrows:[eyebrows],mouth:[mouth],seed:n}).toString();fs.writeFileSync(`av/${n}_${e}.svg`,svg)}
console.log(fs.readdirSync('av').length);
