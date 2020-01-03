/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       If additional tests are added, keep them at the very end
*
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  
  let _id1;
  let _id2;
    
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/functionalTests')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          _id1 = res.body._id;
          assert.strictEqual(res.body.issue_title, 'Title');
          assert.strictEqual(res.body.issue_text, 'text');
          assert.strictEqual(res.body.created_by, 'Functional Test - Every field filled in');
          assert.strictEqual(res.body.assigned_to, 'Chai and Mocha');
          assert.strictEqual(res.body.status_text, 'In QA');
          assert.isBoolean(res.body.open);
          assert.strictEqual(res.body.open, true);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/functionalTests')
        .send({
          issue_title: 'Title 2',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
          _id2 = res.body._id;
          assert.strictEqual(res.body.issue_title, 'Title 2');
          assert.strictEqual(res.body.issue_text, 'text');
          assert.strictEqual(res.body.created_by, 'Functional Test - Required fields filled in');
          assert.strictEqual(res.body.assigned_to, '');
          assert.strictEqual(res.body.status_text, '');
          assert.isBoolean(res.body.open);
          assert.strictEqual(res.body.open, true);
          done();
        });        
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/functionalTests')
        .send({
          issue_title: 'Title 3',
          created_by: 'Functional Test - Missing required fields',
          assigned_to: 'Chai and Mocha'
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'Missing inputs');
          done();
        });        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/functionalTests')
        .send({_id: _id1})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'No updated field sent');
          done();
        });        
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/functionalTests')
        .send({_id: _id1, issue_text: 'updated issue text test'})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'Successfully updated');
          done();
        });  
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/functionalTests')
        .send({_id: _id2, issue_text: 'updated issue text test for the second issue', open: 'false'})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'Successfully updated');
          done();
        });  
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/functionalTests')
        .query({})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/functionalTests')
        .query({assigned_to: 'Chai and Mocha'})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.strictEqual(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/functionalTests')
        .query({open: false})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.strictEqual(res.body[0].open, false);
          assert.strictEqual(res.body[0].issue_title, 'Title 2');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/functionalTests')
        .send({})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, '_id error');
          done();
        });  
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/functionalTests')
        .send({_id: _id2})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'Deleted '+ _id2);
          done();
        });  
      });

      // Leave this out of boilerplate -- 
      // learners can add this themselves if they want to
      test('Clean up remaining test issue', function(done) {
        chai.request(server)
        .delete('/api/issues/functionalTests')
        .send({_id: _id1})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, 'Deleted '+ _id1);
          done();
        });  
      });
      
    });

});
