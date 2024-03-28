const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/task");
const multer = require('multer');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
   cb(null, Date.now() + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  Task.find()
    .select("name surname date adress zip city task taskImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tasks: docs.map(doc => {
          return {
            name: doc.name,
            surname: doc.surname,
            date: doc.date,
            adress: doc.adress,
            zip: doc.zip,
            city: doc.city,
            task: doc.task,
            taskImage: doc.taskImage      
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
            message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/new", upload.single('taskImage'), (req, res, next) => {
  console.log(req.file);
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    date: req.body.date,
    name: req.body.name,
    surname: req.body.surname,
    adress: req.body.adress,
    zip: req.body.zip,
    city: req.body.city,
    task: req.body.task,
    taskImage: req.file.path
  });
  task
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Task created successfully",
        createdTask: {
          name: result.name,
          surname: result.surname,
          _id: result._id,
          date: result.date,
          adress: result.adress,
          zip: result.zip,
          city: result.city,
          task: result.task,
          taskImage: result.taskImage
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;