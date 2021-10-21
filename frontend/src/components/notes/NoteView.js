const React = require('react');
const moment = require('moment');

/**
 * Render edit/delete buttons and note timestamp.
 *
 * List of props: note, time, onEdit, onDelete
 */
const NoteMeta = (props) => {
  return (
    <div className="blog-note-meta">
      <a role="button" title="Edit note"
        style={{ paddingRight: '8px' }}
        onClick={ props.onEdit }
      >
        <span className="fa fa-edit" />
      </a>

      {/* TODO Task 7: Add a delete button */}
      <a role="button" title="Delete note"
         style={{ paddingRight: '8px' }}
         onClick={ props.onDelete }
      >
        <span className="fa fa-remove" />
      </a>
      { 
        moment(props.note.createdAt).from(props.time.now) 
      }
    </div>
  );
};

/**
 * A read-only view of a blog note.
 * This is a stateless functional component.
 * It takes props as its args and returns what the render method would return.
 *
 * List of props: note, time, onEdit, onDelete
 */
const NoteView = (props) => {
  return (
    <div className="blog-note">
      <a onClick={ props.noteClick } className="btn">
        <h2 className="blog-note-title">{props.note.title}</h2>
      </a>
      {/* TODO Task 3: Display blog metadata */}
      <NoteMeta {...props} />
      {/* TODO Task 3: Display blog content */}
      <div className="blog-note-content">
        { props.noteId == props.note.id ? props.note.content : ''}
      </div>
    </div>
  );
};
module.exports = NoteView;
