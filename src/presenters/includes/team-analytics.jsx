import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../includes/loader.jsx';

import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx'

// import AnalyticsTimePop from './pop-overs/analytics-time-pop.jsx';
// import AnalyticsProjectPop from './pop-overs/analytics-project-pop.jsx';

// unused yet
// const timeFrames = [
//   "Last 4 Weeks",
//   "Last 2 Weeks",
//   "Last 24 Hours",
// ]

const getAnalytics = async ({id, api}) => {
  let path = `analytics/${id}/team`
  try {
    return await api().get(path)     
  } catch (error) {
    console.error('getAnalytics', error)
  }
}

// Controls
// Activity (TeamAnalyticsActivity)
// Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      currentTimeFrame: 'Last 2 Weeks',
      projects: 'All Projects',
      analytics: [],
      isLoading: true,
    }
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime
    })
  }
  
  updateAnalytics() {
    this.setState({
      isLoading: true,
    })
    getAnalytics(this.props)
    .then(({data}) => {
      this.setState({
        isLoading: false,
        analytics: data,
      });
      console.log('🚒', this.state, this.state.analytics)
    })
  }
  
  componentDidMount() {
    // loading c3 lib here?
    this.updateAnalytics()
  }

  render() {
    return (
      <section>
        <p>i am team analytics</p>
        <p>{this.state.currentTimeFrame}</p>
        <TeamAnalyticsTimePop 
          updateTimeFrame = {this.updateTimeFrame.bind(this)}
          currentTimeFrame = {this.state.currentTimeFrame}
        />
      </section>
    );
  }
}


TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
};


export default TeamAnalytics;
