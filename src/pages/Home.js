import { CContainer } from '@coreui/react';
import React from 'react';
import { Banner } from '../components/Banner';
import { HOMEPAGE_BANNER } from '../constants/BannerOverlayConstants';

const Home = ({ onLoginClick, onRegisterClick, toggleToRegister, toggleToLogin }) => {
  return (
    <CContainer>
        {HOMEPAGE_BANNER.map((item, index) => (
            <Banner 
            image={item.image}
            title={item.title}
            text={item.text}
            isWithButton={true}
            onLoginClick={onLoginClick}/>
        ))}
    </CContainer>
  );
};

export default Home;