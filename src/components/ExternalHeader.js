import React from 'react';
import { connect } from 'react-redux';
import { navigate } from '@reach/router';
import { Link } from 'gatsby';
import { Drawer, Badge } from 'antd';
import { Button, Icon } from 'tabler-react';
import { showMobile } from '../actions';
import MobileMenu from './MobileMenu';
import logo3 from '../../static/PurifyWhiteLogo_2.png';

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
            
                <Link className="external-title" to="/">
                    <img src={logo3} height="55" alt="Purify Cloud Logo" />
                    <Badge count={"Beta"}>
                        <div className="external-title-name">Purify</div>
                    </Badge>
                </Link>  
                <div className="mobile-menu-button">
                    <Button.List>
                        <Button color="green" onClick={this.toggleMobile}>Menu</Button>
                    </Button.List>
                </div>
                <div className="external-menu">
                    <Link activeClassName="active-link" to="/app/features">Why Purify?</Link>
                    <Link activeClassName="active-link" to="/app/pricing">Pricing</Link> 
                    <Link activeClassName="active-link" to="/app/docs">Docs</Link>       
                </div>
                <div className="right-menu">
                    <Link className="login-link" to="/app/login">Sign In</Link>
                </div>
                {/* <div className="modal-container">
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
                </div> */}
                <Drawer
                    title={this.state.title}
                    placement="right"
                    closable={false}
                    onClose={this.toggleMobile}
                    visible={this.state.showMobile}
                    >
                    {this.state.ruleId !== null && <MobileMenu />}
                </Drawer>
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