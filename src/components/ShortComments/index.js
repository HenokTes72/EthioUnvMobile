import React, { Component } from 'react';
import axios from 'axios';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text, TextArea, Button, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import ShortComment from './ShortComment';
import { isUserAuthenticated, getToken } from '../withStorage';
import { IP_ADDRESS } from '../../authentication/local';

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
    },
    blurText: {
        fontSize: 14,
        color: '#1890ff'
    }
})

class ShortComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormClosed: true,
            userDataId: '',
            isLoading: false,
            body: ''
        }

        console.log("props: ", this.props);

        this.addComment = this.addComment.bind(this);
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

    setCommentForm = value => this.setState({ isFormClosed: value });

    addComment() {
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                this.setState({ isLoading: true });
                const { addType, qaId } = this.props;
                const { body, userDataId } = this.state;
                const comment = {
                    body,
                    commentorId: userDataId,
                    usersVoted: []
                };

                axios.request({
                    method: 'POST',
                    url: `http://${IP_ADDRESS}/api/ShortComments`,
                    data: comment
                }).then(response => {
                    console.log("Comment added: ", response.data);
                    const { id: commentId } = response.data;
                    return axios.get(`http://${IP_ADDRESS}/api/${addType}/addComment`,{
                        params: {
                            qaId,
                            commentId
                        }
                    });
                }).then(response => {
                    console.log("Question updated: ", response.data);
                    this.setState({ body: '', isFormClosed: true, isLoading: false });
                    this.props.update();
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    console.log(err);
                });
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
        const { isFormClosed, body, isLoading } = this.state;

        var buttonLoading;
        if(isLoading) {
            buttonLoading = <Button style={{ marginBottom: 5 }} primary><Text style={styles.text}>Loading...</Text></Button>
        }
        else {
            buttonLoading = <Button onPress={this.addComment} style={{ marginBottom: 5 }} primary><Text style={styles.text}> Add Comment </Text></Button>
        }

        var commentFooter;
        if(isFormClosed){
            commentFooter = <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Icon style={{ marginRight: 5, color: '#1890ff' }} type="EvilIcons" name="comment" />
                                <Text style={[ { marginBottom: 20 } , styles.blurText]} onPress={() => this.setCommentForm(false)}>add comment</Text>
                            </View>
            
        }
        else {
            commentFooter = <View style={{ marginBottom: 20, display: 'flex' }}>
                                <TextInput
                                    value={body}
                                    onChangeText ={text => this.setState({ body: text })}
                                    style={{ borderWidth: 1, 
                                        borderColor: '#e4e6e8', 
                                        marginBottom: 5, paddingLeft: 10 }}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Write your comment here"
                                />
                                <View style={{ flexWrap: 'wrap' ,display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    { buttonLoading }
                                    <Button iconLeft onPress={() => this.setCommentForm(true)} danger><Icon type="Feather" name="x"/><Text style={styles.text}>Cancel</Text></Button>
                                </View>
                            </View>;
        }
        return (
            <View>
                <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e4e6e8' }}>
                    {
                        this.props.arrs.map(shortId => (    
                            <ShortComment key={shortId} shortCommentId={shortId}  />
                        ))
                    }
                </View>
                { commentFooter }
            </View>
        );
    }
}

export default ShortComments;