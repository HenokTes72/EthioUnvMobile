import React, { Component } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { Text, Spinner, Input, Item, Container, Header, Body, Content, Left, Right, Button, Icon, Title } from 'native-base';
import { removeToken, getToken } from '../withStorage';
import { IP_ADDRESS } from '../../authentication/local';

class UserProfile extends Component {
    constructor(props) {
        super(props);
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
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button onPress={() => this.logout()}><Text>Logout</Text></Button>
                    </View>
                </Content>
            </Container>
        )
    }
}

export default UserProfile;