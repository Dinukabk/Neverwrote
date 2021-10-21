const React = require('react');
const ReactRedux = require('react-redux');
const _ = require('lodash');

const statisticsActionCreators = require("../reducers/statistics");
const createActionDispatchers = require('../helpers/createActionDispatchers');

/**
 * A list of blog notebooks, along with buttons for writing a new notebook
 * and loading more notebooks.
 */
class Statistics extends React.Component {
  constructor(props) {
    super(props);
    // Set initial internal state for this component
  }

  componentDidMount() {
    this.props.loadStatistics(() => {
      
    });
  }
  render() {
    const updateStatistics = () => {
      this.props.loadStatistics(() => {
        //
      });
    }
    return(
      <div className="row">
        <div className="bg-warning stats">
          <h2 className="card-title text-center"><b>Statistics</b></h2>
          <div className="row col-sm-6">
            <div className="col-xs-6">
            Notebooks Count
            </div>
            <div className="col-xs-6">
              {this.props.data.stats.notebookCount}
            </div>
            <div className="col-xs-6">
            Notes Count
            </div>
            <div className="col-xs-6">
            {this.props.data.stats.noteCount}
            </div>
          </div>

          <div className="row col-sm-6">
            <div className="col-xs-6">
            Oldest Notebook
            </div>
            <div className="col-xs-6">
            {this.props.data.stats.oldestNotebook}
            </div>
            <div className="col-xs-6">
            Newest Note
            </div>
            <div className="col-xs-6">
            {this.props.data.stats.recentlyUpdatedNote}
            </div>
          </div>
          
          <div className="col-sm-offset-10">
            <a onClick={updateStatistics} className="btn btn-primary text-right">Refresh</a>
          </div>
        </div>
      </div>
    );
  }
}

// Connect NotebookList component to the Redux store
const StatisticsContainer = ReactRedux.connect(
  // Map store state to props
  (state) => ({
    data: state.statistics,
    time: state.time,
  }),
  createActionDispatchers(statisticsActionCreators)
)(Statistics);
  
module.exports = StatisticsContainer;
  