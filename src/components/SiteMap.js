import React from 'react';
import { Link } from 'gatsby';
import { navigate } from '@reach/router';
import logo2 from '../../static/PurifyWhiteLogo_2.png';
import { Button } from 'tabler-react';

class SiteMap extends React.Component {

    signUp = () => {
        navigate('/app/signup');
    }

    render() {
    return (
    <div className="site-map">
        <div className="site-map-logo">
        <Link to="/">
            <img src={logo2} alt="Purify Cloud logo" />
            <h1>Purify</h1>
        </Link>
        </div>
        <div className="footer-button">
            <div className="footer-button-header">
                No obligation or credit card required. Try us today. Upgrade to a paid account later for all features.
            </div>
            <div className="footer-button-main">
            <Button.List>
                <Button block color="green" onClick={this.signUp}>
                    Create Account
                </Button>
            </Button.List>
            </div>
        </div>
    </div>
    )
    }
}

export default SiteMap;