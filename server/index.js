const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const token = '80ddad90-954d-4440-b54c-8f3a8a403cb2';

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/findProduct/:productName', async (req, res) => {
    const config = {
        headers: { 'Authorization': `Bearer ${token}`}
    }
    
    try{
        let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + req.params.productName, config).then((res) => {
            return res.data;
        })
        res.send(apiResponse);
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
