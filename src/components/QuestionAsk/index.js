import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import AutoTags from 'react-native-tag-autocomplete';
import { NavigationActions } from 'react-navigation';
import { Text ,Input, Textarea, Item, Container, Header, Body, Content, Left, Right, Button, Icon, Title } from 'native-base';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { IP_ADDRESS } from '../../authentication/local';
import { getToken } from '../withStorage';


const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)'
    },
    autocompleteContainer: {
        flexGrow: 1        
    }
})

class AskQuestion extends Component {
    state = {
        tagSuggestions : [],
        tagsSelected : [],
        isLoading: false,
        body: '',
        title: '',
        userDataId: ''
    }

    componentWillMount() {
        getToken('udxId').then(userDataId => {
            this.setState({ userDataId });
        })
    }

    componentDidMount() {
        this.getSuggestions();
    }

    getSuggestions = () => {
        axios.get(`http://${IP_ADDRESS}/api/tags`)
            .then(response => {
                console.log("tags: ", response.data);
                const tags = response.data;
                this.setSuggestions(tags);
            }).catch(err => console.log(err));
    }

    setSuggestions(tags) {
        const tagSuggestions = tags.map( tag => ({ name: tag.title }) );
        this.setState({ tagSuggestions });
    }

    handleInputChange = (value, field) => this.setState({ [field]: value });
    
    handleDelete = index => {
        let tagsSelected = this.state.tagsSelected;
        tagsSelected.splice(index, 1);
        this.setState({ tagsSelected });
    }
    
    handleAddition = suggestion => {
        this.setState({ tagsSelected: this.state.tagsSelected.concat([suggestion]) });
    }

    handleSubmit = () => {
        this.setState({ isLoading: true });
        var newQuestionId;
        const { title, body, tagsSelected, userDataId } = this.state;

        const question = {
            title,
            body,
            tags: tagsSelected.map(tag => tag.name),
            date: moment().format(),
            questionerId: userDataId,
            answers: [],
            voteNumber: 0,
            numberOfViews: 0,
            shortComments: [],
            usersUpVoted: [],
            usersDownVoted: []
        }

        axios.request({
            method: 'post',
            url: `http://${IP_ADDRESS}/api/questions`,
            data: question,
        }).then(response => {
            newQuestionId = response.data.id;
            // console.log("Response: ", response.data);
            const { id: questionId } = response.data;
            const userId = userDataId;
            const prop = "questions";

            return axios.get(`http://${IP_ADDRESS}/api/userDatas/findUserAddProp`, {
                params: {
                    userId,
                    prop,
                    questionId
                }
            });
        }).then(response => {
            this.setState({ isLoading: false }, () => {
                console.log("updated response: ", response.data);
                this.props.navigation.navigate('QuestionDetail', { questionId: newQuestionId })
            });
        }).catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
            showMessage({
                message: "Status",
                description: "Please check your connection",
                type: "danger",
            });
        });
  }

    render() {
        const { tagSuggestions, isLoading, body, title } = this.state;
        var buttonLoading;
        if(isLoading) {
            buttonLoading = <Button type="primary"><Text>Loading ...</Text></Button>;
        }
        else {
            buttonLoading = <Button onPress={this.handleSubmit} type="primary"><Text>Post question</Text></Button>
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
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Ask</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={{ borderWidth: 1, borderColor: '#e4e6e8', marginTop: 50, padding: 10 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.text}>Title</Text>
                            <Item regular>
                                <Input value={title} onChangeText={txt => this.handleInputChange(txt, "title")} placeholder='What is your question? ' />
                            </Item>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.text}>Body</Text>
                            <Textarea value={body} onChangeText={txt => this.handleInputChange(txt, "body")} rowSpan={5} bordered placeholder="Write an explanation" />
                        </View>
                        <View style={{ marginBottom: 10, display: 'flex' }}>
                            <Text style={styles.text}>Tags</Text>
                            <View style={{ flexWrap: 'wrap', borderWidth: 1, borderColor: '#e4e6e8', display: 'flex', flexDirection: 'column' }}>
                                <AutoTags
                                    style={styles.autocompleteContainer}
                                    listStyle={{maxHeight:150}} 
                                    suggestions={tagSuggestions}
                                    tagsSelected={this.state.tagsSelected}
                                    handleAddition={this.handleAddition}
                                    handleDelete={this.handleDelete}
                                    placeholder="Add a tag.." />
                            </View>
                        </View>
                        <View style={{ display :'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            { buttonLoading }
                        </View>
                    </View>
                </Content>
                <FlashMessage position="top" />
            </Container>
        )
    }
}

export default AskQuestion;