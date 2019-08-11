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
        <Link className="site-map-logo" to="/">
            <img src={logo2} />
            <h1>Purify</h1>
        </Link>
        </div>
        <div className="footer-button">
            <div className="footer-button-header">
                No obligation or credit card required. Try us today. Upgrade to a paid account later for all features.
            </div>
            <Button.List>
                <Button color="green" onClick={this.signUp}>
                    Create Account
                </Button>
            </Button.List>
        </div>
    </div>
    )
    }
}

export default SiteMap;