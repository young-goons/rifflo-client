import React, { Component } from 'react';
import { Form, TextArea, Button } from "semantic-ui-react";

import axios from '../../../../shared/axios';
import styles from './ReportModal.module.css';

class ReportModal extends Component {
    state = {
        content: ''
    };

    contentInputHandler = (event) => {
        this.setState({content: event.target.value});
    };

    clickSubmitHandler = () => {
        const url = "/post/" + this.props.postId + "/report";
        const data = {
            content: this.state.content
        };
        axios({method: 'POST', url: url, data: data})
            .then(response => {
                this.props.reportModalClose();
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <div className={styles.modalDiv}>
                <div className={styles.headerDiv}>
                    Report Post/Clip Uploaded by <span className={styles.usernameSpan}>{this.props.username}</span>
                </div>
                <div className={styles.textAreaDiv}>
                    <Form>
                        <TextArea rows={5}
                            value={this.state.content}
                            onChange={this.contentInputHandler}
                            placeholder="Please describe why you are reporting the post (e.g. inappropriate content)"
                        />
                    </Form>
                </div>
                <div className={styles.buttonDiv}>
                    <Button onClick={this.clickSubmitHandler} fluid color="orange">
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}

export default ReportModal;