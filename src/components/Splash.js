import React from 'react';
import logo from '../../static/PurifyWhiteLogo_2.png';
import { Button } from 'tabler-react';
import { navigate } from '@reach/router';

class Splash extends React.Component {

    
    signUp = () => {
        navigate('/app/signup');
    }

    learnMore = () => {
        navigate('/app/features');
    }

    render() {
        return (
                <div className="splash-overlay">
                    <div className="splash-image-container"><img src={logo} alt="Purify Cloud Logo" /></div>
                    <div className="splash-text">
                        <h2 className="splash-subtitle">Cloud Governance that fits your budget</h2>
                        <div className="splash-subtitle-new">Automated discovery of issues. Instant alerts. Live cross-account metrics. 30 day free trial and no long-term contracts. Cancel anytime.</div>
                        <div className="splash-signup">
                            <Button.List>
                                <Button size="lg" onClick={this.learnMore} color="white">Learn More</Button>
                                <Button size="lg" onClick={this.signUp} color="green">Create Free Account</Button>
                            </Button.List>
                        </div>
                    </div>
                </div>
        )
    }
}


export default Splash;