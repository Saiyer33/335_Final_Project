const http = require('http');
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express"); /* Accessing express module */
const { name } = require('ejs');
const app = express();
const httpSuccessStatus = 200;
process.stdin.setEncoding("utf8");
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const databaseAndCollection = {db: "CMSC335_DB", collection:"beatles"};

/****** DO NOT MODIFY FROM THIS POINT ONE ******/
const { MongoClient, ServerApiVersion } = require('mongodb');

function insertBeatle(client, databaseAndCollection, newBeatle) {
    const result = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newBeatle);
}

function getPostCount(instaID, name){
const options = {
    method: 'GET',
    url: 'https://instagram47.p.rapidapi.com/public_user_posts',
    params: {userid: instaID},
    headers: {
      'X-RapidAPI-Key': 'eb564eea82mshc9842710e930ca9p1f2b63jsn158405aa53f4',
      'X-RapidAPI-Host': 'instagram47.p.rapidapi.com'
    }
  };
  axios.request(options).then(function (response) {
     console.log("The number of instagram posts by " + name + " is " + String(response.data.body.count))
     console.log("\n")
}).catch(function (error) {
     console.log(error);
});
}

async function main() {
    var numArts = 0;
    const uri = `mongodb+srv://Saiyer33:Uyire561@cluster0.jbtpzdb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

try {
client.connect();
const portNumber = process.argv[2];

process.stdout.write(`Web server is running at http://localhost:${portNumber}\n`);
const prompt = "Type stop to shutdown the server:\n";
process.stdout.write(prompt);
process.stdin.resume();
process.stdin.on("readable", function () {
let dataInput = process.stdin.read();
let command = dataInput.trim();
if (command === "stop"){
process.stdout.write("Shutting down the server\n");
process.exit(0);
}
});

app.set("views", path.resolve(__dirname, "Templates"));
app.set("view engine", "ejs");
app.get("/", (request, response) => {
response.render("Fab4HomePage");
});

app.get("/choose", (request, response) => {
    const portNumber = process.argv[2];
    const variables = {
        port: portNumber
    }
    response.render("choose", variables);
    });

app.use(bodyParser.urlencoded({extended:false}));

app.post("/choose", (request, response) => {

        const variables = {
            artists : request.body.artistsSelected,
        };
        insertBeatle(client, databaseAndCollection, variables);
        numArts = numArts + 1;
        response.render("postChoose", variables);
});

app.get("/review", async function Test(request, response) {
    let filter = {};
    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);
    var result = await cursor.toArray();
    var data = [{'John Lennon' : ['October 9th 1940' , 'Guitar, vocals, piano', 'Strawberry Fields Forever']}, 
                {'Paul McCartney' : ['June 18th 1942', 'Bass guitar, vocals, piano', 'Let It Be']},
                {'George Harrison' : ['Febuary 25th 1943' , 'Guitar, sitar, vocals' , 'While My Guitar Gently Weeps']},
                {'Ringo Starr' : ['July 7th 1940', 'Drums, vocals, percussion', 'With A Little Help From My Friends']}]

    var tableItems = "<table border = 1> <tr> <th> Name </th> <th> Birthday </th> <th> Instruments played </th> <th> Best Song </th> <th> Number of posts on instagram</th> </tr>";
    for(let i = 0; i < result.length; i++){
    if(result[i].artists === 'John Lennon'){
            tableItems +=  "<tr> <td>" + result[i].artists + "</td> <td>" + data[0][result[i].artists][0] +  "</td> <td>" + data[0][result[i].artists][1] + "</td> <td>" + data[0][result[i].artists][2] + "</td> <td>" + "Check console for value"  + "</td> </tr>";
            getPostCount('53483289',"John Lennon")
    }
    else if(result[i].artists === 'Paul McCartney'){
            tableItems +=  "<tr> <td>" + result[i].artists + "</td> <td>" + data[1][result[i].artists][0] +  "</td> <td>" + data[1][result[i].artists][1] + "</td> <td>" + data[1][result[i].artists][2] + "</td> <td>" + "Check console for value" + "</td> </tr>"
            getPostCount('507929975', "Paul McCartney") 
    }
    else if(result[i].artists === 'George Harrison'){
            tableItems +=  "<tr> <td>" + result[i].artists + "</td> <td>" + data[2][result[i].artists][0] +  "</td> <td>" + data[2][result[i].artists][1] + "</td> <td>" + data[2][result[i].artists][2] + "</td> <td>" + "Check console for value"  + "</td> </tr>"
            getPostCount('4466069696', "George Harrison")
    }
    else{
            tableItems +=  "<tr> <td>" + result[i].artists + "</td> <td>" + data[3][result[i].artists][0] +  "</td> <td>" + data[3][result[i].artists][1] + "</td> <td>" + data[3][result[i].artists][2] + "</td> <td>" + "Check console for value" + "</td> </tr>"
            getPostCount('2100821565', "Ringo Starr") 
    }
}
    const variables = {
        itemsTable : tableItems
    };
    response.render("review", variables);
});

app.get("/remove", (request, response) => {
    const portNumber = process.argv[2];
    const variables = {
        port: portNumber
    }
    response.render("remove", variables);
    });

app.post("/remove", (request, response) => {

        const variables = {
            count : numArts
        };
        response.render("remApps", variables);
        client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .deleteMany({});
        numArts = 0;
    });   

app.listen(portNumber);

} catch (e) {
    console.error(e);
} finally {
    await client.close();
}
}
main().catch(console.error);


