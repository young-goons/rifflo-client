import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Grid, Column, Container } from 'semantic-ui-react';

import SiteHeader from '../SiteHeader/SiteHeader';
import AuthPage from '../AuthPage/AuthPage';
import Post from '../Feed/Post/Post';
import UserPageHeader from './UserPageHeader/UserPageHeader';
import PostList from './SharedPost/SharedPost';
import NoUserPage from '../../components/ErrorPage/NoUserPage/NoUserPage';
import PostEditor from './PostEditor/PostEditor';
import styles from './UserPage.module.css';
import {loadUser} from "../../store/actions/auth";

class UserPage extends Component {
    state = {
        authUserId: this.props.authUserId,
        authUserInfo: null,
        isUserPageLoaded: false,
        postArr: [],
        userId: null,
        isSignedOut: false,
        isFollowed: null,
        followerCnt: null,
        uploadContent: '',
        uploadTags: ''
    };

    componentDidMount() {
        if (this.state.authUserId) {
            if (!this.props.authUserInfo) {
                console.log("loading user info");
                this.props.onLoadUser(this.state.authUserId);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authUserInfo) { // upon sign in
            this.setState({authUserInfo: nextProps.authUserInfo});
            this.getUserId();
        } else { // upon sign out
            this.setState({
                authUserId: null,
                authUserInfo: null,
                isUserPageLoaded: false,
                postArr: [],
                userId: null,
                isSignedOut: false,
                isFollowed: null,
                followerCnt: null,
                uploadContent: "",
                uploadTags: ""
            })
        }
    }

    componentDidUpdate() {
        if (!this.state.isUserPageLoaded && this.state.userId && this.state.authUserInfo) {
            console.log("load user posts");
            this.loadUserPosts();
        }
    }

    getUserId = () => {
        const userExistsUrl = "http://127.0.0.1:5000/user/id/username/" + this.props.match.params.username;
        axios({method: 'GET', url: userExistsUrl})
            .then(response => {
                console.log(response);
                if (response.data.userId) {
                    console.log("userid begin set");
                    this.setState({userId: response.data.userId});
                } else {
                    console.log('userid does not exist');
                    this.setState({isUserPageLoaded: true, authUserInfo: null});
                }
            })
    };

    loadUserPosts = () => {
        const userPostUrl = "http://127.0.0.1:5000/user/" + this.state.userId + "/posts";
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let postIdArr;
        axios({method: 'GET', url: userPostUrl, headers: requestHeaders})
            .then(response => {
                postIdArr = response.data.postIdArr;
                if (postIdArr.length === 0) {
                    return;
                }
                const postUrl = "http://127.0.0.1:5000/posts/" + postIdArr.join(',');
                return axios({method: 'GET', url: postUrl, headers: requestHeaders});
            })
            .then(response => {
                if (response) {
                    console.log(response);
                    const postArr = [];
                    for (let i = 0; i < postIdArr.length; i++) {
                        if (postIdArr[i] in response.data.posts) {
                            postArr.push(response.data.posts[postIdArr[i]]);
                        }
                    }
                    this.setState({
                        isUserPageLoaded: true,
                        postArr: postArr
                    })
                }
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
    };

    contentInputHandler = (event) => {
        this.setState({
            uploadContent: event.target.value
        });
    };

    tagsInputHandler = (event) => {
        this.setState({
            uploadTags: event.target.value
        });
    };

    // TODO: error handling (if the content is too long)
    sharePostHandler = () => {
        let url = "http://127.0.0.1:5000/user/upload/post";
        const requestData = {
            content: this.state.uploadContent,
            tags: this.state.uploadTags
        };
        const requestHeaders = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        let newPostId;
        axios({method: 'POST', url: url, data: requestData, headers: requestHeaders})
            .then(response => {
                newPostId = response.data.postId;
                url = "http://127.0.0.1:5000/posts/" + newPostId;
                return axios({method: 'GET', url: url, headers: requestHeaders});
            })
            .then(response => {
                this.setState({
                    postArr: [...this.state.postArr, response.data.posts[newPostId]]
                })
            })
            .catch(error => {
                console.log(error);
                alert(error);
            })
    };

    render() {
        let renderDiv;
        const username = this.props.match.params.username;
        // TODO: psuedo-randomize the order
        const postDivArr = this.state.postArr.map((post, idx) => {
            return (
                <div key={idx} className={styles.postListDiv}>
                    <PostList
                        songName={post.songName}
                        artist={post.artist}
                        tags={post.tags}
                    />
                </div>
            );
        });

        if (this.props.authUserInfo) {
            let userPageDiv;
            const siteHeader = <SiteHeader userInfo={this.props.authUserInfo}/>;
            if (this.state.isUserPageLoaded && this.state.userId === null) {
                userPageDiv = <NoUserPage/>;
            } else {
                let postUploadDiv;
                if (this.props.authUserInfo.username === username) {
                    postUploadDiv = (
                        <PostEditor
                            sharePostHandler={this.sharePostHandler}
                            contentInput={this.state.uploadContent}
                            tagsInput={this.state.uploadTags}
                            contentInputHandler={this.contentInputHandler}
                            tagsInputHandler={this.tagsInputHandler}
                        />
                    );
                }
                userPageDiv = (
                    <div className={styles.userPageContainerDiv}>
                        <UserPageHeader
                            authUserId={this.state.authUserId}
                            userId={this.state.userId}
                            username={this.props.match.params.username}
                            shareCnt={this.state.postArr.length}
                        />
                        <div className={styles.userPageContentDiv}>
                            {postUploadDiv}
                            {postDivArr}
                        </div>
                    </div>
                );
            }
            renderDiv = (
                <div className={styles.containerDiv} ref={this.contextRef}>
                    { siteHeader }
                    { userPageDiv }
                </div>
            );
        } else if (this.state.authUserId) {
            renderDiv = <div></div>;
        } else {
            renderDiv = <AuthPage />;
        }

        return (
            <div className={styles.containerDiv}>
                { renderDiv }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUserInfo: state.auth.authUserInfo,
        isAuthenticated: state.auth.isAuthenticated,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLoadUser: (userId) => dispatch(loadUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
