import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { View, TextInput } from 'react-native';
import { Text, Button } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { IP_ADDRESS } from '../../authentication/local';
import { getToken, isUserAuthenticated } from '../withStorage';

function sentenceDivide(body, len) {
  var bodyArrs = body.split(' ');
  if (bodyArrs.length > len) {
    var ans = '';
    for (var i=0; i<len; i++) {
      ans+= bodyArrs[i] + ' ';
    }
    return ans;
  }
  else {
    return body;
  }
}
 
class WriteAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: '',
            isLoading: false,
            hasError: false,
            userDataId: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

    handleSubmit() {
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                this.setState({ isLoading: true, hasError: false });
                var answerId;
                const { body, userDataId } = this.state;
                const { questionId } = this.props;
                const answer = {
                    body,
                    date: moment().format('MMMM Do YYYY, h:mm'),
                    voteNumber: 0,
                    userDataId: userDataId,
                    questionId,
                    shortComments: [],
                    usersUpVoted: [],
                    usersDownVoted: []
                }

                axios.request({
                    method: 'post',
                    url: `http://${IP_ADDRESS}/api/answers`,
                    data: answer
                }).then(response => {
                    answerId = response.data.id;
                    const { id: questionId } = response.data;
                    const userId = this.state.userDataId;
                    const prop = "answers";

                    return axios.get(`http://${IP_ADDRESS}/api/userDatas/findUserAddProp`,{
                        params: {
                            userId,
                            prop,
                            questionId
                        }
                    });
                }).then(response => {
                    console.log("user updated: ", response.data);
                    const { questionId, questionerId: userId } = this.props;
                    const prop = "notificationAnswers";
                    return axios.get(`http://${IP_ADDRESS}/api/userDatas/findUserAddProp`, {
                    params: {
                        userId,
                        prop,
                        questionId: `${questionId}:::${sentenceDivide(body, 20)}`
                    }
                    });
                }).then(response => {
                    console.log("user updated: ", response.data);
                    const { questionId } = this.props;
                    const prop = "answers";
                    return axios.get(`http://${IP_ADDRESS}/api/questions/findQuestionAddProp`,{
                        params: {
                            questionId,
                            prop,
                            answerId
                        }
                    });
                }).then(response => {
                    this.setState({ body: '', isLoading: false });
                    this.props.update();
                    console.log("question updated: ", response.data);
                }).catch(err => {
                    console.log(err);
                    this.setState({ isLoading: false ,hasError: true });
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
        const { isLoading, hasError, body } = this.state;
        var buttonLoading;
        if(isLoading) {
            buttonLoading = <Button style={{ height: 40, marginRight: 15 }} type="primary"><Text>Loading ...</Text></Button>
        }
        else {
            buttonLoading = <Button onPress={this.handleSubmit} style={{ height: 40, marginRight: 15 }} type="primary"><Text>Post Your Answer</Text></Button>
        }

        return (
            <View>
                <Text style={{ fontSize: 20, color: '#393232', marginBottom: 10 }}>Your Answer</Text>
                <TextInput
                    value={body}
                    onChangeText ={text => this.setState({ body: text })}
                    style={{ borderWidth: 1, borderColor: '#e4e6e8', marginBottom: 15, paddingLeft: 10 }}
                    multiline={true}
                    numberOfLines={7}
                    placeholder="Write your answer here"
                />
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    { buttonLoading }
                    <View style={{ height: 25, alignSelf: 'center' }}>
                        { false && <Text style={{ color:"red" }}> Please check your connection </Text> }
                    </View>
                </View>
            </View>
        )
    }
}

export default WriteAnswer;