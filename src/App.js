import React, { Component } from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Container } from 'semantic-ui-react';

import UserPage from './containers/UserPage/UserPage';
import Suggestion from './containers/People/Suggestion/Suggestion';
import FullPost from './containers/FullPost/FullPost';
import Feed from './containers/Feed/Feed';
import HelpPage from './containers/HelpPage/HelpPage';
import { validateAccessToken } from "./shared/tokenUtils";

// TODO: check if refreshToken is not expired and get newToken if expired soon
//       what if accessToken expires while using the app?
//       add isAuthenticating to display loading screen instead of singin page on loading feed
// window.location.pathname


class App extends Component {
    state = {
        authUserId: validateAccessToken(window.localStorage.getItem('accessToken'))
    };

    render() {
        console.log("rendering App as user " + this.state.authUserId);
        const routes = (
            <Switch>
                <Route path="/help"
                       render={(props) => <HelpPage {...props} authUserId={this.state.authUserId} />}
                />
                <Route path="/people/suggested"
                       render={(props) => <Suggestion {...props} authUserId={this.state.authUserId} />}
                />
                <Route path="/post/:postId"
                       render={(props) => <FullPost {...props} authUserId={this.state.authUserId} />}
                />
                <Route path="/:username"
                       render={(props) => <UserPage {...props} authUserId={this.state.authUserId} />}
                />
                <Route path="/"
                       render={(props) => <Feed {...props} authUserId={this.state.authUserId} />}
                />
                <Route render={(props) => <Feed {...props} authUserId={this.state.authUserId} />} />
            </Switch>
        );

        return (
            <Router history={createBrowserHistory()}>
                <Container style={{ height: '100%', width: '100%'}}>
                    { routes }
                </Container>
            </Router>
        );
    }
}

export default App;