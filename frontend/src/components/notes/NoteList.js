const React = require('react');
const ReactRedux = require('react-redux');
const _ = require('lodash');

const notesActionCreators = require('../../reducers/notes');
const createActionDispatchers = require('../../helpers/createActionDispatchers');

const Note = require('./Note');
const NoteNew = require('./NoteNew');
/**
 * A list of blog notes, along with buttons for writing a new note
 * and loading more notes.
 */
class NoteList extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
  }
  
  render() {
    // Function which creates a note component from a note ID
    const createNoteComponent = (note) => {
      /* TODO Task 7: Add code for delete */
      return (
        <Note
          key={note.id}
          note={note}
          time={this.props.time}
          saveNote={this.props.saveNote}
          deleteNote={this.props.deleteNote}
          notebookId={this.props.notebooks.activeId} 
          onNoteClick={this.props.activateNodeFunc}
          activeNoteId={this.props.notes.activeNoteId}
        />
      );
    };
    return (
      <div className="list-group">
        {/* Button for writing a new note */}
        { this.props.notebooks.activeId && 
          <div>
              <NoteNew 
                createNote={this.props.createNote} 
                notebookId={this.props.notebooks.activeId} 
              />
            {
              this.props.notebooks.visibleNotes.length > 0 ? 
                this.props.notebooks.visibleNotes.map(createNoteComponent) :
                "No Notes Found"
            }
          </div>
        }
      </div>
    );
  }
}

// Connect NoteList component to the Redux store
const NoteListContainer = ReactRedux.connect(
  // Map store state to props
  (state) => ({
    notebooks: state.notebooks,
    notes: state.notes,
    time: state.time
  }),
  createActionDispatchers(notesActionCreators)
)(NoteList);

module.exports = NoteListContainer;