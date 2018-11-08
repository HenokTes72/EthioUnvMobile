import React, { Component } from 'react';
import axios from 'axios';
import { orderBy } from 'lodash';
import io from 'socket.io-client';
import Question from './Question';
import { Spinner } from 'native-base';
import { IP_ADDRESS } from '../../authentication/local';

const SORTS = {
  Newest: list => orderBy(list, ['id'], ['desc']),
  Intersting: list => orderBy(list, ['voteNumber'], ['desc']),
  Views: list => orderBy(list, ['numberOfViews'], ['desc'])
}

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            isLoading: false,
        }

        this.socket = io(`http://${IP_ADDRESS}`);
    }

    componentDidMount() {
        this.getQuestions();
        this.socket.on('update', message => {
           console.log("socket update is called");
           this.getQuestions();
        })
    }

    componentWillUnmount() {
        this.socket.close();
    }

    componentWillReceiveProps() {
        console.log("will receive props");
        this.getQuestions();
    }

    getQuestions = () => {
        this.setState({ isLoading: true });
        axios.get(`http://${IP_ADDRESS}/api/questions`)
            .then(response => {
                console.log('questions: ', response.data);
                this.setState({ questions: response.data, isLoading: false })
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                console.log('QUESTIONS ERR: '+err);
                // this.props.history.push('/');
            })
    }

    render() {
        const sortBy = this.props.sortBy;
        const { questions, isLoading } = this.state;
        console.log("SortBy: ", sortBy);
        return (
            <React.Fragment>
                {
                    isLoading && <Spinner />
                }
                {
                    (SORTS[sortBy](questions)).map(question => (
                        <Question  key={question.id} question={question} />
                    ))
                }
                
            </React.Fragment>
        )
    }
}

export default Questions;