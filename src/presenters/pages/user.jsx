import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from "../reactlet";

import ProjectModel from '../../models/project';
import {getAvatarStyle, getProfileStyle} from '../../models/user';
import * as assets from '../../utils/assets';

import {DataLoader} from '../includes/loader.jsx';
import Uploader from '../includes/uploader.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import EditableField from '../includes/editable-field.jsx';
import EntityEditor from '../entity-editor.jsx';
import Thanks from '../includes/thanks.jsx';

import DeletedProjects from '../deleted-projects.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import NotFound from '../includes/not-found.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';

const NameAndLogin = ({name, login, id, isAuthorized, updateName, updateLogin}) => {
  if(!login) {
    // Just an ID? We're anonymous.
    return <h1 className="login">@{id}</h1>;
  }
  
  if(!isAuthorized) {
    if(!name) {
      //promote login to an h1.
      return <h1 className="login">@{login}</h1>;
    }
    return (
      <React.Fragment>
        <h1 className="username">{name}</h1>
        <h2 className="login">@{login}</h2>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h1 className="username"><EditableField value={name||""} update={updateName} placeholder='Display name?'/></h1>
      <h2 className="login"><EditableField value={login} update={updateLogin} prefix="@" placeholder='User ID?'/></h2>
    </React.Fragment>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  id: PropTypes.number.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func,
  updateLogin: PropTypes.func,
};

const UserPage = ({
  user: { //has science gone too far?
    id, login, name, description, thanksCount,
    avatarUrl, color,
    hasCoverImage, coverColor,
    pins, projects, deletedProjects,
  },
  isAuthorized,
  updateDescription,
  updateName, updateLogin,
  uploadCover, clearCover,
  uploadAvatar,
  addPin, removePin,
  leaveProject,
  deleteProject, undeleteProject,
  getProjects, getDeletedProjects,
  _cacheCover,
}) => (
  <main className="profile-page user-page">
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({avatarUrl, color})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        coverButtons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
        avatarButtons={isAuthorized ? <ImageButtons name="Avatar" uploadImage={uploadAvatar} /> : null }
      >
        <NameAndLogin {...{name, login, id, isAuthorized, updateName, updateLogin}}/>
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </ProfileContainer>
    </section>
    <EntityPageProjects
      projects={projects} pins={pins} isAuthorized={isAuthorized}
      addPin={addPin} removePin={removePin}
      projectOptions={{leaveProject, deleteProject}}
      getProjects={getProjects}
    />
    {isAuthorized && <DeletedProjects get={getDeletedProjects} undelete={undeleteProject} projects={projects} deletedProjects={deletedProjects}/>}
  </main>
);
UserPage.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
  }).isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  leaveProject: PropTypes.func.isRequired,
  _cacheCover: PropTypes.number.isRequired,
};

class UserPageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _cacheCover: Date.now(),
    };
  }
  
  updateName(name) {
    return this.props.updateFields({name}).then(() => {
      this.props.currentUserModel.name(name);
    }, ({response: {data: {message}}}) => Promise.reject(message)
    );
  }
  
  updateLogin(login) {
    return this.props.updateFields({login}).then(() => {
      history.replaceState(null, null, `/@${login}`);
      document.title = `@${login}`;
      this.props.currentUserModel.login(login);
    }, ({response: {data: {message}}}) => Promise.reject(message));
  }
  
  async uploadAvatar(blob) {
    try {
      const {id} = this.props.user;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
      const url = await this.props.uploadAsset(blob, policy, 'temporary-user-avatar');

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        avatarUrl: url,
        color: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.props.currentUserModel.avatarUrl(this.props.user.avatarUrl);
    this.props.currentUserModel.avatarThumbnailUrl(this.props.user.avatarThumbnailUrl);
  }
  
  async uploadCover(blob) {
    try {
      const {id} = this.props.user;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasCoverImage: true,
        coverColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheCover: Date.now()});
  }
  
  async leaveProject(id) {
    await this.props.api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: this.props.user.id,
      },
    });
    this.props.localRemoveItem('projects', {id});
  }
  
  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    this.props.localRemoveItem('projects', {id});
    const {data} = await this.props.api.get(`projects/${id}?showDeleted=true`);
    this.props.localAddItem('deletedProjects', data);
  }
  
  async undeleteProject(id, domain) {
    await this.props.api.post(`/projects/${id}/undelete`);
    if (domain.endsWith('-deleted')) {
      try {
        const newDomain = domain.replace(/-deleted$/, '');
        await this.props.api.patch(`/projects/${id}`, {
          domain: newDomain,
        });
        domain = newDomain;
      } catch (e) {
        console.warn(e);
      }
    }
    this.props.localRemoveItem('deletedProjects', {id});
    this.props.localAddItem('projects', {id, domain});
  }
  
  render() {
    const {
      user,
      currentUserId,
      updateFields,
      addItem,
      removeItem,
      ...props
    } = this.props;
    const funcs = {
      isAuthorized: user.id === currentUserId,
      updateName: name => this.updateName(name),
      updateLogin: login => this.updateLogin(login),
      updateDescription: description => updateFields({description}),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => updateFields({hasCoverImage: false}),
      addPin: projectId => addItem('pinned-projects', projectId, 'pins', {projectId}),
      removePin: projectId => removeItem('pinned-projects', projectId, 'pins', {projectId}),
      leaveProject: id => this.leaveProject(id),
      deleteProject: id => this.deleteProject(id),
      undeleteProject: (id, domain) => this.undeleteProject(id, domain),
    };
    return <UserPage user={user} {...this.state} {...funcs} {...props}/>;
  }
}

const UserPageLoader = ({api, get, loginOrId, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={loginOrId}/>}>
    {user => user ? (
      <EntityEditor api={api} initial={{...user, deletedProjects: []}} type="users">
        {({entity, ...editFuncs}) => (
          <Uploader>
            {({...uploadFuncs}) => (
              <UserPageEditor user={entity} api={api} {...editFuncs} {...uploadFuncs} {...props}/>
            )}
          </Uploader>
        )}
      </EntityEditor>
    ) : <NotFound name={loginOrId}/>}
  </DataLoader>
);
UserPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  loginOrId: PropTypes.node.isRequired,
};

function UserPagePresenter(application, loginOrId, get) {
  const props = {
    loginOrId, get,
    api: application.api(),
    currentUserId: application.currentUser().id(),
    currentUserModel: application.currentUser(),
    getProjects: ids => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
    getDeletedProjects: () => application.api().get(`user/deleted-projects`),
  };
  const content = Reactlet(UserPageLoader, props, 'userpage');
  return LayoutPresenter(application, content);
}

async function getUserById(api, id) {
  const {data} = await api.get(`users/${id}`);
  console.log(data);
  return data;
}

async function getUserByLogin(api, login) {
  const {data} = await api.get(`userId/byLogin/${login}`);
  return await getUserById(api, data);
}

export function UserPageById(application, id) {
  const get = () => getUserById(application.api(), id);
  return UserPagePresenter(application, id, get);
}

export function UserPageByLogin(application, login) {
  const get = () => getUserByLogin(application.api(), login);
  return UserPagePresenter(application, login, get);
}