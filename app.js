const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();


let finalText;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
    getWikiSummary(req.body.Body)
    
  setTimeout(() => {
    const twiml = new MessagingResponse();
    twiml.message(finalText)
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  },1000)

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

function getWikiSummary(term) {
    let url = "https://en.wikipedia.org/w/api.php"; 

    let params = {
        action: "query",
        list: "search",
        srsearch: term,
        format: "json"
    };
    
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let removeHTML = result.query.search[0].snippet.replace(/<+(?<=\<)(.*?)(?=\>)+>/g, '')
            finalText = removeHTML.replace(/\.(.*)/g, '')
        })
        .catch(data => {
            console.log(data);
            finalText = 'Wikipedia is too busy. So I cant answer that right now.';
        });
}