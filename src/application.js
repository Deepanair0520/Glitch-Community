/* globals API_URL APP_URL EDITOR_URL analytics application*/

import Observable from 'o_0';

import {find} from "lodash";
import axios from 'axios';
import cachedCategories from './cache/categories.js';
import cachedTeams from './cache/teams.js';
import Model from './models/model';
import User from './models/user';
import Project from './models/project';
import Team from './models/team';
import Question from './models/question';

let cachedUser = undefined;
if(localStorage.cachedUser) {
  try {
    cachedUser = JSON.parse(localStorage.cachedUser);
    if (cachedUser.id <= 0) {
      throw 'invalid id';
    }
  } catch (error) {
    //Something bad happened in the past to get us here!
    //Act natural and pretend we're logged out
    cachedUser = undefined;
  }
}

var self = Model({
  currentUser: cachedUser,
}).extend({

  // overlays
  overlayNewStuffVisible: Observable(false),

  // search - users
  searchQuery: Observable(""),

  // questions
  questions: Observable([]),
  gettingQuestions: Observable(false),

  // pages
  pageIsTeamPage: Observable(false),
  pageIsUserPage: Observable(false),
  
  normalizedBaseUrl() {
    return "/";
  },

  closeAllPopOvers() {
    $(".overlay-background.disposable").remove();
    self.overlayNewStuffVisible(false);
  },
  
  api(source) {
    const persistentToken = self.currentUser() && self.currentUser().persistentToken();
    if (persistentToken) {
      return axios.create({  
        baseURL: API_URL,
        cancelToken: (source != null ? source.token : undefined),
        headers: {
          Authorization: persistentToken,
        },
      });
    } 
    return axios.create({
      baseURL: API_URL,
      cancelToken: (source != null ? source.token : undefined),
    });
  },

  storeLocal(key, value) {
    try {
      return window.localStorage[key] = JSON.stringify(value);
    } catch (error) {
      console.warn("Could not save to localStorage. (localStorage is disabled in private Safari windows)");
      return undefined;
    }
  },

  getLocal(key) {
    try {
      return JSON.parse(window.localStorage[key]);
    } catch (error) {
      return undefined;
    }
  },

  getUserPrefs() {
    return self.getLocal('community-userPrefs') || {};
  },

  getUserPref(key) {
    return self.getUserPrefs()[key];
  },

  updateUserPrefs(key, value) {
    const prefs = self.getUserPrefs();
    prefs[key] = value;
    return self.storeLocal('community-userPrefs', prefs);
  },
    
  login(provider, code) {
    let authURL;
    console.log(provider, code);
    if (provider === "facebook") {
      // capitalize for analytics
      provider = "Facebook";
      const callbackURL = `${APP_URL}/login/facebook`;
      authURL = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackURL)}`;
    } else {
      provider = "GitHub";
      authURL = `/auth/github/${code}`;
    }
    return self.api().post(`${authURL}`)
      .then(function(response) {
        if (response.data.id <= 0) {
          return Promise.reject(response.data);
        }
        analytics.track("Signed In",
          {provider});
        console.log("LOGGED IN", response.data);
        self.currentUser(User(response.data));
        return self.storeLocal('cachedUser', response.data);
      });
  },

  getUserByLogin(login) {
    User.getUserByLogin(application, login).then((user) => self.saveUser(user));
  },

  getUserById(id) {
    User.getUserById(application, id).then((user) => self.saveUser(user));
  },
  
  getCurrentUserById(id) {
    User.getUserById(application, id).then((userData) => {
      self.storeLocal('cachedUser', userData);
      const user = self.loadUser(userData);
      self.currentUser(user);
    });
  },

  getTeamById(id) {
    return Team.getTeamById(application, id);
  },

  // due to model caching, whenever user.id === currentuser.id, 
  // the objects will be set equal other.
  // this means that they must share a loader,
  // and that 'saveUser' will clobber 'getCurrentUserById'
  // but not necessarily the other way around.
  saveUser(userData) {
    const user = self.loadUser(userData);
    self.user(user);
  },
  
  loadUser(userData){
    userData.fetched = true;
    userData.initialDescription = userData.description;
    console.log('👀 user data is ', userData);
    self.getProjects(userData.projects);
    
    const user = User(userData).update(userData);
    const teams = user.teams().map(teamData => Team(teamData));
    user.teams(teams);
    
    return user;
  },

  saveTeam(teamData) {
    teamData.fetched = true;
    console.log('👀 team data is ', teamData);
    self.team(Team(teamData).update(teamData));
    return self.getProjects(teamData.projects);
  },

  getProjects(projectsData) {
    const projectIds = projectsData.map(project => project.id);
    return Project.getProjectsByIds(self.api(), projectIds);
  },

  getUsers(usersData) {
    const userIds = usersData.map(user => user.id);
    return User.getUsersById(self.api(), userIds);
  },
 
  get categories() {
    return cachedCategories;
  },

  getQuestions() {
    return Question.getQuestions(self).then(questions => self.questions(questions));
  },

  // client.coffee routing helpers
  // TODO?: move to utils.coffee
  
  removeFirstCharacter(string) {
    // ex: ~cool to cool
    const firstCharacterPosition = 1;
    const end = string.length;
    return string.substring(firstCharacterPosition, end);
  },
  
  anonProfileIdFromUrl(url) {
    return url.replace(/^(user\/)/g, '');
  },

  getCachedTeamByUrl(url) {
    return find(cachedTeams, team => team.url.toLowerCase() === url.toLowerCase());
  },
});


self.attrModel("currentUser", User);
self.attrModel("question", Question);

window.application = self;
window.API_URL = API_URL;
window.EDITOR_URL = EDITOR_URL;
window.User = User;
window.Project = Project;
window.Team = Team;
window.Question = Question;

export default self;
