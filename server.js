// Node core dependencies that will not be changed 
//and hence kept as const rather than var
const http = require('http'); 
const url = require('url'); //requests are considered as URL
const path = require('path'); //get the directory path using inbuilt functions
const fs = require('fs'); // Node file system

// MIME type dependencies that will be used in our server
// Any new MIME type dependency that we use should be added here
const mimeTypes = {
  "html" : "text/html",
  "jpeg" : "image/jpeg",
  "jpg" : "image/jpg",
  "png" : "image/png",
  "js" : "text/javascript",
  "css" : "text/css"
};

// Creating a server
var server =http.createServer(function(req,res){
	console.log('req 1 : '+req.url.toString());
	var uri = url.parse(req.url).pathname; //Gets the path name of the specified url
	console.log('uri '+JSON.stringify(uri));

	var fileName = path.join(process.cwd(),unescape(uri)); //Get the absolute file path from the current working directory with the user specified name/file name
	console.log('fileName : '+fileName);

	var stats;
	try{
     		stats = fs.lstatSync(fileName); //is the file present, execute this loop, otherwise goto catch
			console.log('stats : '+JSON.stringify(stats));
	}catch(e){
		console.log(e)
		res.writeHead(404,{'Content-type' : 'text/plain'}); //404 Not Found inside the head of your browser
		res.write('404 Not Found \n'); //write the response
		res.end();
		return;
	}
	if(stats.isFile()){
		console.log("File exists");
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]; //get the MIME of the file
   		console.log('mimeType : '+JSON.stringify(mimeType));
   		res.writeHead(200,{'Content-type':mimeType});
		var fileStream = fs.createReadStream(fileName);
		console.log('fileStream : '+JSON.stringify(fileStream));
		fileStream.pipe(res);
	}
	else if(stats.isDirectory()){
		console.log("File doesn't exist");
		console.log('Location : ');
		res.writeHead(302,{
		'Location' : 'about.html'
})
res.end();
	}
	else{
			res.writeHead(500,{'Content-type':'text/plain'}); //Internal server error
			res.write('500 Internal Error\n');
			res.end();
	}
}).listen(1337);

console.log("Hello World"); //Main thread will print this before printing anything. This will happen asynchronously
