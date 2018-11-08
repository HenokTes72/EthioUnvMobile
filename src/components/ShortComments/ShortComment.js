import React, { Component } from 'react';
import axios from 'axios';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { isUserAuthenticated, getToken } from '../withStorage';
import { IP_ADDRESS } from '../../authentication/local';

const styles = StyleSheet.create({
    comment: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    }
})

class ShortComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDataId: '',
            comment: '',
            userDisplayName: ''
        }

        this.addUser = this.addUser.bind(this);
        this.getComment = this.getComment.bind(this);
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

    componentDidMount() {
        this.getComment();
    }

    getComment() {
        const { shortCommentId } = this.props;
        axios.get(`http://${IP_ADDRESS}/api/ShortComments/${shortCommentId}`)
            .then(response => {
                const comment = response.data;
                this.setState({ comment })
                const { commentorId } = comment;
                return axios.get(`http://${IP_ADDRESS}/api/userDatas/${commentorId}`);
            }).then(response => {
                const { displayName: userDisplayName, id: userId } = response.data;
                this.setState({ userDisplayName, userId });
            }).catch(err => console.log(err));
    }

    addUser() {
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                const { userDataId } = this.state;
                const { id: commentId } = this.state.comment;
                const userId = userDataId;
                axios.get(`http://${IP_ADDRESS}/api/ShortComments/addUser`, {
                    params: {
                        commentId,
                        userId
                    }
                }).then(response => {
                    console.log("Comment updated: ", response.data);
                    this.getComment();
                }).catch(err => {
                    console.log(err);
                })
            }
        
            else {
                console.log("UnAuthenticated User");
                const navigateAction = NavigationActions.navigate({
                    routeName: 'Login',
                    params: {},
                });
                this.props.navigation.dispatch(navigateAction);
            }
        })
    }

    render() {
        const { comment, userDisplayName, userDataId } = this.state;
        var upIcon;
        if((comment && comment.commentorId) !== userDataId){
            if(comment && comment.usersVoted.indexOf(userDataId) === -1){
                upIcon = <Icon onPress={this.addUser} style={{ fontSize: 20, paddingTop: 5, color: '#c9cbcf', marginRight: 15 }} type="FontAwesome" name="caret-up" />;
            }
            else {
                upIcon =<Icon style={{ fontSize: 20, paddingTop: 5, color: '#f48024', marginRight: 15 }} type="FontAwesome" name="caret-up" />;
            }
        }

        return (
            <View style={[{ display: 'flex', alignItems: 'baseline', flexDirection: 'row', minHeight: 50, borderTopWidth: 1, borderTopColor: '#e4e6e8' }, styles.comment]}>
                <Text style={{ marginRight: 10, fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>{  (comment && comment.usersVoted.length) || ""  }</Text>
                { upIcon }
                <Text style={{ color: 'black', fontSize: 14 }}>{comment && comment.body}<Text style={{ marginLeft: 10, color: 'rgb(0, 119, 204)' }}>{userDisplayName}</Text></Text>
            </View>
        );
    }
}

export default ShortComment;