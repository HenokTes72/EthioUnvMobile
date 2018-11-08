import React from "react";
import { AppRegistry, View, StatusBar, StyleSheet, AsyncStorage } from "react-native";
import { NavigationActions } from "react-navigation";
import {
    H1,
    H2,
    Button,
    Text,
    Container,
    Body,
    Content,
    Header,
    Left,
    Right,
    Icon,
    Title,
    Input,
    InputGroup,
    Item,
    Tab,
    Tabs,
    Footer,
    FooterTab,
    Label,
    Badge
} from "native-base";
import Questions from '../Questions/index.js';
import { isUserAuthenticated, getToken, setToken, removeToken } from '../withStorage';

const styles = StyleSheet.create({
    filterButtons: {
        height: 35,
        borderWidth: 1,
        borderColor: '#e4e6e8'
    },
    activeButton: {
        borderColor: '#1890ff',
    },
    withOutRightBorder: {
        borderRightWidth: 0
    },
    withOutLeftBorder: {
        borderLeftWidth: 0
    },
    withOutRightBorderRadius: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    withOutLeftBorderRadius: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    buttonText: {
        color: 'rgba(0, 0, 0, 0.65)'
    }
})

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: 'Newest'
        }
    }

    update = () => {
        console.log("force update is called");
        this.forceUpdate();
    }

    componentDidMount() {
        this.changeListener = this.props.navigation.addListener('willFocus', this.update);
    }

    componentWillUnmount() {
        this.changeListener.remove();
    }

    askQuestion = () => {
        isUserAuthenticated().then(tokenId => {
            if(!!tokenId) {
                this.props.navigation.navigate("QuestionAsk");
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

    handleSortChange = val => this.setState({ sortBy: val });
    
    render() {
        const { sortBy } = this.state;
        const { navigate } = this.props.navigation;
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
                        <Title style={{ color: 'rgba(0,0,0,0.65)' }}>Ethio Unv</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <View style={{  marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button
                            onPress={this.askQuestion}
                            primary
                            iconLeft
                        >
                            <Icon type="Ionicons" name="ios-add" />
                            <Text>Ask Question</Text>
                        </Button>
                    </View>
                    <H2 style={{ marginBottom: 15, color: 'rgba(0, 0, 0, 0.65)' }}>Top Questions</H2>
                    <View style={{ borderBottomWidth: 1, borderBottomColor:'#e4e6e8', paddingLeft: 5, height: 50 ,display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 10 }}>
                        <Button onPress={() => this.handleSortChange('Newest')} style={[styles.withOutRightBorderRadius, styles.filterButtons, (sortBy === 'Newest' ? styles.activeButton : {})]} light><Text style={styles.buttonText}>Newest</Text></Button>
                        <Button onPress={() => this.handleSortChange('Intersting')} style={[ { borderRadius: 0 } ,styles.filterButtons, (sortBy === 'Intersting' ? styles.activeButton : {})]} light><Text style={styles.buttonText}>Intersting</Text></Button>
                        <Button onPress={() => this.handleSortChange('Views')} style={[styles.filterButtons, styles.withOutLeftBorderRadius, (sortBy === 'Views' ? styles.activeButton : {})]} light><Text style={styles.buttonText}>Views</Text></Button>
                    </View>
                    <Questions sortBy={sortBy}/>                    
                </Content>
            </Container>
        );
    }
}

export default HomeScreen;