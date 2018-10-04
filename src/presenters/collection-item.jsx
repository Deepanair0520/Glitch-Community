import React from 'react';
import PropTypes from 'prop-types';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import ProjectModel from '../models/project';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import UsersList from "./users-list.jsx";

import Loader, {DataLoader} from './includes/loader.jsx';
import ProjectsLoader from './projects-loader.jsx';

import {getAvatarUrl, getLink} from '../models/project.js';

const colors = ["rgba(84,248,214,0.40)", "rgba(229,229,229,0.40)", "rgba(255,163,187,0.40)", "rgba(251,160,88,0.40)", "rgba(252,243,175,0.40)", "rgba(48,220,166,0.40)", 
  "rgba(103,190,255,0.40)", "rgba(201,191,244,0.40)"];

// SOME DUMMY DEFAULT STUFF
const defaultUrl = "/favorites";
const defaultName = "My Favorite Projects";

const ProjectsPreview = ({projects, categoryColor, collectionUrl}) => {
  return (
    <React.Fragment>
      <div className="projects-preview" projects={projects}>
        { projects.slice(0,3).map(project => (
          <div className="project-container">
            <img className="avatar" src={getAvatarUrl(project.id)}/>
            <div className="project-name">{project.domain}</div>
          </div>
        )) }
      </div>
      <div className="collection-link">
        <a href={collectionUrl}>
          View {projects.length} {(projects.length > 0 ? 'projects' : 'project')} →
        </a>            
      </div>
    </React.Fragment>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
  collectionUrl: PropTypes.string.isRequired,
};


export const CollectionItem = ({collection, categoryColor, deleteCollection, api, isAuthorized}) => {
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <li>
      <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>

      <a href={collection ? collection.url : defaultUrl}>
        <div className={['collection']} 
          style={(collection ? {backgroundColor: collection.backgroundColor, borderBottomColor:collection.backgroundColor} : null)}>
          <div className="collection-container">

              <div className="collection-info">
                <img className="avatar" src={collection ? collection.avatarUrl : "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg?1489265199230"}/>
                <div className="collection-name-description">
                    <div className="button">
                      <span className="project-badge private-project-badge" aria-label="private"></span>
                      <div className="project-name">{collection ? collection.name : defaultName}</div>
                    </div>
                  <div className="description"><TruncatedMarkdown length={96}>{collection ? collection.description : "A collection of projects that does wondrous things"}</TruncatedMarkdown></div>
                </div>

                <div className="overflow-mask"></div>
              </div>

            {collection
              ? <DataLoader
                get={() => loadCollection(api, collection.id)}
                renderLoader={() => <Loader />}
                renderError={() => <div>Something went wrong. Try refreshing?</div>}
                >
                  {collection => (
                    collection.projects.length > 0
                      ?
                      <ProjectsLoader api={api} projects={collection.projects}>
                        {projects => <ProjectsPreview projects={collection.projects} categoryColor={collection.color} collectionUrl={collection.url}/>}
                      </ProjectsLoader>
                     :
                     <div className="projects-preview empty">
                        {(isAuthorized
                          ? <a href={defaultUrl}>This collection is empty.  Add some projects to it!</a>
                          : "No projects to see in this collection just yet."
                        )}
                      </div>
                  )}
              </DataLoader>   

              :  <div className="projects-preview empty">
                {(isAuthorized
                  ? <a href={defaultUrl}>This collection is empty.  Add some projects to it!</a>
                  : "No projects to see in this collection just yet."
                )}
              </div>
            }
          </div>
        </div>
      </a>
    </li>
  );
};

CollectionItem.propTypes = {
  api: PropTypes.func.isRequired,
  categoryColor: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func
};

async function loadCollection(api, id){
  const {data} = await api.get(`collections/${id}`);
  if(data){
    data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  }
  return data;
}

export default CollectionItem;