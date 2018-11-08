import React, { Component } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { Text, Spinner, Input, Item, Container, Header, Body, Content, Left, Right, Button, Icon, Title } from 'native-base';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { IP_ADDRESS } from '../../authentication/local';
import { setToken } from '../withStorage';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(user) {
        var token;
        this.setState({ isLoading: true });
            axios.request({
            method: 'post',
            url: `http://${IP_ADDRESS}/api/Users/login`,
            data: user,
        }).then(response => {
            console.log(response.data);
            const { userId, id } = response.data;
            token = id;

            return axios.get(`http://${IP_ADDRESS}/api/userDatas/findByUserId`,{
                params: {
                    userId
                }
            });
        }).then(response => {
            const { userId, id: userDataId } = response.data;
            setToken(token, userId, userDataId).then(res => {
                console.log(res);
                this.setState({ isLoading: false });
                this.props.navigation.navigate('Home');
            });

        }).catch(err => {
            console.log(err);
            this.setState({ isLoading: false }, () => {
                showMessage({
                    message: "Status",
                    description: "Failed to login",
                    type: "danger",
                });
            });
        });
    }

    handleSubmit(e) {
        const { email, password } = this.state;
        const user = { email, password };
        console.log("User: ",JSON.stringify(user));
        this.loginUser(user);
    }

    changeFormValues = (val, field) => {
        this.setState({ [field] : val })
    };
    
    render() {
        const { email, password, isLoading } = this.state;
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
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Log in</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={{ borderWidth: 1, borderColor: '#e4e6e8', marginTop: 50, padding: 20 }}>
                        { isLoading &&  <View style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                                            <Spinner />
                                        </View>
                        }
                        <Item style={{ marginBottom: 10 }}>
                            <Icon type="MaterialIcons" active name='mail-outline' />
                            <Input value={email} onChangeText={text => this.changeFormValues(text, "email")} placeholder='Enter your email'/>
                        </Item>
                        <Item style={{ marginBottom: 20 }}>
                            <Icon type="Feather" active name='lock' />
                            <Input value={password} onChangeText={text => this.changeFormValues(text, "password")} placeholder='Enter your password'/>
                        </Item>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button onPress={() => this.handleSubmit()} primary><Text>Log in</Text></Button>
                        </View>
                    </View>
                </Content>
                <FlashMessage position="top" />
            </Container>
        )
    }
}

export default Login;