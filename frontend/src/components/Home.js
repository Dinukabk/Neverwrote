/**
 * This file contains the Home component.
 * Other React components for viewing notes and notebooks should be nested
 * beneath the Home component.
 */

const React = require('react');
const Statistics = require('./Statistics');
const NotebookList = require('./notebooks/NotebookList');
const NoteList = require('./notes/NoteList');
/*
  *** TODO: Start building the frontend from here ***
  You should remove the placeholder text and modify the component as you see
  fit while working on the assignment.
*/
const Home = () => (
  <div className="container">
    <blockquote className="blockquote text-center">
      <p className="mb-0">Neverwrote</p>
      <footer className="blockquote-footer">This placeholder text was rendered by the <code>Home</code> component.</footer>
    </blockquote>
    <div className="col-sm-12">
      <Statistics />
      <hr/>
    </div>
    <div className="col-sm-6">
      <NotebookList />
    </div>
    <div className="col-sm-6">
      <hr />
      <NoteList />
    </div>
  </div>
);

module.exports = Home;
