var server =require("cloudcms-server/server");
const express = require('express');


//const port = process.env.PORT || 3000;

// Init app
const app = express();


// runs on 2999 by default
process.env.PORT = 8887;

app.set('port', process.env.PORT);
				

var routes = function (app, callback)
{
	
	app.get("/api/books", function(req, res) {
        let query = {
            _type: "store:book"
        };
        if (req.query.tag)
        {
            query.tags = req.query.tag;
        }

        req.branch(function(err, branch) {
            branch.trap(function(err) {
                return res.status(500).json(err);
            }).queryNodes(query).each(function() {
                this.imageUrl = "/static/" + this._doc + "-image.jpg?repository=" + this.getRepositoryId() + "&branch=" + this.getBranchId() + "&node=" + this.getId();
                this.authorTitle = this.author.title;
            }).then(function() {
                return res.status(200).json(this);
            });
        });
    });
   callback();
};

server.routes(routes);
server.report(function(callback) {

    console.log("Web Server: http://localhost:" + process.env.PORT);
    console.log("");

    callback();
});

server.start({
    "setup": "single",
    "welcome": {
        "enabled": true,
        "file": "index.html"
    },
    "wcm": {
        "enabled": true,
        "cache": false
    },
    "cache": {
        "enabled": true
    },
    "autoRefresh": {
        "log": true
    },
    "perf": {
        "enabled": true,
        "paths": [{
            "regex": "/static/.*",
            "cache": {
                "seconds": 300
            }
        }]
    }
});