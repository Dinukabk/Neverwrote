const React = require('react');

const NotebookEdit = require('./NotebookEdit');
const NotebookView = require('./NotebookView');


class Notebook extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
    this.state = { 
      editing: false 
    };
  }

  render() {
    const openEdit = () => {
      this.setState({ editing: true });
    };

    const closeEdit = () => {
      this.setState({ editing: false });
    };

    const saveEdit = (editedNotebook) => {
      this.props.saveNotebook(editedNotebook, (err) => {
        if (! err) {
          closeEdit();
        }
      });
    };

    // TODO Task 7: Add code for delete
    const deleteThisNotebook = () => {
      this.props.deleteNotebook(this.props.notebook.id);
    };

    const setActive = () => {
      this.props.fetchNotes(this.props.notebook.id);
    }

    if (this.state.editing) {
      // Render component for editing the notebook
      return (
        <NotebookEdit
          notebook={this.props.notebook}
          onSave={saveEdit}
          onCancel={closeEdit}
        />
      );
    }
    // Render read-only view of the notebook
    // TODO Task 7: add code for delete
    return (
      <NotebookView
        notebook={this.props.notebook}
        time={this.props.time}
        onDelete={deleteThisNotebook}
        onEdit={openEdit}
        clickNotebook={setActive}
        activeNoteBookId={this.props.activeNotebookId}
      />
    );
  }
}

// Export the Notebook component
module.exports = Notebook;