let express = require('express');
let path = require('path');


let app = express();

let dbconnect = require("./connect.js");
dbconnect();

// Give access to static files
app.use(express.static('D:/MyWeb/final_webdev/Webdev-Project'));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join('D:/MyWeb/final_webdev/Webdev-Project', 'index.html'));
});

// Start the server
app.listen(4000, () => console.log('Server listening on port 4000'));
