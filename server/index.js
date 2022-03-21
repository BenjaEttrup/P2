const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const token = '80ddad90-954d-4440-b54c-8f3a8a403cb2';
const fs = require('fs');

const stashjsonPath = "../stash/stash.json"

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

app.get("/stash/get", async (req, res) => {

  const stashProduct = {
    prod_id: 'product ID',
    name: 'name',
    price: 'price',
    img: 'img'
  }
  res.json(stashProduct);
});


function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}


app.get("/stash/add", async (req, res) => {
  
  const stashProduct = {
    prod_id: 'product ID',
    name: 'name',
    price: 'price',
    img: 'img'
  }

  fs.access(stashjsonPath, fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      console.log("File doesn't exist. Trying to create empty file")
      fs.writeFile(stashjsonPath, JSON.stringify(stashProduct), err => {
        if (err) console.log("Error writing file:", err);
        return
      });
      return
    }

    //file exists
    jsonReader(stashjsonPath, (err, customer) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }
      // increase customer order count by 1
      customer.order_count += 1;
      fs.writeFile(stashjsonPath, JSON.stringify(customer), err => {
        if (err) console.log("Error writing file:", err);
      })
    }) 
  })
})



app.get("/stash/remove")

app.get("/stash/search/:productName", async (req, res) => {
    const config = {
        headers: { 'Authorization': `Bearer ${token}`}
    }
    
    try{
        let apiResponse = await axios.get('https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=' + req.params.productName, config).then((res) => {
            return res.data;
        })
        console.log(apiResponse)
        res.json(apiResponse);
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
    return s
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})




/* 
//Search for specifik product via api call, return the ID
//Add the product ID to the stash
//Remove the product from stash
//
//My Stash overwiev¨
let myStash = [hejsa1, hejsa2]
let stashProduct = {
      ingredientName: "", 
      amount: "",
};

hejsa1 = stashProduct
hejsa2 = stashProduct

let data = ['Ram', 'Shyam', 'Sita', 'Gita' ];
  
let list = document.getElementById("myList");
  
data.forEach((item)=>{
  let li = document.createElement("li");
  li.innerText = item;
  list.appendChild(li);
})
 */