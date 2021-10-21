const React = require('react');
const _ = require('lodash');
const MarkdownEditor = require("../MarkdownEditor");

/**
 * A form for editing a blog notebook.
 */
class NotebookEdit extends React.Component {
  constructor(props) {
    super(props);
    const notebook = props.notebook || {};
    this.state = {
      title: notebook.title || ''
    };
  }

  render() {
    const revertAndStopEditing = (event) => {
      event.preventDefault();
      this.props.onCancel();
    };

    const submitAndStopEditing = (event) => {
      event.preventDefault();
      // Creates a new notebook object and saves it.
      const editedNotebook = _.assign({}, this.props.notebook, {
        title: this.state.title,
      });
      this.props.onSave(editedNotebook);
    };

    const onTitleChange = (event) => {
      this.setState({ title: event.target.value });
    };

    const onContentChange = (event) => {
      this.setState({ content: event.target.value });
    };

    return (
      <form className="form">
        <div className="form-group">
          <MarkdownEditor
            value={this.state.title} 
            onChange={onTitleChange} 
          />
        </div>
        <div className="btn-group mr-2">
          {/* Save button */}
          <button 
            className="btn btn-primary mb-2"
            onClick={submitAndStopEditing}
          >Save</button>
        </div>
        <div className="btn-group mr-2">
          {/* Cancel button */}
          <button 
            className="btn btn-default mb-2"
            onClick={revertAndStopEditing}
          >Cancel</button>
        </div>
      </form>
    );
  }
}
module.exports = NotebookEdit;