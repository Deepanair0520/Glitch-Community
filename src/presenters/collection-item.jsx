import React from 'react';
import PropTypes from 'prop-types';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectOptionsContainer from "./pop-overs/project-options-pop.jsx";
import UsersList from "./users-list.jsx";

import Loader, {DataLoader} from '../includes/loader.jsx';
import {getAvatarUrl, getLink} from '../models/project.js';

const colors = ["rgba(84,248,214,0.40)", "rgba(229,229,229,0.40)", "rgba(255,163,187,0.40)", "rgba(251,160,88,0.40)", "rgba(252,243,175,0.40)", "rgba(48,220,166,0.40)", 
               "rgba(103,190,255,0.40)", "rgba(201,191,244,0.40)"];

const ProjectsPreview = ({projects, projectOptions, categoryColor}) => {
  return (
    <div className="projects-preview" projects={projects}>
      { projects.map(project => (
        <div className="project-container">
          <img className="avatar" src={getAvatarUrl(project.id)}/>
          <div className="project-name">{project.domain}</div>
        </div>
      )) };
    </div>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired
};


export const CollectionItem = ({collection, categoryColor, projectOptions, api}) => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <li>
      {/* <UsersList glitchTeam={project.showAsGlitchTeam} users={project.users} extraClass="single-line"/> */}
      <ProjectOptionsContainer collection={collection} projectOptions={projectOptions}></ProjectOptionsContainer>

        <div className={['collection']} 
          style={{backgroundColor: collection.backgroundColor, borderBottomColor:collection.backgroundColor}}>
          <div className="collection-container">
            
            <div className="collection-info">
              <img className="avatar" src={collection.avatarUrl}/>
              <div className="collection-name-description">
                <div className="button helloWorld">
                  <span className="project-badge private-project-badge" aria-label="private"></span>
                  <div className="project-name">{collection.name}</div>
                </div>
                <div className="description"><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
              </div>
              
              <div className="overflow-mask"></div>
            </div>
            
            {/* LOAD PROJECTS IN COLLECTION HERE */}
            <DataLoader
              get={() => loadCategory(api, collection.id)}
              renderLoader={() => <Loader />}
               renderError={() => <div>Something went wrong. Try refreshing?</div>}
            >
              {category => (
                <ProjectsLoader api={api} projects={category.projects}>
                    {projects => <ProjectsPreview projects={category.projects} categoryColor={category.color}/>}
                </ProjectsLoader>
              )}
            </DataLoader>
            
            
            
            {/* DUMMY PROJECTS DATA */}
            <div className="projects-preview">
              <div className="project-container">
                <img className="avatar" src={collection.avatarUrl}/>
                <div className="project-name">{collection.name}</div>
              </div>

              <div className="project-container">
                <img className="avatar" src={collection.avatarUrl}/>
                <div className="project-name">{collection.name}</div>
              </div>

              <div className="project-container">
                <img className="avatar" src={collection.avatarUrl}/>
                <div className="project-name">{collection.name}</div>
              </div>

            </div>
            
            <div className="collection-link">
              <a href="#">
                View all {Math.floor(Math.random() * 10)+3} projects →
              </a>            
            </div>
            
          </div>
        </div>
    </li>
  );
};

CollectionItem.propTypes = {
  api: PropTypes.func.isRequired,
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool.isRequired,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  categoryColor: PropTypes.string,
  projectOptions: PropTypes.object,
};

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  return data;
}

export default CollectionItem;