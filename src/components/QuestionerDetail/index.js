import React, { Component } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import { Text } from 'native-base';
import { IP_ADDRESS } from '../../authentication/local';

class QuestionerDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: '',
        }

        const { questionerId } = this.props;

        this.getUser(questionerId);
    }

    componentWillReceiveProps() {
        this.getUser(this.props.questionerId);
    }

    // componentDidMount() {
    //     console.log("*********************************");
    //     const questionerId = this.props.questionerId;
    //     console.log("questionerId: ", questionerId);
    //     this.getUser(questionerId);
    // }

    getUser = questionerId => {
        console.log("questioner details: ", questionerId);
        axios.get(`http://${IP_ADDRESS}/api/userDatas/${questionerId}`)
            .then(response => {
                this.setState({ userData: response.data });
            })
            .catch(err => {
                console.log("WHAT THE FUCK ERR: "+err);
            });
    }

    render() {
        const { userData } = this.state;

        return(
            <View style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ width: 200, backgroundColor: '#E1ECF4', padding: 3, paddingBottom: 5 }}>
                    <Text style={{ marginBottom: 3, fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>{this.props.date}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ height: 32, width: 32, backgroundColor: '#393232' }}></View>
                        <View style={{ display: 'flex', flexDirection: 'column', paddingLeft: 5, marginTop: -3 }}>
                            <Text style={{ fontSize: 13, marginBottom: 0, color: '#393232' }}>{ userData && userData.displayName }</Text>
                            <Text style={{ fontSize: 12, marginBottom: 0, color: '#848d95' }}>{ userData && userData.reputationNumber }</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default QuestionerDetail;