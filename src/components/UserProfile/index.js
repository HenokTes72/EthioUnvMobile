import React, { Component } from 'react';
import axios from 'axios';
import { View, StyleSheet } from 'react-native';
import { Text, Spinner, H2, H3, Input, Item, Container, Header, Body, Content, Left, Right, Button, Icon, Title } from 'native-base';
import { removeToken, getToken } from '../withStorage';
import { IP_ADDRESS } from '../../authentication/local';

const styles = StyleSheet.create({
    detail: { 
        marginBottom: 10, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    }
})

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
        }

    }

    componentWillMount() {
        this.getUser();
    }

    getUser = () => {
        getToken('udxId').then(userDataId => {
            axios.get(`http://${IP_ADDRESS}/api/userDatas/${userDataId}`)
            .then(response => {
                console.log("user: ", response.data);
                const user = response.data;
                this.setState({ user });
            }).catch(err => console.log(err));
        })
        
    }

    logout() {
        getToken('txId').then(tokenId => {
            axios.request({
                method: 'post',
                url: `http://${IP_ADDRESS}/api/Users/logout?access_token=${tokenId}`,
            }).then(response => {
                removeToken().then(res => {
                    console.log(res);
                    this.props.navigation.navigate('Login');
                })            
            }).catch(err => console.log(err));
        })
    }

    render() {
        const { user } = this.state;
        return (
            <Container>
                <Header style={{ backgroundColor: 'rgb(243, 238, 238)' }}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Icon style={{ color: 'rgba(0,0,0,0.65)' }} name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Profile</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={{ marginBottom: 20 ,display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <H2 style={{ color: 'rgba(0,0,0,0.65)' }}>{ user && user.displayName }</H2>
                        <Button onPress={() => this.logout()}><Text>Logout</Text></Button>
                    </View>
                    <View style={styles.detail}>
                        <H2 style={{ color: 'rgba(0,0,0,0.65)' }}>Reputation</H2>
                        <H3>{user && user.reputationNumber}</H3>
                    </View>
                    <View style={styles.detail}>
                        <H2 style={{ color: 'rgba(0,0,0,0.65)' }}>{ user && user.questions.length > 1 ? "Questions" : "Question" }</H2>
                        <H3>{user && user.questions.length}</H3>
                    </View>
                    <View style={styles.detail}>
                        <H2 style={{ color: 'rgba(0,0,0,0.65)' }}>{ user && user.answers.length > 1 ? "Answers" : "Answer" }</H2>
                        <H3>{user && user.answers.length}</H3>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default UserProfile;