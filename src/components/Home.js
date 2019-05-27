import React from 'react'
import { connect } from 'react-redux';
import Splash from './Splash';
import Features from './Features';
import ExternalHeader from './ExternalHeader';
import MobileMenu from './MobileMenu';

class Home extends React.Component {

    render() {
        return (
            <div>
                <ExternalHeader />
                {this.props.mobile.mobileMenu && <MobileMenu />}
                <Splash />
                <Features />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        mobile: state.mobile
    }
}

export default connect(mapStateToProps, null)(Home);