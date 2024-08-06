let result=document.querySelector(".result");
let btn=document.querySelector("button");
let txt=document.querySelector("textarea");


const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

btn.addEventListener('click', () => {
    const userInput = txt.value;
    result.innerHTML="loading...";
    result.classList.add("hide-pseudo");
    postData('/similarity', { inputText: userInput })
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
            result.innerHTML=data.additionalData;

        });
});