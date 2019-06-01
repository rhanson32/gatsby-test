import React from 'react';
import { connect } from 'react-redux';
import Loading from './Loading';
import RuleItem from './RuleItem';
import Header from './Header'
import { saveUser, getRules, getCurrentUser } from '../actions';

class RulesPage extends React.Component {
    componentDidMount = async () => {
        console.log(this.props)
        if(!this.props.User.email)
        {
            await this.props.getCurrentUser()
            this.props.getRules(this.props.User)
        }
        else {
            this.props.getRules(this.props.User);
        }
        
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <Header />
                <div className="accounts">
                {
                    this.props.Rules.length === 0 && (
                        <Loading type="spokes" color="333"/>
                    )
                }
                {
                    this.props.Rules.length !== 0 && (
                        <div className="rule-list">
                            <div className="rule-header">
                                <div className="rule-name">
                                    Name
                                </div>
                                <div className="rule-category">
                                    Category
                                </div>
                                <div className="rule-status">
                                    Status
                                </div>
                            </div>
                            {this.props.Rules.map((rule, index) => {
                                return (
                                    <RuleItem key={index} rule={rule} />
                                )
                            })}
                        </div>
                    )
                }  
                </div> 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        Rules: state.rules,
        User: state.user
    }
}

export default connect(mapStateToProps, { saveUser, getRules, getCurrentUser })(RulesPage);