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

const CONNECTION_STRING = process.env.DB_URI;

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
        // console.log(doc.value);
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
        res.send('Missing inputs');
      } else {
        MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
          const db = client.db('issueTracker');
          db.collection(project).insertOne(issue, (err, doc) => {
            issue._id = doc.insertedId;
            res.json(issue);
            // console.log(doc.value);
          });
        });
      }
    })
    
    .put(function (req, res) {
      const project = req.params.project;
      const issue = req.body._id;
      delete req.body._id;
      let updates = req.body;
      // convert open field to boolean if necessary
      if (typeof updates.open === 'string') {
        updates.open.toLowerCase() === 'true' ? updates.open = true : updates.open = false;
      }
      if (Object.keys(updates).length === 0) {
        res.send('No updated field sent');
      } else {
        updates.updated_on = new Date();
        MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true }, (err, client) => {
          const db = client.db('issueTracker');
          db.collection(project).findOneAndUpdate({_id: new ObjectId(issue)}, {$set: updates}, {new: true}, (err, doc) => {
            (!err && doc.value) ? res.send('Successfully updated') : res.send('Could not update ' + issue);
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
            (!err) ? res.send('Deleted ' + issue) : res.send('Could not delete ' + issue);
            // console.log(doc.value);
          });
        });
      }
    });
    
};
