const React = require('react');
const ReactRedux = require('react-redux');
const _ = require('lodash');

const notebooksActionCreators = require('../../reducers/notebooks');
const createActionDispatchers = require('../../helpers/createActionDispatchers');

const Notebook = require('./Notebook');
const NotebookNew = require('./NotebookNew');
const NotebookSearch = require('./NotebookSearch');

/**
 * A list of blog notebooks, along with buttons for writing a new notebook
 * and loading more notebooks.
 */
class NotebookList extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
    this.state = { };
  }
  componentDidMount() {
    this.props.loadNotebooks(() => {
      //
    });
  }

  render() {
    console.log(this.props);
    // Function which creates a notebook component from a notebook ID
    const createNotebookComponent = (currentNotebook) => {
      /* TODO Task 7: Add code for delete */
      return (
        <Notebook
          key={currentNotebook.id}
          notebook={currentNotebook}
          time={this.props.time}
          saveNotebook={this.props.saveNotebook}
          deleteNotebook={this.props.deleteNotebook}
          fetchNotes={this.props.loadNotes}
          activeNotebookId={this.props.notebooks.activeId}
        />
      );
    };
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 text-left">
            <NotebookSearch 
              searchNotebookChange={this.props.searchNotebookChange} 
            />
          </div>
          <div className="col-sm-12 text-right">
            <NotebookNew
              createNotebook={this.props.createNotebook}
            />
          </div>
        </div>
        <div className="row">
          <div className="list-group">
            { this.props.notebooks.visibleNotebooks.map(createNotebookComponent) }  
          </div>
        </div>
      </div>
    );
  }
}

// Connect NotebookList component to the Redux store
const NotebookListContainer = ReactRedux.connect(
  // Map store state to props
  (state) => ({
    notebooks: state.notebooks,
    notes: state.notes,
    time: state.time
  }),
  createActionDispatchers(notebooksActionCreators)
)(NotebookList);

module.exports = NotebookListContainer;
