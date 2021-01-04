/* Extremely basic HTTP server. All the logic is in this file. */

const fs = require("fs");
const http = require("http");
const url = require("url");
const querystring = require("querystring");

// Request handler
function onRequest(req, res) {
    // Determine the path name
    let pathname = url.parse(req.url).pathname.slice(1);
    console.log("request for " + pathname + "...");
    if (pathname === "") pathname = "index.html";

    // Check if it's a download request
    if (pathname === "download") {
        console.log("download requested: ");
        // Get the list of (backend) modules
        let modules = querystring.parse(url.parse(req.url).query)["modules"].split(' ');
        console.log(modules);
        res.writeHead(200, {"content-type": "text/plain"});
        res.write(
            "Hello there! You asked for the modules: "
            + modules.join(', ')
            + ". We're working on the code that will let you get the pulse programme"
            + " here, but it's not yet ready. Please check back later!"
        );
        res.end();
        return;
    }

    // If it's not a download request, then it's looking for a file.
    // Read the file into a stream
    let contentType = "";
    let stream = fs.createReadStream(pathname);

    // If the file doesn't exist, return a standard 404 response
    stream.on("error", function(err) {
        res.writeHead(404, {"content-type": "text/html"});
        res.write(`<html><head><title>404: Not Found</title></head><body>
            The URL '${pathname}' was not found. You can return to the 
            <a href="/">index</a>.</body></html>`);
        res.end();
        console.log(err);
        return;
    });

    // Otherwise, determine the content type and return the file
    if (pathname.endsWith(".html")) contentType = "text/html";
    else if (pathname.endsWith(".js")) contentType = "text/javascript";
    else if (pathname.endsWith(".css")) contentType = "text/css";
    res.writeHead(200, {"content-type": contentType});
    stream.pipe(res);
}

// Create the server on port 80
http.createServer(onRequest).listen(80);
