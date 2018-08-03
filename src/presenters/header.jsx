/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import {getLink} from '../models/user';

import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import NewStuffContainer from './overlays/new-stuff.jsx';
import {CurrentUserConsumer} from './current-user.jsx';

const Logo = () => {
  const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
  const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
  const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";

  let logo = LOGO_DAY;
  const hour = (new Date()).getHours();
  if ((hour >= 16) && (hour <= 18)) {
    logo = LOGO_SUNSET;
  } else if ((hour > 18) || (hour <= 8)) {
    logo = LOGO_NIGHT;
  }

  return <img className="logo" src={logo} alt="Glitch" />;
};

const ResumeCoding = () => (
  <a className="button button-small button-cta" href={EDITOR_URL} data-track="resume coding">
    <div className="">Resume Coding</div>
  </a>
);

const submitSearch = (event) => {
  if (event.target.children.q.value.trim().length === 0) {
    return event.preventDefault();
  }
};

const SearchForm = ({onSubmit, defaultValue}) => (
  <form action="/search" method="get" role="search" onSubmit={onSubmit}>
    <input className="search-input" name="q" placeholder="bots, apps, users" defaultValue={defaultValue}/>
  </form>
);

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

const UserOptionsPopWrapper = ({user, showNewStuffOverlay}) => {
  const props = {
    teams: user.teams,
    userLink: getLink(user),
    avatarUrl: user.avatarUrl,
    avatarStyle: {backgroundColor: user.color},
    showNewStuffOverlay,
  };

  return <UserOptionsPop {...props}/>;
};

UserOptionsPopWrapper.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    login: PropTypes.string,
  }).isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

const Header = ({maybeUser, searchQuery, showNewStuffOverlay}) => {
  const signedIn = maybeUser && !!maybeUser.login;
  return (
    <header role="banner">
      <div className="header-info">
        <a href="/">
          <Logo/>
        </a>
      </div>
     
      <nav>
        <SearchForm onSubmit={submitSearch} defaultValue={searchQuery}/>
        <NewProjectPop/>
        <ResumeCoding/>
        { !signedIn && <SignInPop/> }
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} showNewStuffOverlay={showNewStuffOverlay} />}
      </nav>
    </header>
  );
};

Header.propTypes = {
  maybeUser: PropTypes.object,
};

const HeaderContainer = ({getUserPref, setUserPref, ...props}) => (
  <CurrentUserConsumer>
    {user => (
      <NewStuffContainer
        isSignedIn={!!user && !!user.login}
        getUserPref={getUserPref} setUserPref={setUserPref}
      >
        {showNewStuffOverlay => (
          <Header {...props} maybeUser={user} showNewStuffOverlay={showNewStuffOverlay}/>
        )}
      </NewStuffContainer>
    )}
  </CurrentUserConsumer>
);

export default HeaderContainer;
