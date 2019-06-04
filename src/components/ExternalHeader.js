import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'gatsby';
import { FaBars } from 'react-icons/fa';
import { showMobile } from '../actions';
import MobileMenu from './MobileMenu';

class ExternalHeader extends React.Component {
    state = {
        showMobile: false
    }

    toggleMobile = () => {
        this.props.showMobile()
    }
    render() {
        return (
            <div className="external-header">
                <div className="external-title">
                    <button className="mobile-menu-button" onClick={this.toggleMobile}>
                        <FaBars />
                    </button>
                    <Link activeClassName="active-link" to="/">PurifyCloud</Link>
                </div>
                <div className="external-menu">
                    <Link activeClassName="active-link" to="/app/features">Why Purify?</Link>
                    <Link activeClassName="active-link" to="/app/pricing">Pricing</Link> 
                    <Link activeClassName="active-link" to="/app/docs">Docs</Link>       
                </div>  
                <div className="right-menu">
                    <Link className="login-link" to="/app/login">Log In</Link>
                    <Link className="sign-up-link" to="/app/signup">Sign Up</Link>
                </div>
                {this.props.mobileMenu && <MobileMenu />}
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