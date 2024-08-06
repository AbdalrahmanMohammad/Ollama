// website/app.js

document.getElementById('showcart').addEventListener('click', () => {
    getData(`/print`)
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});


document.getElementById('sendData').addEventListener('click', () => {
    const idd = document.getElementById('cart').value;
    postData('/cart', { productId: +idd })
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
        });
});

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

document.getElementById('getData').addEventListener('click', () => {
    const productId = document.getElementById('productId').value;
    getData(`/product?id=${productId}`)
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

const getData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        }
    });
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
}
