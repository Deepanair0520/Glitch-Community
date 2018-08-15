import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import UserResultItem, {InviteByEmail, WhitelistEmailDomain} from '../includes/user-result-item.jsx';


class AddTeamUserPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      query: '', //The actual search text
      maybeRequest: null, //The active request promise
      maybeResults: null, //Null means still waiting vs empty -- [jude: i suggest the 'maybe' convention for nullable fields with meaning.  'maybeResults'] --greg: i like it
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trimStart();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
    });
  }
  
  async startSearch() {
    const query = this.state.query.trim();
    if (!query) {
      return this.clearSearch();
    }
    
    const request = this.props.api.get(`users/search?q=${query}`);
    this.setState({ maybeRequest: request });
    
    const {data} = await request;
    const results = data.map(user => UserModel(user).asProps());
    const nonMemberResults = results.filter(user => !this.props.members.includes(user.id));
    
    this.setState(({ maybeRequest }) => {
      return (request === maybeRequest) ? {
        maybeRequest: null,
        maybeResults: nonMemberResults.slice(0, 5),
      } : {};
    });
  }
  
  togglePopoverAnd(func, ...params) {
    this.props.togglePopover();
    func(...params);
  }
  
  render() {
    const {inviteEmail, inviteUser, setWhitelistedDomain} = this.props;
    const {maybeRequest, maybeResults, query} = this.state;
    const isLoading = (!!maybeRequest || !maybeResults);
    const results = [];
    // this regex is basically (a)?@(b.c)
    // any match means we have a valid domain in group 2
    // group 1 is optional, but its presence means we have a full email
    const emailChars = '[^@\\s\\:/\\\\]+'; //escaping characters is gross
    const emailRegExp = new RegExp(`^(${emailChars})?@(${emailChars}\\.${emailChars})$`);
    const emailMatch = emailRegExp.exec(query);
    if (emailMatch) {
      const [email, name, domain] = emailMatch;
      if (name && email) {
        results.push({
          key: 'invite-by-email',
          item: <InviteByEmail email={email} onClick={() => this.togglePopoverAnd(inviteEmail, email)}/>,
        });
      }
      const prevDomain = this.props.whitelistedDomain;
      if (domain && setWhitelistedDomain && prevDomain !== domain) {
        results.push({
          key: 'whitelist-email-domain',
          item: <WhitelistEmailDomain domain={domain} prevDomain={prevDomain} onClick={() => this.togglePopoverAnd(setWhitelistedDomain, domain)}/>,
        });
      }
    }
    // now add the actual search results
    if (maybeResults) {
      results.push(...maybeResults.map(user => ({
        key: user.id,
        item: <UserResultItem user={user} action={() => this.togglePopoverAnd(inviteUser, user)} />
      })));
    }
    return (
      <dialog className="pop-over add-team-user-pop">
        <section className="pop-over-info">
          <input id="team-user-search"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search for a user or email"
          />
        </section>
        {query ? (
          <section className="pop-over-actions last-section results-list">
            {results.length ? (
              <ul className="results">
                {results.map(({key, item}) => <li key={key}>{item}</li>)}
              </ul>
            ) : (maybeResults &&
              <p className="results-empty">nothing found <span role="img" aria-label="">💫</span></p>
            )}
            {isLoading && <Loader />}
          </section>
        ) : (
          <aside className="pop-over-info">
            You can also whitelist with @example.com
          </aside>
        )}
      </dialog>
    );
  }
}
AddTeamUserPop.propTypes = {
  api: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setWhitelistedDomain: PropTypes.func,
  whitelistedDomain: PropTypes.string,
  togglePopover: PropTypes.func.isRequired,
};

export default AddTeamUserPop;