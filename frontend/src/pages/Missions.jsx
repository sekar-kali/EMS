import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuAdmin from '../components/MenuAdmin';
import MissionsList from './MissionList';
import CreateMission from './CreateMission';

const Missions = () => {
  return (
    <>
      <Header />
      <MenuAdmin />
      <div className="main-container">
        <h1>Missions Page</h1>
        <MissionsList />
        <CreateMission />
      </div>
      <Footer />
    </>
  );
};

export default Missions;
