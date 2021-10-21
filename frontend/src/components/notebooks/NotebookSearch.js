const React = require('react');
class NotebookSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText : "" 
    };
    // Set initial internal state for this component
  }
  render() {
    const onSearchChange = (event) => {
      this.setState({ searchText: event.target.value });
    };

    const onSearchSubmit = (event) => {
      event.preventDefault();
      this.props.searchNotebookChange(this.state.searchText);
    }

    const onAllSearchSubmit = (event) => {
      event.preventDefault();
      this.props.searchAll(this.state.searchText);
    }

    return (
      <form className="form-inline">
        <div className="form-group">
            <input onChange={onSearchChange} type="text" className="form-control" placeholder="Notebook" />
        </div>
        <button onClick={onSearchSubmit} type="submit" className="btn btn-info mb-2">NoteBook Search</button>
        { /* <button onClick={onAllSearchSubmit} type="submit" className="btn btn-info mb-2">NoteBook and Note Search</button> */ }
      </form>
    );
  }
}
module.exports = NotebookSearch;