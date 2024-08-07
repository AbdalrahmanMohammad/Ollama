

let result = document.querySelector(".result");

const fetchStreamingData = async (document) => {
    try {
        const response = await fetch('http://localhost:1060/fetch-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from /fetch-data');
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

            result.innerHTML+=JSON.parse(chunk).response;

        }

        console.log('Final data:', accumulatedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Example usage
fetchStreamingData('tell me a dad joke');