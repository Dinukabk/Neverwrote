const React = require('react');

const NoteEdit = require('./NoteEdit');
const NoteView = require('./NoteView');


class Note extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
    this.state = { 
      editing: false,
    };
  }

  render() {
    const openEdit = () => {
      this.setState({ editing: true });
    };

    const closeEdit = () => {
      this.setState({ editing: false });
    };

    const saveEdit = (editedNote) => {
      this.props.saveNote(editedNote, (err) => {
        if (! err) {
          closeEdit();
        }
      });
    };

    // TODO Task 7: Add code for delete
    const deleteThisNote = () => {
      this.props.deleteNote(this.props.note.id);
    };

    const onNoteClick = () => {
      this.props.onNoteClick(this.props.note.id);
    }

    if (this.state.editing) {
      // Render component for editing the note
      return (
        <NoteEdit
          note={this.props.note}
          onSave={saveEdit}
          onCancel={closeEdit}
          notebookId={this.props.notebookId} 
        />
      );
    }
    // Render read-only view of the note
    // TODO Task 7: add code for delete
    return (
      <NoteView
        note={this.props.note}
        time={this.props.time}
        onDelete={deleteThisNote}
        onEdit={openEdit}
        noteClick={onNoteClick}
        noteId={this.props.activeNoteId}
      />
    );
  }
}

// Export the Note component
module.exports = Note;