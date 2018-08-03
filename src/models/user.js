/* globals CDN_URL */

let User;

import Model from './model';
const cache = {};
const cacheBuster = Math.floor(Math.random() * 1000);

export const ANON_AVATAR_URL = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399";

export default User = function(I, self) {

  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }
  
  self.defaults(I, {
    id: undefined,
    avatarUrl: undefined,
    avatarThumbnailUrl: undefined,
    color: undefined,
    hasCoverImage: false,
    coverColor: "#1F33D9",
    login: null,
    name: null,
    description: "",
    projects: undefined,
    teams: [],
    thanksCount: 0,
    fetched: false,
    showAsGlitchTeam: false,
    persistentToken: null,
    pins: [],
    deletedProjects: [],
  });

  self.attrObservable(...Array.from(Object.keys(I) || []));
  self.attrObservable("notFound");
  self.attrObservable("localCoverImage");
  self.attrModels('projects', Project);

  self.extend({

    isSignedIn() {
      return !!self.login();
    },

    isAnon() {
      return !self.login();
    },

    coverUrl(size='large') {
      if (self.localCoverImage()) {
        return self.localCoverImage();
      } 

      if (self.hasCoverImage()) {
        return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/user-cover/${self.id()}/${size}?${cacheBuster}`;
      } 
      return "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
      
    },
    
    profileStyle() {
      return {
        backgroundColor: self.coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    userAvatarUrl(size) {
      size = size || 'small';
      if (self.isAnon() || !self.avatarUrl()) {
        return ANON_AVATAR_URL;
      }
      if (size === "large") {
        return self.avatarUrl();
      }
      return self.avatarThumbnailUrl();
    },

    tooltipName() {
      return self.login() || "anonymous user";
    },
    
    alt() {
      return `${I.login} avatar`;
    },
    
    style() {
      return {backgroundColor: I.color};
    },

    glitchTeamAvatar() {
      return "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg";
    },
    
    asProps() {
      return {
        get teams() { return self.teams.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get projects() { return self.projects.filter(({asProps}) => !!asProps).map(({asProps}) => asProps()); },
        get pins() { return self.pins(); },

        alt: self.alt(),
        avatarUrl: self.avatarUrl(),
        color: self.color(),
        coverColor: self.coverColor(),
        description: self.description(),
        hasCoverImage: self.hasCoverImage(),
        id: self.id(),
        login: self.login(),
        name: self.name(),
        style: self.style(),
        profileStyle: self.profileStyle(),
        thanksCount: self.thanksCount(),
        tooltipName: self.tooltipName(),
        userAvatarUrl: self.userAvatarUrl(),
        userAvatarUrlLarge: self.userAvatarUrl('large'),
      };
    },
  });


  if (I.id) {
    cache[I.id] = self;
  }
  // console.log '☎️ user cache', cache

  return self;
};

User.getUserByLogin = function(application, login) {
  const userIdPath = `/userid/byLogin/${login}`;
  return application.api().get(userIdPath)
    .then(function(response) {
      const userId = response.data;
      if (userId === "NOT FOUND") {
        application.user().notFound(true);
        return;
      }
      return User.getUserById(application, userId);
    }).catch(error => console.error(`getUserByLogin GET ${userIdPath}`, error));
};

User.getUserById = function(application, id) {
  const userPath = `users/${id}`;
  const promise = new Promise((resolve, reject) => {
    return application.api().get(userPath)
      .then(({data}) => resolve(data)).catch(function(error) {
        console.error(`getUserById GET ${userPath}`, error);
        return reject();
      });
  });
  return promise;
};


User._cache = cache;

export function getLink({id, login}) {
  if (login) {
    return `/@${login}`;
  }
  return `/user/${id}`;
}

export function getAvatarStyle({avatarUrl, color}) {
  return {
    backgroundColor: color,
    backgroundImage: `url('${avatarUrl || ANON_AVATAR_URL}')`,
  };
}

export function getProfileStyle({id, hasCoverImage, coverColor, cache=cacheBuster, size='large'}) {
  const customImage = `${CDN_URL}/user-cover/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

// Circular dependencies must go below module.exports
import Project from './project';
