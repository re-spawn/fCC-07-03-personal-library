/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;

// const server = require('../server');
require('dotenv').config();
if (process.env.HOST === 'repl') {
  var server = 'https://fCC-07-03-personal-library.respawn709.repl.co';
} else {
  var server = require('../server');
}

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let validBookId = '';

    suite('POST /api/books with title => create book object/expect book object', function() {

      const route = '/api/books';
      
      test('Test POST /api/books with title', function(done) {
        const title = 'Decline and Fall (Volume 1)';
        chai
          .request(server)
          .post(route)
          .type('form')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              // book
              let book = res.body;
              assert.isObject(book);
              // _id
              assert.property(book, '_id');
              assert.isString(book._id);
              assert.isNotEmpty(book._id);
              validBookId = book._id;
              // title
              assert.propertyVal(book, 'title', title);
            }
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const title = '';
        chai
          .request(server)
          .post(route)
          .type('form')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'missing required field title');
            }
            done();
          });
      });
      
    });

    suite('GET /api/books => array of books', function(){

      const route = '/api/books';
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get(route)
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              // books
              assert.isArray(res.body);
              // book
              for (let i = 0; i < res.body.length; i++) {
                let book = res.body[i];
                assert.isObject(book);
                // _id
                assert.property(book, '_id');
                assert.isString(book._id);
                assert.isNotEmpty(book._id);
                // title
                assert.property(book, 'title');
                assert.isString(book.title);
                assert.isNotEmpty(book.title);
                // comments
                assert.property(book, 'comments');
                assert.isArray(book.comments);
                // commentcount
                assert.propertyVal(book, 'commentcount', book.comments.length);
              }
            }
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      const route = '/api/books/';

      test('Test GET /api/books/[id] with id not in db',  function(done){
        const bookid = 'id-not-in-db';
        chai
          .request(server)
          .get(route + bookid)
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'no book exists');
            }
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const bookid = validBookId;
        const title = 'Decline and Fall (Volume 1)';
        chai
          .request(server)
          .get(route + bookid)
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              // book
              let book = res.body;
              assert.isObject(book);
              // _id
              assert.propertyVal(book, '_id', bookid);
              // title
              assert.propertyVal(book, 'title', title);
              // comments
              assert.property(book, 'comments');
              assert.isArray(book.comments);
              for (let i = 0; i < book.comments.length; i++) {
                let c = book.comments[i];
                assert.isString(c);
                assert.isNotEmpty(c);
              }
              // commentcount
              assert.propertyVal(book, 'commentcount', book.comments.length);
            }
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      const route = '/api/books/';

      test('Test POST /api/books/[id] with comment', function(done){
        const bookid = validBookId;
        const title = 'Decline and Fall (Volume 1)';
        const comment = 'Decline and Fall rocks!';
        chai
          .request(server)
          .post(route + bookid)
          .type('form')
          .send({
            comment: comment
          })
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              // book
              let book = res.body;
              assert.isObject(book);
              // _id
              assert.propertyVal(book, '_id', bookid);
              // title
              assert.propertyVal(book, 'title', title);
              // comments
              assert.property(book, 'comments');
              assert.isArray(book.comments);
              for (let i = 0; i < book.comments.length; i++) {
                let c = book.comments[i];
                assert.isString(c);
                assert.isNotEmpty(c);
              }
              assert.include(book.comments, comment);
              // commentcount
              assert.propertyVal(book, 'commentcount', book.comments.length);
            }
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const bookid = validBookId;
        const title = 'Decline and Fall (Volume 1)';
        const comment = '';
        chai
          .request(server)
          .post(route + bookid)
          .type('form')
          .send({
            comment: comment
          })
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'missing required field comment');
            }
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const bookid = 'id-not-in-db';
        const comment = 'Decline and Fall rocks!';
        chai
          .request(server)
          .post(route + bookid)
          .type('form')
          .send({
            comment: comment
          })
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'no book exists');
            }
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      const route = '/api/books/';

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        const bookid = validBookId; // title = 'Decline and Fall (Volume 1)'
        chai
          .request(server)
          .delete(route + bookid)
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'delete successful');
            }
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const bookid = 'id-not-in-db';
        chai
          .request(server)
          .delete(route + bookid)
          .end(function(err, res) {
            if (err) {
              console.error(err);
            } else {
              assert.strictEqual(res.status, 200, 'Response status should be 200 (OK)');
              assert.strictEqual(res.text, 'no book exists');
            }
            done();
          });
      });

    });

  });

});
