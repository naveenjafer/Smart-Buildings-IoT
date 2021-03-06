//Lets require/import the HTTP module
var http = require('http');
var dispatcher = require('httpdispatcher');
var process = require('child_process');

//Lets define a port we want to listen to
PORT=8090;

//We need a function which handles requests and send response
function handleRequest(request, response){
  try {
       //log the request on console
       console.log(request.url);
       //Disptach
       dispatcher.dispatch(request, response);
   } catch(err) {
       console.log(err);
   }
}

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample GET request
dispatcher.onGet("/page1", function(req, res) {

    //res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log(req.params);
    res.end('wassup');
});

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    console.log(req[params]);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);

});
