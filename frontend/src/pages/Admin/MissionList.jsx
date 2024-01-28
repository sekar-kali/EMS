import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Spinner from '../../components/Spinner.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Footer';
import MenuAdmin from '../../components/MenuAdmin';


const MissionList = () => {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChoice, setFilterChoice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [missionPerPage] = useState(10);

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
          setLoading(false);
        } else {
          console.error('Error fetching missions:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching missions:', error.message);
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterChoice(e.target.value);
    setCurrentPage(1);
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
  
  const handleDeleteMission = async (missionId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/delete-mission/${missionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted mission from the local state
        setMissions((prevMissions) => prevMissions.filter((mission) => mission._id !== missionId));
        toast.success('Mission deleted successfully!');
      } else {
        toast.error('Error deleting mission:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting mission:', error.message);
    }
  };
  
  

  const indexOfLastMission = currentPage * missionPerPage;
  const indexOfFirstMission = indexOfLastMission - missionPerPage;
  const currentMissionList = missions.filter(filterMissions).slice(indexOfFirstMission, indexOfLastMission);

  const renderMissionList = currentMissionList.map((mission, index) => (
    <tr key={mission._id}>
      <td data-label="Number">{indexOfFirstMission + index + 1}</td>
      <td data-label="Title">{mission.title}</td>
      <td data-label="Description">{mission.description}</td>
      <td data-label="From">{formatDate(mission.startDate)}</td>
      <td data-label="To">{formatDate(mission.endDate)}</td>
      <td data-label="Assigned Staff">{mission.assignedTo ? `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 'N/A'}</td>
      <td>
      <button className="delete" onClick={() => handleDeleteMission(mission._id)}>Delete</button>
      </td>

    </tr>
  ));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <MenuAdmin />

      <main className="main-container slide-in">
        <h1>Mission List</h1>
        <article className='search-bar'>
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
        </article>
        <article className='mission-list'>
          {loading ? (
            <Spinner />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Assigned Staff</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {renderMissionList}
              </tbody>
            </table>
          )}
        </article>
        <aside className="pagination">
          {Array.from({ length: Math.ceil(missions.filter(filterMissions).length / missionPerPage) }, (_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </aside>
      </main>
      <ToastContainer />
    </>
  );
};

export default MissionList;
