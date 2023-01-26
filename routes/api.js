/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env['DB'], {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true, default: 0 },
  comments: { type: [String], required: true, default: [] },
});
let Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).then(
        function(value) {
          res.json(value);
        },
        function(error) {
          console.log("failed Book.find");
          console.error(error);
        }
      );
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including at least _id and title
      if (title == undefined || title == '') {
        res.send('missing required field title');
        return;
      }
      Book.create({ title: title }).then(
        function(value) {
          res.json(value);
        },
        function(error) {
          console.log("failed Book.create");
          console.error(error);
        }
      );
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}).then(
        function(value) {
          res.send('complete delete successful');
        },
        function(error) {
          console.log("failed Book.deleteMany");
          console.error(error);
        }
      );
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (bookid == undefined || bookid == '') {
        res.send('no book exists');
        return;
      }
      Book.findById(bookid).then(
        function(value) {
          if (value == null) {
            res.send('no book exists');
          } else {
            res.json(value);
          }
        },
        function(error) {
          console.log("failed Book.findById");
          console.error(error);
        }
      );
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (bookid == undefined || bookid == '') {
        res.send('no book exists');
        return;
      }
      if (comment == undefined || comment == '') {
        res.send('missing required field comment');
        return;
      }
      Book.findById(bookid).then(
        function(value) {
          if (value == null) {
            res.send('no book exists');
          } else {
            let comments = value.comments;
            comments.push(comment);
            Book.findByIdAndUpdate(bookid,{
              commentcount: value.commentcount + 1,
              comments: comments
            }, { returnDocument: 'after' }).then(
              function(value) {
                res.json(value);
              },
              function(error) {
                console.log("failed Book.findByIdAndUpdate");
                console.error(error);
              }
            )
          }
        },
        function(error) {
          console.log("failed Book.findById");
          console.error(error);
        }
      );
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (bookid == undefined || bookid == '') {
        res.send('no book exists');
        return;
      }
      Book.deleteOne({ _id: bookid }).then(
        function(value) {
          if (value.deletedCount == 1) {
            res.send('delete successful');
          } else {
            res.send('no book exists');
          }
        },
        function(error) {
          console.log("failed Book.deleteOne");
          console.error(error);
        }
      );
    });
  
};
