const React = require('react');

/**
 * A markdown editor. Markdown is a very simple language for formatting
 * text that can be converted into HTML.
 */
class MarkdownEditor extends React.Component {
  componentDidMount() {
    // SimpleMDE must be required here since it's browser-only.
    const SimpleMDE = require('simplemde');

    // Turn our plain old text area into a beautiful markdown editor
    this.simpleMDE = new SimpleMDE({
      indentWithTabs: false,
      status: false,
      autoDownloadFontAwesome: false,
      element: this.textarea
    });

    // Put initial text in the editor
    this.simpleMDE.value(this.props.value);

    // Listen for changes and fire a callback
    this.simpleMDE.codemirror.on('change', () => {
      const newText = this.simpleMDE.value();
      if(newText !== this.props.value) {
        this.props.onChange({ target: { value: newText } });
      }
    });
  }

  componentDidUpdate() {
    // Replace the text in the editor, preserving the cursor position and
    // selection info
    const selections = this.simpleMDE.codemirror.listSelections();
    this.simpleMDE.value(this.props.value);
    this.simpleMDE.codemirror.setSelections(selections);
  }

  // Describe how to render the component
  render() {
    const ref = (element) => { this.textarea = element; };
    return (
      <textarea ref={ref} />
    );
  }
}

// Export the component so that it can be required
module.exports = MarkdownEditor;
