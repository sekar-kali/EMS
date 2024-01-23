import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';

const MissionList = () => {
  const [missions, setMissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChoice, setFilterChoice] = useState('all');

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterChoice(e.target.value);
  };

  const filterMissions = (mission) => {
    const lowercasedQuery = searchQuery.toLowerCase();

    switch (filterChoice) {
      case 'assignedStaff':
        return mission.assignedTo && (
          mission.assignedTo.firstName.toLowerCase().includes(lowercasedQuery) ||
          mission.assignedTo.lastName.toLowerCase().includes(lowercasedQuery)
        );
      case 'title':
        return mission.title.toLowerCase().includes(lowercasedQuery);
      case 'startDate':
        return moment(mission.startDate).format('DD/MM/YYYY').includes(lowercasedQuery);
      case 'endDate':
        return moment(mission.endDate).format('DD/MM/YYYY').includes(lowercasedQuery);
      default:
        return (
          mission.title.toLowerCase().includes(lowercasedQuery) ||
          (mission.assignedTo &&
            (mission.assignedTo.firstName.toLowerCase().includes(lowercasedQuery) ||
            mission.assignedTo.lastName.toLowerCase().includes(lowercasedQuery))) ||
          moment(mission.startDate).format('DD/MM/YYYY').includes(lowercasedQuery) ||
          moment(mission.endDate).format('DD/MM/YYYY').includes(lowercasedQuery)
        );
    }
  };

  const filteredMissions = missions.filter(filterMissions);

  return (
    <>
      <MenuAdmin />

      <div className="main-container">
        <h1>Mission List</h1>
        <div className='search-bar'>
          <input
            type="text"
            placeholder="Search by Assigned Staff, Title, Start Date, or End Date"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={filterChoice} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="assignedStaff">Assigned Staff</option>
            <option value="title">Title</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>
        </div>
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
              {filteredMissions.map((mission) => (
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
