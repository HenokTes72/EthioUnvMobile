import React, { Component } from 'react';
import axios from 'axios';
import { View, StyleSheet } from 'react-native';
import { Icon, H2, Text } from 'native-base';
import QuestionerDetail from '../QuestionerDetail/index.js';
import ShortComments from '../ShortComments/index.js';
import { IP_ADDRESS } from '../../authentication/local';
import { getToken, isUserAuthenticated } from '../withStorage';

const styles = StyleSheet.create({
    carets: { 
        flex: 0.3, 
        alignItems: 'center', 
        justifyContent: 'center' 
    }
})

class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: '',
            isUserHisAnswer: false,
            userDataId: ''
        }

        this.updateAnswer = this.updateAnswer.bind(this);
        this.makeVote = this.makeVote.bind(this);
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

    makeVote(opCode) {
        const { details, userDataId } = this.state;

        const answerId = details.id;
        const userId = userDataId;
        const operation = opCode;

        console.log("MAKE VOTE: ", { answerId, userId, operation });

        axios.get(`http://${IP_ADDRESS}/api/answers/${opCode === "add" ? "addVote" : "subVote"}`, {
            params: {
                answerId,
                userId
            }
        }).then(response => {
            console.log("addVote: ", response.data);
            const { userDataId: userId } = details;
            console.log("userDataId: ", userId);
            const queAns = "answer";
            return axios.get(`http://${IP_ADDRESS}/api/userDatas/addReputation`,{
                params: {
                    userId,
                    operation,
                    queAns
                }
            });
        }).then(response => {
            console.log("Reputation added: ", response.data);
            this.getAnswer();
        }).catch(err => console.log("MAKE VOTE ERROR: ",err));
    }

    upVote() {
        console.log("Upvote clicked");
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                console.log("Authenticated User");
                const { isUserHisAnswer } = this.state;
                if(!isUserHisAnswer) {
                    this.makeVote("add");
                }
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

    downVote () {
        console.log("Dowvote clicked");
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                console.log("Authenticated User");
                const { isUserHisAnswer } = this.state;
                if(!isUserHisAnswer) {
                    this.makeVote("sub");
                }
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


    updateAnswer() {
        this.getAnswer();
    }

    getAnswer() {
        let answerId = this.props.answerId;
        console.log("answerId: ", answerId);
        axios.get(`http://${IP_ADDRESS}/api/answers/${answerId}`)
        .then(response => {
            console.log("details: ", response.data);
            const { userDataId } = response.data;
            const isUserHisAnswer = (userDataId === this.state.userDataId);
            this.setState({details: response.data, isUserHisAnswer});
        })
        .catch((err) => {
            console.log("ERR: "+err);
        });
    }

    componentDidMount() {
        this.getAnswer();
    }

    render() {
        const { details, userDataId } = this.state;

        var upIcon;
        if(details && details.usersUpVoted.indexOf(userDataId) !== -1) {
            console.log(userDataId +" upVoted "+ details.usersUpVoted);
            upIcon = <Icon type="FontAwesome" name="hand-o-up" style={{ color: '#f48024' }}  />;
        }
        else {
            upIcon = <Icon type="FontAwesome" name="hand-o-up" onPress={this.upVote} style={{ color: '#c9cbcf' }}  />;
        }

        var downIcon;
        if(details && details.usersDownVoted.indexOf(userDataId) !== -1) {
            console.log(userDataId +" downVoted "+ details.usersUpVoted);
            downIcon = <Icon type="FontAwesome" name="hand-o-down" style={{ color: '#f48024' }} />;
        }
        else {
            downIcon = <Icon type="FontAwesome" name="hand-o-down" onPress={this.downVote} style={{ color: '#c9cbcf' }}  />;
        }

        return (
            <View style={{ paddingTop: 15 ,borderBottomWidth: 1, borderBottomColor: '#e4e6e8' }}>
                <View style={{ paddingBottom: 15, display: 'flex', flexDirection: 'row' }}>
                    <View style={{ width: 60, minHeight: 120, display: 'flex' }}>
                        <View style={styles.carets}>
                            { upIcon }
                        </View>
                        <View style={[styles.carets, { flex: 0.4 }]}>
                            <H2 style={{ color: 'rgba(0,0,0,0.65)' }}>{ details && details.voteNumber }</H2>
                        </View>
                        <View style={styles.carets}>
                            { downIcon }
                        </View>
                    </View>
                    <View style={{ paddingLeft: 10, flex : 1 }}>
                        <Text style={{ fontSize: 15, color: 'rgb(36, 39, 41)' }}>
                            { details && details.body }
                        </Text>
                    </View>
                </View>
                <View style={{ marginBottom: 15, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    { details && <QuestionerDetail 
                        date={details.date} 
                        questionerId={details.userDataId} /> || <View></View> }
                </View>
                    { details && <ShortComments update={this.updateAnswer} addType="answers" arrs={details.shortComments} qaId={details.id}/> || <View></View> }
            </View>
        )
    }
}

export default Answer;