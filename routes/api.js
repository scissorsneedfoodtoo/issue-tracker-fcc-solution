/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const searchQuery = req.query;
      if (searchQuery._id) { searchQuery._id = new ObjectId(searchQuery._id)}
      if (searchQuery.open) { searchQuery.open = String(searchQuery.open) == "true" }
      MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
        const db = client.db('issueTracker');
        db.collection(project).find(searchQuery).toArray((err, docs) => res.json(docs));
      });
    })
    
    .post(function (req, res){
      const project = req.params.project;
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || ''
      };
      if(!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send('missing inputs');
      } else {
        MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
          const db = client.db('issueTracker');
          db.collection(project).insertOne(issue, (err, doc) => {
            issue._id = doc.insertedId;
            res.json(issue);
          });
        });
      }
    })
    
    .put(function (req, res) {
      const project = req.params.project;
      const issue = req.body._id;
      delete req.body._id;
      const updates = req.body;
      for (const ele in updates) { if (!updates[ele]) { delete updates[ele] } }
      if (updates.open) { updates.open = String(updates.open) == "true" }
      if (Object.keys(updates).length === 0) {
        res.send('no updated field sent');
      } else {
        updates.updated_on = new Date();
        MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
          const db = client.db('issueTracker');
          db.collection(project).findAndModify({_id: new ObjectId(issue)}, [['_id', 1]], {$set: updates}, {new: true}, (err, doc) => {
            (!err) ? res.send('successfully updated') : res.send('could not update ' + issue + ' ' + err);
            // console.log(doc.value);
          });
        });  
      }
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      const issue = req.body._id;
      if (!issue) {
        res.send('_id error');
      } else {
        MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
          const db = client.db('issueTracker');
          db.collection(project).findOneAndDelete({_id: new ObjectId(issue)}, (err, doc) => {
            (!err) ? res.send('deleted ' + issue) : res.send('could not delete ' + issue + ' ' + err);
          });
        });
      }
    });
    
};
