import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import MenuAdmin from '../components/MenuAdmin';
import Header from '../components/Header';

const MissionList = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    // Fetch missions from the backend API and update the state
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/admin/missions-list');
        if (response.ok) {
          const missionData = await response.json();
          setMissions(missionData);
        } else {
          console.error('Error fetching missions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching missions:', error.message);
      }
    };

    fetchMissions();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <Header />
      <MenuAdmin/>

      <div className="main-container">
      <h2>Mission List</h2>
      <ul>
        {missions.map((mission) => (
          <li key={mission._id}>
            <strong>Title:</strong> {mission.title} <br />
            <strong>Description:</strong> {mission.description} <br />
            <strong>Start Date:</strong> {mission.startDate} <br />
            <strong>End Date:</strong> {mission.endDate} <br />
            <strong>Assigned Staff:</strong> {mission.staffId ? `${mission.staffId.firstName} ${mission.staffId.lastName}` : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
    <Footer />
    </>
  );
};

export default MissionList;
