let result = document.querySelector(".result");
let btn = document.querySelector("button");

btn.addEventListener("click", () => {
    result.classList.add("hide-pseudo");
});


import { HfInference } from '@huggingface/inference'
const hf = new HfInference('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');

const output = await hf.featureExtraction({
    model: 'ggrn/e5-small-v2',
    inputs: 'That is a happy person'
});
console.log(output);