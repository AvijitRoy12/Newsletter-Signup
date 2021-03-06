const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var eMail = req.body.email;

    const data = {
        members: [
            {
                email_address: eMail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/listID";
    const options = {
        method: "POST",
        auth: "avijit17:apikey-us14"
    }
    const request = https.request(url, options, function (response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data){
            console.log(JSON.parse(data));
        });
    })
    request.write(jsonData);
    request.end();

});
app.post("/failure", function (req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 5000, function () {
    console.log("The server is up and running on 5000");
});

