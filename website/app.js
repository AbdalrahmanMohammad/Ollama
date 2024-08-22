let result = document.querySelector(".result");
let btn = document.querySelector("button");
let txt = document.querySelector("textarea");


const fetchStreamingData = async ( document) => {
    try {
        const response = await fetch('/similarity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from /similarity');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        
        let accumulatedData = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedData += chunk;

            console.log(JSON.parse(chunk).response);

            result.innerHTML += JSON.parse(chunk).response;
            scrollToBottom(); 

        }

        console.log('Final data:', accumulatedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

///////////////////
const scrollToBottom = () => {
    result.scrollTop = result.scrollHeight;
};

//////////////////////////////////////////////////////////////////////

btn.addEventListener('click', () => {
    const userInput = txt.value;
    result.innerHTML = "";
    result.style.backgroundColor = "rgb(153, 147, 147)";
    result.style.opacity = "100%";


    result.classList.add("hide-pseudo");
    fetchStreamingData(userInput )
        .then(() => {
            result.style.opacity = "80%";
        });
});

