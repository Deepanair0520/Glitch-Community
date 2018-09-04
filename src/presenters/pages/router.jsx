import React from 'react';
import PropTypes from 'prop-types';

import qs from 'querystringify';
import {Route, Switch} from 'react-router-dom';
import Helmet from 'react-helmet';

import categories from '../../curated/categories';
import rootTeams from '../../curated/teams';

import IndexPage from './index.jsx';
import {FacebookLoginPage, GitHubLoginPage} from './login.jsx';
import QuestionsPage from './questions.jsx';
import ProjectPage from './project.jsx';
import {TeamPage, UserPage, TeamOrUserPage} from './team-or-user.jsx';
import SearchPage from './search.jsx';
import CategoryPage from './category.jsx';
import ErrorPage from './error.jsx';
import SecretPage from './secret.jsx';

const NotFoundPage = () => (
  <React.Fragment>
    <ErrorPage title="Page Not Found" description="Maybe a typo? Or perhaps it's moved?"/>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
  </React.Fragment>
);

const Router = ({api}) => (
  <Switch>
    <Route path="/" exact render={({location}) => <IndexPage key={location.key} api={api}/>}/>
    <Route path="/index.html" exact strict render={({location}) => <IndexPage key={location.key} api={api}/>}/>
    
    <Route path="/login/facebook" exact render={({location}) => <FacebookLoginPage key={location.key} api={api} code={qs.parse(location.search).code}/>}/>
    <Route path="/login/github" exact render={({location}) => <GitHubLoginPage key={location.key} api={api} code={qs.parse(location.search).code}/>}/>
    
    <Route path="/questions" exact render={({location}) => <QuestionsPage key={location.key} api={api}/>}/>
    
    <Route path="/~:name" exact render={({location, match}) => <ProjectPage key={location.key} api={api} name={match.params.name}/>}/>
    
    <Route path="/@:name" exact render={({location, match}) => <TeamOrUserPage key={location.key} api={api} name={match.params.name}/>}/>
    
    <Route path="/user/:id(\d+)" exact render={({location, match}) => <UserPage key={location.key} api={api} id={parseInt(match.params.id, 10)} name={`user ${match.params.id}`}/>}/>
    
    {Object.keys(rootTeams).map(name => (
      <Route key={name} path={`/${name}`} exact render={({location}) => <TeamPage key={location.key} api={api} id={rootTeams[name]} name={name}/>}/>
    ))}
    
    <Route path="/search" exact render={({location}) => <SearchPage key={location.key} api={api} query={qs.parse(location.search).q}/>}/>
    
    {categories.map(category => (
      <Route key={category.url} path={`/${category.url}`} exact render={({location}) => <CategoryPage key={location.key} api={api} category={category}/>}/>
    ))}
    
    <Route path="/secret" exact render={({location}) => <SecretPage key={location.key}/>}></Route>
    
    <Route render={({location}) => <NotFoundPage key={location.key}/>}/>
  </Switch>
);
Router.propTypes = {
  api: PropTypes.any.isRequired,
};

export default Router;