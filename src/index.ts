require("dotenv").config();
const expressServer = require("./api/server");

const port = process.env.PORT || 3001;

expressServer.listen(port, () => console.log(`Server Running on ${port}`));
