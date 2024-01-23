import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';

const MissionList = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    const fetchMissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/missions-list', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

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
  }, []);
  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };
  return (
    <>
      <MenuAdmin />

      <div className="main-container">
        <h1>Mission List</h1>
        <div className='staff-list'>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Assigned Staff</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((mission) => (
                <tr key={mission._id}>
                  <td>{mission.title}</td>
                  <td>{mission.description}</td>
                  <td>{formatDate(mission.startDate)}</td>
                  <td>{formatDate(mission.endDate)}</td>
                  <td>{mission.assignedTo ? `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 'N/A'}</td>
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
