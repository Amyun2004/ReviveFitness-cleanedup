import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersResponse = await fetch('http://localhost:8080/api/members');
        if (!membersResponse.ok) throw new Error('Failed to fetch members');
        const membersData = await membersResponse.json();
        setMembers(membersData);
        setFilteredMembers(membersData);

        const programsResponse = await fetch('http://localhost:8080/api/programs');
        if (!programsResponse.ok) throw new Error('Failed to fetch programs');
        const programsData = await programsResponse.json();
        setPrograms(programsData);

      } catch (err) {
        console.error('Data fetching error:', err);
        setError("Failed to load data. Please check the server connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const result = members.filter(member =>
      member.name.toLowerCase().includes(lowercasedQuery) ||
      member.email.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredMembers(result);
  }, [searchQuery, members]);

  const handleEdit = (program) => {
    setEditId(program.id);
    setEditValues({ name: program.name, description: program.description });
  };

  const handleSave = async (programId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editValues.name, description: editValues.description }),
      });

      if (!response.ok) throw new Error('Failed to update program');

      const updatedProgram = await response.json();
      setPrograms(programs.map(p => (p.id === programId ? updatedProgram : p)));
      setEditId(null);
    } catch (err) {
      console.error('Update error:', err);
      setError("Failed to save changes. Please try again.");
    }
  };

  if (loading) return (
    <div className={styles.container}>
      <Navbar />
      <p>Loading...</p>
    </div>
  );
  if (error) return (
    <div className={styles.container}>
      <Navbar />
      <p className={styles.formError}>{error}</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.sectionTitleWrapper}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.underline}></div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Members</h2>
          <input
            type="text"
            placeholder="Search members by name or email..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.scrollableTableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Edit Programs</h2>
          <div className={styles.scrollablePrograms}>
            {programs.map(program => (
              <div key={program.id} className={styles.programCard}>
                {editId === program.id ? (
                  <>
                    <input
                      type="text"
                      className={styles.input}
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      placeholder="Name"
                    />
                    <textarea
                      className={styles.input}
                      value={editValues.description}
                      onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                      placeholder="Description"
                    />
                    <button className={styles.saveBtn} onClick={() => handleSave(program.id)}>Save</button>
                  </>
                ) : (
                  <>
                    <h3>{program.name}</h3>
                    <p>{program.description}</p>
                    <button className={styles.editBtn} onClick={() => handleEdit(program)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}