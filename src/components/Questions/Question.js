import React from 'react';
import moment from 'moment';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'native-base';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
    border: {
        borderWidth: 1,
        borderColor: 'red'
    }
})

const Question = (props) => {
    const { question } = props;
    return (    
        <View style={{ minHeight: 100 ,display: 'flex', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e4e6e8' }}>
            <View style={[{ flex: 0.3, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                <View style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>{question.voteNumber}</Text>
                    <Text style={{ fontSize: 11, color: '#9199a1' }}>{ question.voteNumber > 1 ? "votes" : "vote" }</Text>
                </View>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.65)' }}>{question.answers.length}</Text>
                    <Text style={{ fontSize: 11, color: '#9199a1' }}>{ props.question.answers.length > 1 ? "answers" : "answer" }</Text>
                </View>
            </View>
            <View style={{ padding: 5, flex: 0.7, display: 'flex', justifyContent: 'space-between' }}>
                <Text onPress={() => props.navigation.navigate('QuestionDetail', { questionId: question.id })} style={{ fontSize: 14, color: 'rgb(0, 119, 204)', marginBottom: 5 }}>{question.title}</Text>
                <View style={{ flexWrap: 'wrap' ,display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ flexWrap: 'wrap' ,marginBottom: 5, display: 'flex', flexDirection: 'row' }}>
                        {
                            question.tags.map(tag => (
                                <Button key={tag} small style={{ marginRight: 5, marginBottom: 5, padding: 0, backgroundColor: 'rgb(225, 236, 244)' }} ><Text style={{ padding: 0 ,color: 'rgba(0, 0, 0, 0.65)', fontSize: 10 }}>{tag}</Text></Button>
                            ))
                        }                        
                    </View>
                    <Text style={{ fontSize: 12, marginBottom: 5, color: 'rgb(145, 153, 161)' }}>{moment(question.date).fromNow()}</Text>
                </View>
            </View>
        </View>
    );
}

export default withNavigation(Question);