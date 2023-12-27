const express = require("express");
const router = express.Router();
const {
  getHandler,
  postHandler,
  deleteHandler,
} = require("../controller/controller");

router.get("/", getHandler);
router.post("/", postHandler);
router.delete("/:id", deleteHandler);

module.exports = router;
