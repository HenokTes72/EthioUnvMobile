import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Body, H2, Title ,Text, Button, Header, Content, Container, Icon, Left, Right } from 'native-base';
import QuestionerDetail from '../QuestionerDetail/index.js';
import ShortComments from '../ShortComments/index.js';
import Answers from '../Answers/index.js';
import WriteAnswer from '../WriteAnswer/index.js';
import { IP_ADDRESS } from '../../authentication/local';
import { getToken, isUserAuthenticated } from '../withStorage';

const styles = StyleSheet.create({
    carets: { 
        flex: 0.3, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    tags: { 
        marginRight: 5, 
        marginBottom: 5, 
        padding: 0, 
        backgroundColor: 'rgb(225, 236, 244)' 
    }
})

class QuestionDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            details: '',
            isUserHisQuestion: false,
            userDataId: '',
        }

        this.makeVote = this.makeVote.bind(this);
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
        this.getQuestionUpdate = this.getQuestionUpdate.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

  makeVote(opCode) {
    const { details, userDataId } = this.state;

    const questionId = details.id;
    const userId = userDataId;
    const operation = opCode;

    console.log("MAKE VOTE: ", IP_ADDRESS);

    axios.get(`http://${IP_ADDRESS}/api/questions/${opCode === "add" ? "addVote" : "subVote"}`, {
      params: {
          questionId,
          userId
      }
    }).then(response => {
      console.log("addVote: ", response.data);
      const { questionerId: userId } = details;
      const queAns = "question";
      return axios.get(`http://${IP_ADDRESS}/api/userDatas/addReputation`,{
        params: {
            userId,
            operation,
            queAns
          }
        });
    }).then(response => {
      console.log("Reputation added: ", response.data);
      this.getQuestionUpdate();
    }).catch(err => console.log("MAKE VOTE ERROR: ",err));
  }

    getQuestionUpdate() {
        const { details, userDataId } = this.state;
        let questionId = this.props.navigation.getParam('questionId');
        console.log("question param Id: ", questionId);
        axios.get(`http://${IP_ADDRESS}/api/questions/${questionId}`)
        .then(response => {
            console.log("update details: ", response.data);
            const { questionerId } = response.data;
            const isUserHisQuestion = (questionerId === userDataId);
            this.setState({ details: response.data, isUserHisQuestion });
        }).catch((err) => {
            console.log("GET QUESTION UPDATE ERR: " + err);
        });
    }

    upVote() {
        console.log("Upvote clicked");
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                console.log("Authenticated User");
                const { isUserHisQuestion } = this.state;
                if(!isUserHisQuestion) {
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
                const { isUserHisQuestion } = this.state;
                if(!isUserHisQuestion) {
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

    getQuestion() {
        const { details, userDataId } = this.state;
        let questionId = this.props.navigation.getParam('questionId');
        console.log("question passed param id: ", questionId);

        axios.get(`http://${IP_ADDRESS}/api/questions/${questionId}`)
            .then(response => {
                console.log("details: ", response.data);
                const { questionerId } = response.data;
                const isUserHisQuestion = (questionerId === userDataId);
                this.setState({ details: response.data, isUserHisQuestion });
                
                return axios.get(`http://${IP_ADDRESS}/api/questions/addNumberOfViews`, {
                    params: {
                        questionId
                    }
                });
            }).then(response => {
                this.getQuestionUpdate();
                console.log("added number of views: ", response.data);
            }).catch((err) => {
                console.log("GET QUESTION ERR: "+err);
            });
    }

    updateQuestion() {
        this.getQuestionUpdate();
    }

    componentWillReceiveProps() {
        this.setState({ details: '' }, () => {
            this.getQuestionUpdate();
        });
    }

    componentDidMount() {
        this.getQuestion();
    }

    render() {
        const { details, userDataId, isUserHisQuestion } = this.state;
        console.log("IsUserHisQuestion: ", isUserHisQuestion);

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
            <Container>
                <Header style={{ backgroundColor: 'rgb(243, 238, 238)' }}>
                    <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon style={{ color: 'rgba(0,0,0,0.65)' }} name="arrow-back" />
                    </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Question</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={{ marginBottom: 15 ,display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button
                            onPress={() => this.props.navigation.navigate('QuestionAsk')}
                            primary
                            iconLeft
                        >
                            <Icon type="Ionicons" name="ios-add" />
                            <Text>Ask Question</Text>
                        </Button>
                    </View>
                    <H2 style={{ paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e4e6e8', marginBottom: 20, fontSize: 20 ,color: 'rgba(0,0,0,0.75)' }}>{ details && details.title} </H2>
                    <View style={{ paddingLeft: 20, display: 'flex', marginBottom: 20 }}>
                        <View style={{ marginBottom: 10 ,display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>asked</Text>
                            <Text style={{ marginLeft: 18 ,fontSize: 14, color: 'rgb(59, 64, 69)' }}>{moment(details && details.date).fromNow()}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>viewed</Text>
                            <Text style={{ marginLeft: 12 ,fontSize: 14, color: 'rgb(59, 64, 69)' }}>{ details && details.numberOfViews } times</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'row' }}>
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
                    <View style={{ marginLeft: 60 }}>
                        <View style={{ marginBottom: 10 ,flexWrap: 'wrap', display: 'flex', flexDirection: 'row' }}>
                            {
                                details && (details.tags.map(tag => (
                                    <Button key={tag} small style={styles.tags} ><Text style={{ padding: 0 ,color: 'rgba(0, 0, 0, 0.65)', fontSize: 10 }}>{tag}</Text></Button>
                                ))) || <View></View>
                            }
                        </View>
                        { details && <QuestionerDetail 
                        date={ `${moment(details.date).format("MMM DD YYYY")} at ${moment(details.date).format("h:mm")}`} 
                        questionerId={details.questionerId} /> || <View></View> }
                        { details && <ShortComments update={this.updateQuestion} addType="questions" arrs={details.shortComments} qaId={details.id} /> || <View></View> }
                    </View>
                    { details && <Answers  answers={details.answers} /> || <View></View> }
                        { details && <WriteAnswer update={this.updateQuestion} questionId={details.id} questionerId={details.questionerId} /> || <View></View> }
                </Content>
            </Container>
        )
    }
}

export default QuestionDetail;