import React from "react";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppRegistry, Image, StatusBar, View } from "react-native";
import {
    Button,
    Text,
    Container,
    List,
    ListItem,
    Content,
    Icon,
    Left,
    Right,
    Body
} from "native-base";
import { isUserAuthenticated } from '../withStorage';

const unauthRoutes = [
    { name: "Home", nameDisplay: "Home", icon: 'home', type: 'Feather' },
    { name: "Login", nameDisplay: "Login", icon: 'login', type: 'Entypo' },
    { name: "Signup", nameDisplay: "Signup", icon: 'edit', type: 'Feather' },
];

const authRoutes = [
    { name: "Home", nameDisplay: "Home", icon: 'home', type: 'Feather' },
    { name: "Account", nameDisplay: "Account", icon: 'user', type: 'Entypo' }
]

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserAuthenticated: false
        }
    }

    componentDidMount() {
        this.handleAuthentication();
    }

    componentWillReceiveProps() {
        this.handleAuthentication();
    }

    handleAuthentication = () => isUserAuthenticated().then(res => this.setUserAuthentication(!!res));

    setUserAuthentication = value => this.setState({ isUserAuthenticated: value });

    render() {
        const { isUserAuthenticated } = this.state;
        return (
            <Container>
                <Content>
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(243, 238, 238)' }}>
                        <MaterialIcons name='question-answer' size={100} color="black" />
                    </View>

                    <List
                        dataArray={isUserAuthenticated ? authRoutes : unauthRoutes}
                        contentContainerStyle={{ marginTop: 30 }}
                        renderRow={data => {
                            return (
                                <ListItem
                                    // style={{ borderWidth: 1, borderColor: 'green' }}
                                    onPress={() => this.props.navigation.navigate(data.name)}
                                >
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon type={data.type} style={{ textAlign: 'center' ,color: '#555', width: 30 }} name={data.icon} />
                                        <Text style={{ paddingLeft: 30, color: '#72858c' }}>{data.nameDisplay}</Text>
                                    </View>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}
