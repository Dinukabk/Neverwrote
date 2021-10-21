const React = require('react');
const moment = require('moment');

/**
 * Render edit/delete buttons and notebook timestamp.
 *
 * List of props: notebook, time, onEdit, onDelete
 */
const NotebookMeta = (props) => {
  return (
    <div className="text-right">
      <p>
        { moment(props.notebook.createdAt).from(props.time.now)  }
        </p>
        <a 
          onClick={ props.onEdit } 
          title="Edit notebook" 
          className="btn btn-sm btn-primary" 
          style={{ marginRight: '2px' }}
        >
          <span className="fa fa-edit" />
        </a>
        <a 
          onClick={ props.onDelete } 
          title="Delete notebook" 
          className="btn btn-sm btn-danger" 
          style={{ marginRight: '2px' }}
        >
          <span className="fa fa-remove" />
        </a>
    </div>
  );
};

/**
 * A read-only view of a blog notebook.
 * This is a stateless functional component.
 * It takes props as its args and returns what the render method would return.
 *
 * List of props: notebook, time, onEdit, onDelete
 */
const NotebookView = (props) => {
  let classes = "";
  if (props.notebook.id == props.activeNoteBookId) {
    classes = "list-group-item active";
  } else {
    classes = "list-group-item";
  }
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          <a onClick={props.clickNotebook} className={classes} >
            {props.notebook.title}
          </a>
        </h5>
        <NotebookMeta {...props} />
      </div>
    </div>
  );
};
module.exports = NotebookView;
