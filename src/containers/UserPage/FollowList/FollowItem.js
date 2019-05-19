import React, { Component } from 'react';
import { List, Image } from 'semantic-ui-react';
import axios from 'axios';

import styles from './FollowList.module.css';
import defaultProfileImage from '../../../resources/defaultProfileImage.jpg';

class FollowItem extends Component {
    state = {
        username: null,
        profileImgSrc: null,
        postCnt: null
    };

    componentDidMount() {
        const headers = {
            'Authorization': 'Bearer ' + window.localStorage.getItem('accessToken')
        };
        if (!this.state.username) {
            const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/info";
            console.log(url);
            axios({method: 'GET', url: url, headers: headers})
                .then(response => {
                    this.setState({username: response.data.user.username});
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (!this.state.profileImgSrc) {
            const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/profile/image";
            axios({method: 'GET', url: url, headers: headers})
                .then(response => {
                    this.setState({profileImgSrc: url + "?" + Date.now()});
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (!this.state.postCnt) {
            const url = "http://127.0.0.1:5000/user/" + this.props.userId + "/posts";
            axios({method: 'GET', url: url, headers: headers})
                .then(response => {
                    this.setState({postCnt: response.data.postIdArr.length});
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
        let profileImg;
        if (this.state.profileImgSrc) {
            profileImg = <Image className={styles.followImg} src={this.state.profileImgSrc} />
        } else {
            profileImg = <Image className={styles.followImg} src={defaultProfileImage} />
        }

        return (
            <List.Item className={styles.listItem}>
                { profileImg }
                <List.Content>
                    <List.Header>
                        <div className={styles.followUsernameDiv}>
                            <a href={"/" + this.state.username}>{ this.state.username }</a>
                        </div>
                    </List.Header>
                    <List.Description>
                        <div className={styles.shareNumDiv}>
                            { this.state.postCnt } { this.state.postCnt <= 1 ? "share" : "shares" }
                        </div>
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default FollowItem