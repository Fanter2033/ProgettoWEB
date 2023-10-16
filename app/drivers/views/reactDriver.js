const viewDriver = require("./viewDriver");
const viewReactDriver = express();
const path = require("path");
const AuthController = require("../../controllers/AuthController");
const AuthModel = require("../../models/AuthModel");
const publicDir = path.join(__dirname, "../../public");
viewAdminDriver.use(express.static(publicDir));
const authController = new AuthController(new AuthModel());

viewReactDriver.get("/", (req, res) => {
  let logged = authController.isAuthLogged(req);
  if (logged) {
    res.redirect("./userView");
  } else res.sendFile(publicDir + "/html/loginUser.html");
});

//TODO:
viewReactDriver.get("/channels/", async (req, res) => {});

viewReactDriver.get("/squeals/", async (req, res) => {});

viewReactDriver.get("/account", async (req, res) => {});

viewDriver.post("/user", )
module.exports = viewAdminDriver;
