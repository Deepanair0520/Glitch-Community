/* global application CDN_URL EDITOR_URL*/
import {find} from 'lodash';

let Project;
const cache = {};

import Team from './team';
import Model from './model';
import axios from 'axios';

let source = undefined; // reference to cancel token

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export default Project = function(I, self) {
  
  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }

  self.defaults(I, {
    domain: undefined,
    id: undefined,
    description: undefined,
    teams: undefined,
    users: undefined,
    showAsGlitchTeam: false,
  }
  );

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("readme", "readmeNotFound", "projectNotFound", "fetched", "displayName", "private");
  self.attrModels('teams', Team);
  self.attrModels('users', User);

  self.extend({

    asProps() {
      const project = self;

      return {
        get teams() { return project.teams().map(team => team.asProps()); },
        get users() { return project.users().map(user => user.asProps()); },
        avatar: project.avatar(),
        description: project.description(),
        domain: project.domain(),
        id: project.id(),
        isRecentProject: !!(project.isRecentProject),
        link: getLink(self.domain()),
        name: project.name(),
        private: project.private(),
        showAsGlitchTeam: !!(project.showAsGlitchTeam && project.showAsGlitchTeam()),
        remixUrl: project.remixUrl(),
        userIsCurrentUser: project.userIsCurrentUser(application),
      };
    },

    name() {
      return self.domain();
    },
  
    editUrl() {
      if (I.line) {
        return `${EDITOR_URL}#!/${I.domain}?path=${I.path}:${I.line}:${I.character}`;
      }
      return `${EDITOR_URL}#!/${I.domain}`;
    },
    
    remixUrl() {
      return `${EDITOR_URL}#!/remix/${I.domain}`;
    },

    userIsCurrentUser(application) {
      const userIsCurrentUser = find(self.users(), user => user.id() === application.currentUser().id());
      return !!userIsCurrentUser;
    },

    avatar() {
      return getAvatarUrl(self.id());
    },
        
    getReadme(application) {
      if (self.id() === undefined) {
        self.readmeNotFound(true);
        self.projectNotFound(true);
        return;
      }
      
      const { CancelToken } = axios;
      source = CancelToken.source();
      self.readme(undefined);
      self.readmeNotFound(undefined);
      self.projectNotFound(undefined);
      let path = `projects/${self.id()}/readme`;
      let token = application.currentUser() && application.currentUser().persistentToken();
      if(token){
        path += `?token=${token}`;
      }
      return application.api(source).get(path)
        .then(function(response) {
          self.readme(response.data);
          return application.overlayProject(self);
        }).catch(function(error) {
          console.error("getReadme", error);
          if (error.response.status === 404) {
            return self.readmeNotFound(true);
          } 
          return self.projectNotFound(true);
        
        });
    },

    pushSearchResult(application) {
      application.searchResultsProjects.push(self);
      return application.searchResultsProjectsLoaded(true);
    },
           
    delete() {
      const projectPath = `/projects/${self.id()}`;
      return new Promise(function(resolve, reject) {
        return application.api().delete(projectPath)
          .then(response => resolve(response)).catch(function(error) {
            reject(error);
            return console.error('deleteProject', error);
          });
      });
    },
      
    undelete() {
      const projectPath = `/projects/${self.id()}/undelete`;
      return new Promise(function(resolve, reject) { 
        return application.api().post(projectPath)
          .then(response => resolve(response)).catch(function(error) {
            console.error('undeleteProject', error);
            return reject(error);
          });
      });
    },
    
    leave() {
      const projectAuthPath = `/projects/${self.id()}/authorization`;
      const config = {
        data: { 
          targetUserId: application.currentUser().id(),
        },
      };
      return new Promise(function(resolve, reject) {
        return application.api().delete(projectAuthPath, config)
          .then(response => resolve(response)).catch(function(error) {
            console.error('leaveProject', error);
            return reject(error);
          });
      });
    },
  });
      
  cache[I.id] = self;
  // console.log '💎 project cache', cache

  return self;
};

// Fetch projects and populate them into the local cache
Project.getProjectsByIds = function(api, ids) {
  const NUMBER_OF_PROJECTS_PER_REQUEST = 40;
  const newProjectIds = ids.filter(function(id) {
    const project = cache[id];
    return !project || !project.fetched();
  });
  
  // fetch the ids in groups so they fit into max allowable url length
  const projectIdGroups = newProjectIds.map(function(id, index) {
    if ((index % NUMBER_OF_PROJECTS_PER_REQUEST) === 0) {
      return newProjectIds.slice(index, index + NUMBER_OF_PROJECTS_PER_REQUEST);       
    }  return null; }).filter(id => id);
  
  projectIdGroups.map(function(group) {
    const projectsPath = `projects/byIds?ids=${group.join(',')}`;
    return api.get(projectsPath)
      .then(function({data}) {
        data.map(function(datum) {
          datum.fetched = true;
          return Project(datum).update(datum);
        }); 
      })
      .catch(error => console.error("getProjectsByIds", error));
  });
  
  return ids.map(id => Project({id}));
};

//getProjectsByIds, but wrapped in a promise until they're all fetched.
Project.promiseProjectsByIds = (api, ids) => {
  // Fetch all the project models.
  const projects = Project.getProjectsByIds(api, ids);
  
  // Set up promises to listen to the fetched() state
  const promises = projects.map(project => {
    return new Promise((resolve) => {
      project.fetched.observe((isFetched) => {
        isFetched && resolve();
      });
    });
  });
  
  // Once they all report in as fetched,
  // return the (now populated) original projects object
  return new Promise((resolve) => {
    Promise.all(promises).then(() => {
      return resolve(projects);
    });
  });
};


Project._cache = cache;

export function getAvatarUrl(id) {
  return `${CDN_URL}/project-avatar/${id}.png`;
}

export function getLink(domain) {
  return `/~${domain}`;
}

export function getEditorUrl(domain, path, line, character) {
  if (!path || isNaN(line) || isNaN(character)) {
    return getEditorUrl(domain);
  }
  return `${EDITOR_URL}#!/${domain}?path=${path}:${line}:${character}`;
}

// Circular dependencies must go below module.exports
import User from './user';
