import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import '../../auth.css'

const StaffMissionsList = () => {
  const [upcomingMissions, setUpcomingMissions] = useState([]);
  const [pastMissions, setPastMissions] = useState([]);

  useEffect(() => {
    // Fetch staff's missions
    const fetchStaffMissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff/staff-missions');
        if (response.ok) {
          const missionsData = await response.json();
          const currentDate = new Date();

          // Filter upcoming and past missions
          const upcoming = missionsData.filter(
            (mission) => new Date(mission.startDate) > currentDate
          );
          const past = missionsData.filter(
            (mission) => new Date(mission.endDate) < currentDate
          );

          setUpcomingMissions(upcoming);
          setPastMissions(past);
        } else {
          console.error('Error fetching staff missions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff missions:', error.message);
      }
    };

    fetchStaffMissions();
  }, []);

  return (
    <>
      <MenuStaff />
      <div className="main-container">
      <div className="missions-list">
        <h1>Staff Missions List</h1>
        <div className='form-flex'>
        <div className="upcoming-missions">
          <h2>Upcoming Missions</h2>
          <ul>
            {upcomingMissions.map((mission) => (
              <li key={mission._id}>
                {mission.title} - {mission.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="past-missions">
          <h2>Past Missions</h2>
          <ul>
            {pastMissions.map((mission) => (
              <li key={mission._id}>
                {mission.title} - {mission.description}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffMissionsList;
