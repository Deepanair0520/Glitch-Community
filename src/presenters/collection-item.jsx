import React from 'react';
import PropTypes from 'prop-types';

import {TruncatedMarkdown} from './includes/markdown.jsx';
import CollectionOptionsContainer from "./pop-overs/collection-options-pop.jsx";
import Link from './includes/link';
import CollectionAvatar from './includes/collection-avatar.jsx';

import {getAvatarUrl} from '../models/project.js';

import {getContrastTextColor, hexToRgbA} from '../models/collection.js';

const ProjectsPreview = ({projects}) => {
  
  return (
    <>
      <ul className="projects-preview" projects={projects}>
        { projects.slice(0,3).map(project => (
          <li key={project.id} className={"project-container " + (project.private ? "private" : null)}>
            <img className="avatar" src={getAvatarUrl(project.id)} alt={`Project avatar for ${project.domain}`}/>
            <div className="project-name">{project.domain}</div>
            <div className="project-badge private-project-badge" aria-label="private"></div>
          </li>
        )) }
      </ul>
      <div className="collection-link">
        View {projects.length} {(projects.length > 0 ? 'projects' : 'project')} →
      </div>
    </>
  );
};

ProjectsPreview.propTypes = {
  projects: PropTypes.any.isRequired,
};

class CollectionItem extends React.Component{
  constructor(props){
    super(props);
  }
  
  render(){
    const {collection, deleteCollection, isAuthorized, userLogin} = this.props;
    return (
      <li>
        {isAuthorized && (
          <CollectionOptionsContainer collection={collection} deleteCollection={deleteCollection}></CollectionOptionsContainer>
        )}

        {(collection &&
          <Link to={`/@${userLogin}/${collection.url}`}>
            <div className={['collection']} 
              id={"collection-" + collection.id}>
              <div className="collection-container">
                <div className="collection-info" style={{backgroundColor: collection.coverColor}}> 
                  <div className="avatar-container">
                    <div className="avatar">
                      <CollectionAvatar backgroundColor={hexToRgbA(collection.coverColor)} collectionId={collection.id}/>
                    </div>
                  </div>
                  <div className="collection-name-description">
                    <div className="button">
                      <span className="project-badge private-project-badge" aria-label="private"></span>
                      <div className="project-name">{collection.name}</div>
                    </div>
                    <div className="description" style={{color: getContrastTextColor(collection.coverColor)}}><TruncatedMarkdown length={96}>{collection.description}</TruncatedMarkdown></div>
                  </div>

                  <div className="overflow-mask"></div>
                </div>

                {(collection.projects.length > 0
                  ? <ProjectsPreview projects={collection.projects} color={collection.coverColor} collection={collection}/>
                  :
                  <div className="projects-preview empty">
                    {(isAuthorized
                      ? <p>This collection is empty – add some projects <span role="img" aria-label="">☝️</span></p>
                      : <p>No projects to see in this collection just yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>             
        )}
      </li>
    );
  }
}

CollectionItem.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
  userLogin: PropTypes.string.isRequired,
};

export default CollectionItem;