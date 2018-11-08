import React, { Component } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { Text, Spinner, Input, Item, Container, Header, Body, Content, Left, Right, Button, Icon, Title } from 'native-base';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { IP_ADDRESS } from '../../authentication/local';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            email: '',
            password: '',
            password2: '',
            isLoading: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    changeFormValues = (val, field) => {
        this.setState({ [field] : val })
    };

    handleSubmit() {
        const { email, password } = this.state;
        const user = {
            email,
            password
        };

        console.log(JSON.stringify(user));
        this.registerUser(user)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    registerUser(user) {
        this.setState({ isLoading: true });
        axios.request({
            method: 'post',
            url: `http://${IP_ADDRESS}/api/Users`,
            data: user,
        }).then(response => {
            // this.clearUserInputs();
            console.log(response.data);
            const { id, email } = response.data;
            const { displayName } = this.state;
            const userData = {
                email,
                displayName,
                userId: id,
                reputationNumber: 0,
                questions: [],
                answers: [],
                notificationAnswers: []
            }

            return axios.request({
                method: 'post',
                url: `http://${IP_ADDRESS}/api/userDatas`,
                data: userData
            });

            }).then(response => {
                console.log("userData: ", response.data);
                this.setState({ isLoading: false }, () => {
                    showMessage({
                        message: "Status",
                        description: "Successefully Registered",
                        type: "success",
                    });
                    this.timeout = setTimeout(() => {
                        this.props.navigation.navigate('Login');
                    }, 2500);
                });
            }).catch(err => {
                console.log("ERR: ", err);
                this.setState({ isLoading: false }, () => {
                    showMessage({
                        message: "Status",
                        description: "Failed to register",
                        type: "danger",
                    });
                });
            })
        
    }

    render() {
        const { displayName, email, password, password2, isLoading } = this.state;
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
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Sign up</Title>
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
                            <Icon type="Feather" active name='user' />
                            <Input value={displayName} onChangeText={text => this.changeFormValues(text, "displayName")} placeholder='Enter display name'/>
                        </Item>
                        <Item style={{ marginBottom: 10 }}>
                            <Icon type="MaterialIcons" active name='mail-outline' />
                            <Input value={email} onChangeText={text => this.changeFormValues(text, "email")} placeholder='Enter your mail'/>
                        </Item>
                        <Item style={{ marginBottom: 10 }}>
                            <Icon type="Feather" active name='lock' />
                            <Input value={password} onChangeText={text => this.changeFormValues(text, "password")} placeholder='Enter your password'/>
                        </Item>
                        <Item style={{ marginBottom: 20 }}>
                            <Icon type="Feather" active name='lock' />
                            <Input value={password2} onChangeText={text => this.changeFormValues(text, "password2")} placeholder='Confirm your password'/>
                        </Item>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button onPress={() => this.handleSubmit()} primary><Text>Sign up</Text></Button>
                        </View>
                    </View>
                </Content>
                <FlashMessage position="top" />
            </Container>
        )
    }
}

export default Signup;