/* global analytics */

const moment = require('moment');

const HeaderTemplate = require("../templates/includes/header");
import UserOptionsPop from "./pop-overs/user-options-pop.jsx";

import SignInPop from "./pop-overs/sign-in-pop.jsx";
import Reactlet from "./reactlet";

module.exports = function(application) {
  
  const getTeamsPojo = function(teams) { 
    if (!teams || !teams.length) {
      return [];
    }
    
    // https://our.manuscript.com/f/cases/3292168/
    // teams is inconsistent;
    // pending a fix, let's normalize that here.
    // Just need to extract name, url, and teamAvatarUrl
    // trouble is they're inconsistently functions, strings, or undefined
    return teams.map(function(team) {
      const extract = function(prop) {
        const item = team[prop];
        if (typeof(item) === "string") {
          return item;
        } else if (typeof(item) === "function") {
          return item();
        } else if (typeof(item) === "undefined") {
          return "";
        } 
        return console.error("Unxpected team property type", item, typeof(item));
        
      };
    
      return{ 
        name: extract("name"),
        url: extract("url"),
        teamAvatarUrl: extract("teamAvatarUrl")
      };
    });
  };

  var self = {

    application,
    baseUrl: application.normalizedBaseUrl(),
  
    toggleSignInPopVisible(event) {
      application.signInPopVisibleOnHeader.toggle();
      return event.stopPropagation();
    },

    toggleUserOptionsPopVisible(event) {
      application.userOptionsPopVisible.toggle();
      return event.stopPropagation();
    },

    hiddenUnlessUserIsExperienced() {
      if (!application.currentUser().isAnExperiencedUser()) { return 'hidden'; }
    },
      
    hiddenUnlessSignInPopVisible() {
      if (!application.signInPopVisibleOnHeader()) { return 'hidden'; }
    },

    userAvatar() {
      return application.currentUser().avatarUrl();
    },

    logo() {
      const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
      const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
      const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";
      const hour = moment().format('HH');
      if ((hour >= 16) && (hour <=18)) {
        return LOGO_SUNSET;
      } else if ((hour > 18) || (hour <= 8)) {
        return LOGO_NIGHT;
      } 
      return LOGO_DAY;
      
    },

    hiddenIfSignedIn() {
      if (application.currentUser().login()) { return 'hidden'; }
    },
        
    hiddenUnlessSignedIn() {
      if (!application.currentUser().login()) { return 'hidden'; }
    },
        
    SignInPop() {
      return Reactlet(SignInPop);
    },

    UserOptionsPop(visible) {
      const props = {
        visible,
        teams: getTeamsPojo(application.currentUser().teams()),
        profileLink: `/@${application.currentUser().login()}`,
        avatarUrl: application.currentUser().avatarUrl(),
        showNewStuffOverlay() {
          application.userOptionsPopVisible(false);
          return application.overlayNewStuffVisible(true);
        },
        signOut() {
          analytics.track("Logout");
          analytics.reset();
          localStorage.removeItem('cachedUser');
          return location.reload();
        }
      };

      return Reactlet(UserOptionsPop, props);
    },
    
    submit(event) {
      if (event.target.children.q.value.trim().length === 0) {
        return event.preventDefault();
      }
    }
  };
        
  return HeaderTemplate(self);
};
