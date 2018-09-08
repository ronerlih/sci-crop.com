var devmode = true;
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
//		 csvdata = require('csvdata'),
var fs = require('fs');
//		  jsonexport = require('jsonexport'),
//		  diskspace = require('diskspace'),
var request = require('request');
// var poster =  require("poster");
var cors = require('cors');
var events = require('events');
var multer = require('multer');
//var bodyParser = require('body-parser');
//var xFrameOptions = require('x-frame-options');

//constructors
var eventEmitter = new events.EventEmitter();
var app = express();

//view engin - ejs
app.set('view engine','ejs');
app.set('views', 'assets/views');
//use
app.use(cors({origin: '*'}));
//app.use(fileUpload());


//iframe header response options
//var middleware = xFrameOptions(headerValue = 'SAMEORIGIN');

//tamplate locals
app.locals.local = 'test: success';
app.locals.buckets = {};
app.locals.policy = [];

//template vars
var ownerName = 'Aestatix - webGL';

//vars
var lastImageName;
//console.log("path: " + __dirname + '/www/sci-crop.com/public_html/');
var options = {
    root: __dirname + '/www/sci-crop.com/public_html/',
//    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
		  'X-Frame-Options': 'ALLOW-FROM https://www.psykrop.com',
		  'Content-Security-Policy': 'frame-ancestors https://www.psykrop.com'
    }
};

//img filter
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('incompatible encoding, please try uploading the image in a .png format'), false);
    }
    cb(null, true);
};
//file upload storage
var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
//		 			console.log("request: " + JSON.stringify(file.originalname));
			 if(file){
			 	var now = new Date();
			 lastImageName = file.fieldname + "_" + now.getDate() + "_" + now.getMonth() + "_" + now.getFullYear() + "_" + now.getHours() + "_" + now.getSeconds() + "_" + now.getMilliseconds() + "_" + file.originalname;
//			 	console.log("file name:" + lastImageName);
         }
				 
				 callback(null, "/www/sci-crop.com/public_html/uploads");
//				 callback(null, __dirname + "/www/sci-crop.com/public_html/uploads");
     },
   filename: function(req, file, callback) {
         callback(null, lastImageName);
     }
 });
const upload = multer({ storage: Storage ,fileFilter: imageFilter}).single('img');

//root-home route
app.get('/', function (req, res) {
	//res.send("response..: Success!! ");
	res.sendFile("index.html", options);
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});  

//player route
app.get('/sandbox', function (req, res) {
	//res.send("response..: Success!! ");
	res.sendFile("iframe-parent.html", options);
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});  

//file upload
app.post('/upload',  function (req, res, callback) {
upload(req, res, function (err) {

		if (err){
      console.log(JSON.stringify(err));
//      res.status(400).send("fail saving image");
    } else {
//		callback(console.log('callback: ' + lastImageName));
		callback(console.log('image uploaded to: ' +lastImageName + '\n' + 
													'from (client service location): ' + req.ip));
		res.send(lastImageName);
		setTimeout(
			function(){	fs.unlinkSync(__dirname + '/www/sci-crop.com/public_html/uploads/' + lastImageName);
							console.log('image '+ lastImageName+ ' earased');
							},5000);
	 		}		
	});
//	console.log("req.file.originalname: " + lastImagePath.file);
//    res.redirect('/');
});

//answer favicon request
app.get('/favicon.ico', function (req, res) {
}); 

//serve static
app.use(express.static('www/sci-crop.com/public_html/'));

function logRequest(requestURL, requestQuary, requestIp){
	now = new Date();
	var zeroFroHours = '';
	console.log("\nnew request:\n" + requestURL +  requestQuary );
	(now.getHours() != (10 || 11 || 12) ) ? zeroFroHours = "0" : zero = "";		
	console.log( now.getMonth() + "/" + now.getDate() + "/" + now.getFullYear() +
							"\n" + zeroFroHours + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() +
							"\nfrom:\n(client service location)\n" + requestIp + 
							"\n - process done - \n");
}

var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || '3000';

app.listen(port, () => console.log('running on port 3000'));
	console.log('\033[2J');
  console .log(' Hi there, Welcome to Aestatix webGL server');
   console.log('________________________________________________________');
  







































