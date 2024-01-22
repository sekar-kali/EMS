import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';
import Header from '../../components/Header';

const MissionList = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    // Fetch missions from the backend API and update the state
    const fetchMissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/missions-list');
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
      <MenuAdmin/>

      <div className="main-container">
      <h2>Mission List</h2>
      <div className='staff-list'>
        <table>
          <thead>
            <tr>
              <th>Title:</th>
              <th>Description:</th>
              <th>Start Date:</th>
              <th>End Date:</th>
              <th>Assigned Staff:</th>
            </tr>
          </thead>
          <tbody>
        {missions.map((mission) => (
          <tr key={mission._id}>
            <td>{mission.title}</td>
            <td>{mission.description}</td>
            <td>{mission.startDate}</td>
            <td>{mission.endDate}</td>
            <td>{mission.staffId ? `${mission.staffId.firstName} ${mission.staffId.lastName}` : 'N/A'}</td>
          </tr>
        ))}
        </tbody>
        </table>
        </div>
    </div>
    <Footer />
    </>
  );
};

export default MissionList;
