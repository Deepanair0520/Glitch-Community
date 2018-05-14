import Observable from 'o_0';
import {debounce} from 'lodash';
import mdFactory from 'markdown-it';
import assets from '../../utils/assets';

const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true,
});

import User from '../../models/user';
import Project from '../../models/project';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';
import AnalyticsPresenter from '../analytics';

import Reactlet from "../reactlet";
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProjectPop from "../pop-overs/add-team-project-pop.jsx";

import TeamProfile from "../includes/team-profile.jsx";

export default function(application) {
  const assetUtils = assets(application);

  var self = {

    application,
    team: application.team,
    hiddenIfTeamFetched() { return application.team().hiddenIfFetched(); },
    hiddenUnlessTeamFetched() { return application.team().hiddenUnlessFetched(); },
    initialTeamDescription: Observable(undefined),
    
    TeamProfile() {
      const team = self.team().asProps();
      const props = {
        ...team,
        style: self.teamProfileStyle(),
        currentUserIsOnTeam: self.currentUserIsOnTeam(),
        addUserToTeam: (userId) => { self.team().addUser(application, User({id:userId})); },
        avatarStyle: self.teamAvatarStyle(),
        removeUserFromTeam: (userId) => { self.team().removeUser(application, User({id:userId})); },
        search: User.getSearchResultsJSON,
        thanksCount: team.teamThanks,
        uploadAvatar: self.uploadAvatar,
        verifiedImage: team.verifiedImage,
        verifiedTooltip: team.verifiedTooltip,
      };
      
      return Reactlet(TeamProfile, props);
    },

    TeamProjects() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        isAuthorizedUser: self.currentUserIsOnTeam(),
        projectsObservable: application.team().projects,
        pinsObservable: application.team().pins,
        projectOptions: self.projectOptions(),
      };

      return Reactlet(EntityPageProjects, props, "UserPageProjectsContainer");
    },

    projectOptions(){
      const userHasProjectOptions = self.currentUserIsOnTeam();
      if(!userHasProjectOptions) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      if (self.team().fetched()) {
        return AnalyticsPresenter(application, self.team());
      }
    },

    addTeamProjectPop() {
      const action = (projectData) => {
        const project = Project(projectData);
        application.team().addProject(application, project);
      };

      const props = {
        api: application.api,
        teamUsers: application.team().users(),
        action,
      };

      return Reactlet(AddTeamProjectPop, props);
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    description() {
      const text = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },

    setInitialTeamDescription() {
      const description = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(description);
      if (description) {
        return self.initialTeamDescription(node);
      }
    },

    updateDescription(event) {
      const text = event.target.textContent;
      application.team().description(text);
      return self.updateTeam({
        description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    applyDescription(event) {
      return event.target.innerHTML = md.render(application.team().description());
    },
    // application.notifyUserDescriptionUpdated true


    uploadCover() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addCoverFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    uploadAvatar() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addAvatarFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    togglePinnedState(projectId) {
      const action = Project.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
      return application.team()[action](application, projectId);
    },

    removeProjectFromTeam(projectId) {
      application.team().removeProject(application, projectId);
    },

    hiddenIfOnTeam() {
      if (self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    hiddenUnlessAddTeamProjectPopVisible() {
      if (!application.addTeamProjectPopVisible()) { return 'hidden'; }
    },

    toggleAddTeamProjectPop() {
      application.addTeamProjectPopVisible.toggle();
      if (application.addTeamProjectPopVisible()) {
        return $('#team-project-search').focus();
      }
    },
  };

  application.team.observe(function(newVal) {
    if (newVal) {
      return self.setInitialTeamDescription();
    }
  });

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
}
