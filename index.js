var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'us-west-2' });
var request = require('request');
var cheerio = require('cheerio');

const checkInventory = () => {
    //Paste the url for the product you want
    const url = "https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625"
    //Paste the cookie of your browser when you manually check website with a browser
    const cookie = "HSID=AfJ2UbYmLaDKSx6PB; SSID=AseNotzCYggpi1hXK; APISID=7DSeQ3cwVYpamcsH/AaOKlWT80j6iS2iEn; SAPISID=qCkD7xvOWP-MV9a1/AmPH1n-TOxMjIUT3E; __Secure-HSID=AfJ2UbYmLaDKSx6PB; __Secure-SSID=AseNotzCYggpi1hXK; __Secure-APISID=7DSeQ3cwVYpamcsH/AaOKlWT80j6iS2iEn; __Secure-3PAPISID=qCkD7xvOWP-MV9a1/AmPH1n-TOxMjIUT3E; SID=vAcgyqIT1un4L-u-vcVkMQagtsdIl9mEM0rb740Sl6oltQcTplUQsk9l5nHg2o_PjsV3kg.; __Secure-3PSID=vAcgyqIT1un4L-u-vcVkMQagtsdIl9mEM0rb740Sl6oltQcTO5meNFh1buy64oG1zOC67A.; OTZ=5378316_72_76_104100_72_446760; ANID=AHWqTUnnYngWiwRwgMKcAh6TEWqcePWav9dM10OCLCnzV6FzEHosZGiGaonPsgs8; NID=202=j4ZNAjXDfpW8hnckcXuYSQs1jV0UhKPAUzluNWIDtXvU4q8mUsEzIQQpQiKeyuAnpnQ3huzWmbiMIAleKsJSzR6ip_WQ6b15Sk0MlxRLor47mjdqaQbZmGFJtncZN0OgcT2PMRv0m2tPMDKD2jbiINHZHmVMj5Sm-I2lC8ZIyd6LGSYNItZPAq1BAM6p2km3yiaGZNz6S3xox3AlANWvkRO3v46w8MehbAa4_3K0fSPU8VqxUvNlnhjpa_y70PpQ9brD6vAXXWF80Omg5tjGafp6-MveztFpg9MGTpuF5ERMrqKAIKKUdulzXigUN3QtP-aR5LSlgIpaVzcevOZH4fb39oF1TkGedLb6XsyjtO0p; 1P_JAR=2020-04-11-02; SIDCC=AJi4QfFGd3YZhwErT5vfMOHwa3PPb2E_y_cJ6ujyonFNm-Iptfh83LxAqSEnDJCTojP8-yW1tQ
";
    //Set up in AWS SES following tutorial
    const sourceEmailAddr = "berryzhang16@gmail.com";
    const destinationEmailAddrs = ["berryzhang16@gmail.com"];
    
    const req = {
        url: url,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "axios/0.18.0",
            "Cookie": cookie
        }
    }
    request(req, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log("Status code: " + response.statusCode);
        const $ = cheerio.load(body);
        const status = $('.fulfillment-add-to-cart-button div button').text().trim();
        console.log("Inventory status: " + status);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (status !== "Sold Out") {
            var params = {
                Destination: {
                    ToAddresses: destinationEmailAddrs
                },
                Message: {
                    Body: {
                        Text: { Data: "" }
                    },
                    Subject: { Data: "Nintendo Switch is available!" }
                },
                Source: sourceEmailAddr
            };
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("email sent")
                    console.log(data);
                }
            });
        }
    });
}
console.log("Script starting...")
setInterval(checkInventory, 30000);
