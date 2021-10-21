const React = require('react');
const NoteEdit = require('./NoteEdit');

/**
 * A button which expands into a form for writing a new note.
 */
class NoteNew extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
    this.state = { editing: false };
  }

  render() {
    const openEdit = () => {
      this.setState({ editing: true });
    };

    const closeEdit = () => {
      this.setState({ editing: false });
    };

    const createNote = (newNote) => {
      this.props.createNote(newNote, (err) => {
        if (! err) {
          closeEdit();
        }
      });
    };

    // TODO Task 6: Write code to switch to edit mode when editing is clicked.
    if (this.state.editing) {
      // Render component for editing the note
      return (
        <NoteEdit
          notebookId={this.props.notebookId}
          note={this.props.note}
          onSave={createNote}
          onCancel={closeEdit}
        />
      );
    }

    return (
      <button 
        className="blog-load-more btn btn-primary btn-md"
        onClick={ openEdit }
      >
        New Note
      </button>
    );
  }
}

module.exports = NoteNew;
