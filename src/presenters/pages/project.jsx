/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';

import {DataLoader} from '../includes/loader.jsx';
import NotFound from '../includes/not-found.jsx';
import {Markdown} from '../includes/markdown.jsx';
import EntityEditor from '../entity-editor.jsx';
import Expander from '../includes/expander.jsx';
import EditableField from '../includes/editable-field.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import {InfoContainer, ProjectInfoContainer} from '../includes/profile.jsx';
import {ShowButton, EditButton, RemixButton, ReportButton} from '../includes/project-buttons.jsx';
import UsersList from '../users-list.jsx';
import RelatedProjects from '../includes/related-projects.jsx';

import LayoutPresenter from '../layout';
import Reactlet from '../reactlet';

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

const PrivateTooltip = "Only members can view code";
const PublicTooltip = "Visible to everyone";

const PrivateBadge = () => (
  <span className="private-project-badge" aria-label={PrivateTooltip} data-tooltip={PrivateTooltip}></span>
);

const PrivateToggle = ({isPrivate, setPrivate}) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = "button-tertiary button-on-secondary-background project-badge";
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';
  return (
    <span data-tooltip={tooltip}>
      <button aria-label={tooltip}
        onClick={() => setPrivate(!isPrivate)}
        className={`${classBase} ${className}`}
      />
    </span>
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const Embed = ({domain}) => (
  <div className="glitch-embed-wrap">
    <iframe title="embed" src={`https://glitch.com/embed/#!/embed/${domain}?path=README.md&previewSize=100`}></iframe>
  </div>
);
Embed.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ReadmeError = (error) => (
  (error && error.response && error.response.status === 404)
    ? <React.Fragment>This project would be even better with a <code>README.md</code></React.Fragment>
    : <React.Fragment>We couldn't load the readme. Try refreshing?</React.Fragment>
);
const ReadmeLoader = ({getReadme}) => (
  <DataLoader get={getReadme} renderError={ReadmeError}>
    {readme => <Expander height={200}><Markdown>{readme}</Markdown></Expander>}
  </DataLoader>
);
ReadmeLoader.propTypes = {
  getReadme: PropTypes.func.isRequired,
};

const ProjectPage = ({
  project: {
    avatar, description, domain, id,
    userIsCurrentUser, users, teams,
    ...project // 'private' can't be used as a variable name
  },
  getReadme,
  getTeam, getTeamPins,
  getUser, getUserPins,
  getProjects,
  updateDomain,
  updateDescription,
  updatePrivate,
}) => (
  <main className="project-page">
    <section id="info">
      <InfoContainer>
        <ProjectInfoContainer style={{backgroundImage: `url('${avatar}')`}}>
          <h1>
            {(userIsCurrentUser
              ? <EditableField value={domain} update={updateDomain} placeholder="Name your project"/>
              : <React.Fragment>{domain} {project.private && <PrivateBadge/>}</React.Fragment>
            )}
          </h1>
          {(userIsCurrentUser &&
            <div>
              <PrivateToggle isPrivate={project.private} isMember={userIsCurrentUser} setPrivate={updatePrivate}/>
            </div>
          )}
          <UsersList users={users} />
          <AuthDescription
            authorized={userIsCurrentUser} description={description}
            update={updateDescription} placeholder="Tell us about your app"
          />
          <p className="buttons">
            <ShowButton name={domain}/>
            <EditButton name={domain} isMember={userIsCurrentUser}/>
          </p>
        </ProjectInfoContainer>
      </InfoContainer>
    </section>
    <section id="embed">
      <Embed domain={domain}/>
      <div className="buttons buttons-right">
        <RemixButton className="button-small"
          name={domain} isMember={userIsCurrentUser}
          onClick={() => trackRemix(id, domain)}
        />
      </div>
    </section>
    <section id="readme">
      <ReadmeLoader getReadme={getReadme}/>
    </section>
    <section id="related">
      <RelatedProjects ignoreProjectId={id} {...{teams, users, getTeam, getTeamPins, getUser, getUserPins, getProjects}}/>
    </section>
    <section id="feedback" className="buttons buttons-right">
      <ReportButton name={domain} id={id} className="button-small button-tertiary"/>
    </section>
  </main>
);
ProjectPage.propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectPageEditor = ({project, updateFields, ...props}) => {
  function updateDomain(domain) {
    return updateFields({domain}).then(() => {
      history.replaceState(null, null, `/~${domain}`);
      document.title = `~${domain}`;
    }, ({response: {data: {message}}}) => Promise.reject(message));
  }
  const funcs = {
    updateDomain: domain => updateDomain(domain),
    updateDescription: description => updateFields({description}),
    updatePrivate: isPrivate => updateFields({private: isPrivate}),
  };
  return <ProjectPage project={project} {...funcs} {...props}/>;
};
ProjectPageEditor.propTypes = {
  project: PropTypes.object.isRequired,
  updateFields: PropTypes.func.isRequired,
};

const ProjectPageLoader = ({name, get, api, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={name}/>}>
    {project => project ? (
      <EntityEditor api={api} initial={project} type="projects">
        {({entity, ...funcs}) => <ProjectPageEditor project={entity} {...funcs} {...props}/>}
      </EntityEditor>
    ) : <NotFound name={name}/>}
  </DataLoader>
);
ProjectPageLoader.propTypes = {
  name: PropTypes.string.isRequired,
};

// Let's keep layout in jade until all pages are react
export default function(application, name) {
  const props = {
    api: application.api(),
    get: () => application.api().get(`projects/${name}`).then(({data}) => (data ? Project(data).update(data).asProps() : null)),
    getReadme: () => application.api().get(`projects/${name}/readme`).then(({data}) => data),
    getTeam: (id) => application.api().get(`teams/${id}`).then(({data}) => data),
    getTeamPins: (id) => application.api().get(`teams/${id}/pinned-projects`).then(({data}) => data),
    getUser: (id) => application.api().get(`users/${id}`).then(({data}) => data),
    getUserPins: (id) => application.api().get(`users/${id}/pinned-projects`).then(({data}) => data),
    getProjects: (ids) => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => Project(d).update(d).asProps())),
    name,
  };
  const content = Reactlet(ProjectPageLoader, props, 'projectpage');
  return LayoutPresenter(application, content);
}
