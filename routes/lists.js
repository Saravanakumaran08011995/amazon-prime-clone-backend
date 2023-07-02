const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyToken")

//Create

router.post("/", verify,  async (req, res) => {
  if (req.user.isAdmin) {
     const newList = new List(req.body);
     try {
        const saveList = await newList.save();
        res.status(201).json(saveList)
     } catch (err) {
        res.status(500).json(err)
     }
  }else{
    res.status(403).json("You are not allowed!")
  }
});
  

//delete

router.delete("/:id", verify,  async (req, res) => {
    if (req.user.isAdmin) {
       try {
          await List.findByIdAndDelete(req.params.id)
          res.status(201).json("The list has been deleted")
       } catch (err) {
          res.status(500).json(err)
       }
    }else{
      res.status(403).json("You are not allowed!")
    }
  });

//get lists
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
  
    try {
      if (typeQuery) {
        if (genreQuery) {
          list = await List.aggregate([
            { $sample: { size: 20 } }, // Increase the sample size
            { $match: { type: typeQuery, genre: genreQuery } },
          ]);
        } else {
          list = await List.aggregate([
            { $sample: { size: 20 } }, // Increase the sample size
            { $match: { type: typeQuery } },
          ]);
        }
      } else {
        list = await List.find({});
      }
  
      // Check if the retrieved list is empty
      if (list.length === 0) {
        // Handle the empty list case, e.g., return a custom error message
        return res.status(404).json({ message: "No lists found" });
      }
  
      res.status(200).json(list);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

module.exports = router
