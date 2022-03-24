const express = require('express');
const app = express();
const port = 3001;
const axios = require('axios');
const token = '80ddad90-954d-4440-b54c-8f3a8a403cb2';
const fs = require('fs');
const { resolveNaptr } = require('dns');
const { json } = require('express');

const stashjsonPath = "../stash/stash.json"

app.use(express.urlencoded({ extended: false }));

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


// Returns json containing stash info
app.get("/stash/get", async (req, res) => {
  fs.readFile(stashjsonPath, (err, fileData) => {
    if (err) {
      console.log("Can't, read file" )
    }
    else {
      res.json(JSON.parse(fileData));
    }
  });
});



// Add given product to stash json file. 
app.post("/stash/add", async (req, res) => {
  // Product json given via body
  let newProductJson = req.body

  // If file can't be read, create new one with {products:[]} structure
  fs.access(stashjsonPath, fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      console.log("File doesn't exist. Trying to create empty file")
      fs.writeFile(stashjsonPath, JSON.stringify({products:[]}), err => {
        if (err) 
        console.log("Error writing file:", err);
        return
      });
    }

    // When file exists, take file data and add newly added product to the data. Write all data in new file after
    fs.readFile(stashjsonPath, (err, fileData) => {
      if (err) {
        console.log("Can't read file" )
      }
      else {
        // Gets already stored data and adds new product to it
        let parsedJson = JSON.parse(fileData)
        parsedJson.products.push(newProductJson)

        fs.writeFile(stashjsonPath, JSON.stringify(parsedJson), err => {
          if (err) console.log("Error writing file:", err);
        })
      }
    })
  })
  res.status(200).send(newProductJson)
})

//Remove product by id in stash json file
app.post("/stash/remove", async (req, res) => {
  // When file exists, take file data and remove product from the data. opdate data in new file after
  fs.readFile(stashjsonPath, (err, fileData) => {
    if (err) {
      console.log("Can't read file" )
      res.status(404).send("File couldn't be read")
    }
    else {
      // Gets already stored ingredients and removes ingredient by id.
      let parsedJson = JSON.parse(fileData)
      jsonArray = parsedJson.products
      //Loops through file, and remove all products with the given id. 
      for (let i = 0; i < jsonArray.length; i++)
        if (jsonArray[i].prod_id === req.body.id) {
          jsonArray.splice(i,1)
        break;
      }

      res.status(200).send(parsedJson)

      fs.writeFile(stashjsonPath, JSON.stringify(parsedJson), err => {
        if (err) console.log("Error writing file:", err);
      })
    }
  })
})

//Search after a specific product in Salling group API and returns json with data on products.
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