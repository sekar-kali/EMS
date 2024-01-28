import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Footer from '../../components/Footer';
import MenuStaff from '../../components/MenuStaff';
import '../../auth.css';

const StaffMissionsList = () => {
  const [upcomingMissions, setUpcomingMissions] = useState([]);
  const [pastMissions, setPastMissions] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Declare authToken

  useEffect(() => {
    // Fetch staff's missions
    const authToken = localStorage.getItem('authToken');
    const email = JSON.parse(localStorage.getItem('user'));
    const fetchStaffMissions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/missions/${email}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
    
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
          console.log(upcoming);
        } else {
          console.error('Error fetching staff missions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching staff missions:', error.message);
      }
    };

    fetchStaffMissions();
  }, [authToken]);

  return (
    <>
      <MenuStaff />
      <div className="main-container slide-in">
        <div className="missions-list">
          <h1>Missions List</h1>
          <div className='form-flex'>
            <div className="upcoming-missions">
              <h2>Upcoming Missions</h2>
              <ul>
                {upcomingMissions.map((mission) => (
                  <li key={mission._id}>
                    {mission.title} - {mission.description} ({moment(mission.startDate).format('DD/MM/YYYY')})
                  </li>
                ))}
              </ul>
            </div>

            <div className="past-missions">
              <h2>Past Missions</h2>
              <ul>
                {pastMissions.map((mission) => (
                  <li key={mission._id}>
                    {mission.title} - {mission.description} ({moment(mission.endDate).format('DD/MM/YYYY')})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffMissionsList;
