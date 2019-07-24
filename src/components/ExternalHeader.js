import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Link } from 'gatsby';
import { Button, Modal } from 'antd';
import { showMobile } from '../actions';
import MobileMenu from './MobileMenu';

class ExternalHeader extends React.Component {
    state = {
        showMobile: false
    }

    toggleMobile = () => {
        this.props.showMobile()
        this.setState({
            showMobile: !this.state.showMobile
        })
    }

    signUp = () => {
        navigate('/app/signup');
    }

    render() {
        return (
            <div className="external-header">
                <div className="external-title">
                    <Link activeClassName="active-link" to="/">PurifyCloud</Link>  
                </div>
                <div className="mobile-menu-button">
                    <Button onClick={this.toggleMobile}>Menu</Button>
                </div>
                <div className="external-menu">
                    <Link activeClassName="active-link" to="/app/features">Why Purify?</Link>
                    <Link activeClassName="active-link" to="/app/pricing">Pricing</Link> 
                    <Link activeClassName="active-link" to="/app/docs">Docs</Link>       
                </div>
                <div className="right-menu">
                    <Link className="login-link" to="/app/login">Log In</Link>
                    <Button onClick={this.signUp} type="default">Sign Up</Button>
                </div>
                <div className="modal-container">
                    <Modal
                        title={null}
                        visible={this.state.showMobile}
                        onCancel={this.toggleMobile}
                        closable
                        style={{ margin: "auto" }}
                        footer={null}
                        >
                        <MobileMenu />
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobileMenu: state.mobile.mobileMenu
    }
}

export default connect(mapStateToProps, { showMobile })(ExternalHeader);