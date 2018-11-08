import React from 'react';
import { View } from 'react-native';
import { H3, Text } from 'native-base';
import Answer from './Answer';

const Answers = (props) => {
    const { answers } = props;
    return (
        <View style={{ marginBottom: 20 }}>
            <View style={{ marginBottom: 15 ,paddingBottom: 5, borderBottomWidth: 1, borderBottomColor :'#e4e6e8', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <H3 style={{ fontSize: 18 }}>{ answers.length } { answers.length > 1 ? "Answers": "Answer" }</H3>
            </View>
            {
                answers.map(answer => (
                    <Answer key={answer} answerId={answer} />
                ))
            }
        </View>
    );
} 

export default Answers;