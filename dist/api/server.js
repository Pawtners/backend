const express = require("express");
const server = express();
server.get("/", (req, res) => {
    res.send("The sedulous hyena ate the antelope!");
});
module.exports = server;
//# sourceMappingURL=server.js.map