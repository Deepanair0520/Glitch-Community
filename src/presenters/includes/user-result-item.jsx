import React from 'react';
import PropTypes from 'prop-types';

import randomColor from 'randomcolor';
import {ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName} from '../../models/user';
import {ThanksShort} from './thanks.jsx';

const UserResultItem = ({user, action}) => {
  const name = getDisplayName(user);
  const {login, thanksCount} = user;
  
  const handleClick = (event) => {
    console.log('💣');
    action(event);
  };

  return (
    <button onClick={handleClick} className="button-unstyled result">
      <img className="avatar" src={getAvatarThumbnailUrl(user)} alt=""/>
      <div className="result-name" title={name}>{name}</div>
      {!!user.name && <div className="result-description" title={login}>@{login}</div>}
      {thanksCount > 0 && <ThanksShort count={thanksCount} />}
    </button>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};


export default UserResultItem;


export class InviteByEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: randomColor({luminosity: 'light'})};
  }
  
  render() {
    const style = {backgroundColor: this.state.color};
    return (
      <button onClick={this.props.onClick} className="button-unstyled result">
        <img className="avatar" src={ANON_AVATAR_URL} style={style} alt=""/>
        <div className="result-name">Invite {this.props.email}</div>
      </button>
    );
  }
}

InviteByEmail.propTypes = {
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const WhitelistEmailDomain = ({domain, onClick}) => (
  <button onClick={onClick} className="button-unstyled result">
    <div className="avatar whitelisted-domain">{domain[0].toUpperCase()}</div>
    <div className="result-name">Allow anyone with an @{domain} email to join</div>
  </button>
);

WhitelistEmailDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};