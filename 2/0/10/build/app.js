/* Extremely basic HTTP server. All the logic is in this file. */
import fs from "fs";
import http from "http";
import url from "url";
import querystring from "querystring";
import { makePulprogText } from "./pulprog.js";
import allModules from "./allModules.js";
const port = process.env.PORT || 5555;
const errorText = `Error: modules not correctly specified

The format for a proper request is:

    download?modules=MODULE1+MODULE2+MODULE3

The available modules are:

    ${[...allModules.keys()].join("\n    ")}
`;
// Request handler
function onRequest(req, res) {
    // Determine the path name
    let pathname = url.parse(req.url).pathname.slice(1);
    if (pathname === "")
        pathname = "index.html";
    // Check if it's a download request
    if (pathname === "download") {
        let pptext = "";
        // Try to get the list of (backend) modules. If it fails, return a
        // generic error. Otherwise call makePulprogText().
        try {
            let backendModules = querystring.parse(url.parse(req.url).query)["modules"].split(' ');
            res.writeHead(200, { "content-type": "text/plain" });
            pptext = makePulprogText(backendModules, allModules, true);
            if (pptext.length > 0) {
                console.log("download was requested for: " + backendModules.join(", "));
            }
            else
                throw "No pulse programme found"; // caught later
        }
        catch (error) {
            // It could genuinely be any error: we aren't very concerned.
            res.writeHead(400, { "content-type": "text/plain" });
            pptext = errorText;
        }
        res.write(pptext);
        res.end();
        return;
    }
    // If it's not a download request, then it's looking for a file.
    // Read the file into a stream
    let contentType = "";
    let stream = fs.createReadStream(pathname);
    // If the file doesn't exist, return a standard 404 response
    stream.on("error", function (err) {
        res.writeHead(404, { "content-type": "text/html" });
        res.write(`<html><head><title>404: Not Found</title></head><body>
            The URL '${pathname}' was not found. You can return to the 
            <a href="/">index</a>.</body></html>`);
        res.end();
        console.log(err);
        return;
    });
    // Otherwise, determine the content type and return the file
    if (pathname.endsWith(".html"))
        contentType = "text/html";
    else if (pathname.endsWith(".js") || pathname.endsWith(".mjs"))
        contentType = "text/javascript";
    else if (pathname.endsWith(".txt"))
        contentType = "text/plain";
    else if (pathname.endsWith(".css"))
        contentType = "text/css";
    else if (pathname.endsWith(".png"))
        contentType = "image/png";
    else if (pathname.endsWith(".ico"))
        contentType = "image/x-icon";
    else if (pathname.endsWith(".webmanifest"))
        contentType = "application/manifest+json";
    res.writeHead(200, { "content-type": contentType });
    stream.pipe(res);
}
// Create the server on port 5555 after loading all modules
http.createServer(onRequest).listen(port);
