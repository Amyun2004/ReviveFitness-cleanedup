import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

// Stats card component
const StatsCard = ({ title, value }) => (
  <div className={styles.statsCard}>
    <h3 className={styles.statsTitle}>{title}</h3>
    <p className={styles.statsValue}>{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Edit states for programs
  const [editProgramId, setEditProgramId] = useState(null);
  const [editProgramValues, setEditProgramValues] = useState({
    name: '',
    description: '',
    duration: '',
    benefits: '',
    imageUrl: ''
  });
  
  // Edit state for challenge
  const [editingChallenge, setEditingChallenge] = useState(false);
  const [editChallengeValues, setEditChallengeValues] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, programsResponse, statsResponse, challengeResponse, allChallengesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/members'),
          fetch('http://localhost:8080/api/programs'),
          fetch('http://localhost:8080/api/admin/stats'),
          fetch('http://localhost:8080/api/current-challenges'),
          fetch('http://localhost:8080/api/current-challenges/all'),
        ]);

        if (!membersResponse.ok) throw new Error('Failed to fetch members');
        if (!programsResponse.ok) throw new Error('Failed to fetch programs');
        if (!statsResponse.ok) throw new Error('Failed to fetch dashboard stats');
        if (!challengeResponse.ok) throw new Error('Failed to fetch current challenge');

        const membersData = await membersResponse.json();
        setMembers(membersData);
        setFilteredMembers(membersData);

        const programsData = await programsResponse.json();
        setPrograms(programsData);
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        const challengeData = await challengeResponse.json();
        setCurrentChallenge(challengeData);
        
        if (allChallengesResponse.ok) {
          const allChallengesData = await allChallengesResponse.json();
          setAllChallenges(allChallengesData);
        }

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

  // Program editing functions
  const handleEditProgram = (program) => {
    setEditProgramId(program.id);
    setEditProgramValues({
      name: program.name || '',
      description: program.description || '',
      duration: program.duration || '',
      benefits: program.benefits || '',
      imageUrl: program.imageUrl || ''
    });
  };

  const handleSaveProgram = async (programId) => {
    try {
      const isNewProgram = programId === 'new';
      const url = isNewProgram 
        ? 'http://localhost:8080/api/programs' 
        : `http://localhost:8080/api/programs/${programId}`;
      
      const response = await fetch(url, {
        method: isNewProgram ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProgramValues),
      });

      if (!response.ok) throw new Error('Failed to save program');

      const savedProgram = await response.json();
      
      if (isNewProgram) {
        setPrograms([...programs, savedProgram]);
      } else {
        setPrograms(programs.map(p => (p.id === programId ? savedProgram : p)));
      }
      
      setEditProgramId(null);
      setSuccess(isNewProgram ? 'Program created successfully!' : 'Program updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError("Failed to save program. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/programs/${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete program');

      setPrograms(programs.filter(p => p.id !== programId));
      setSuccess('Program deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError("Failed to delete program. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  // Challenge editing functions
  const handleEditChallenge = (challenge) => {
    setEditingChallenge(true);
    setEditChallengeValues({
      id: challenge.id,
      title: challenge.title || '',
      description: challenge.description || '',
      imageUrl: challenge.imageUrl || ''
    });
  };

  const handleCreateChallenge = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/current-challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editChallengeValues.title,
          description: editChallengeValues.description,
          imageUrl: editChallengeValues.imageUrl
        }),
      });

      if (!response.ok) throw new Error('Failed to create challenge');

      const newChallenge = await response.json();
      setAllChallenges([...allChallenges, newChallenge]);
      setEditingChallenge(false);
      setSuccess('Challenge created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Create error:', err);
      setError("Failed to create challenge. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveChallenge = async (challengeId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/current-challenges/${challengeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editChallengeValues.title,
          description: editChallengeValues.description,
          imageUrl: editChallengeValues.imageUrl
        }),
      });

      if (!response.ok) throw new Error('Failed to update challenge');

      const updatedChallenge = await response.json();
      
      if (currentChallenge && currentChallenge.id === challengeId) {
        setCurrentChallenge(updatedChallenge);
      }
      setAllChallenges(allChallenges.map(c => c.id === challengeId ? updatedChallenge : c));
      setEditingChallenge(false);
      setSuccess('Challenge updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError("Failed to save challenge changes. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/current-challenges/${challengeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete challenge');

      setAllChallenges(allChallenges.filter(c => c.id !== challengeId));
      if (currentChallenge && currentChallenge.id === challengeId) {
        // Set the first available challenge as current, or null
        const remaining = allChallenges.filter(c => c.id !== challengeId);
        setCurrentChallenge(remaining[0] || null);
      }
      setSuccess('Challenge deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError("Failed to delete challenge. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSetAsCurrent = async (challengeId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/current-challenges/${challengeId}/set-current`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to set current challenge');

      const newCurrent = await response.json();
      setCurrentChallenge(newCurrent);
      setSuccess('Challenge set as current successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Set current error:', err);
      setError("Failed to set current challenge. Please try again.");
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/adminlogin');
  };

  if (loading) return (
    <div className={styles.container}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.sectionTitleWrapper}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.underline}></div>
        </header>

        {/* Success/Error Messages */}
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Dashboard Statistics Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Dashboard Overview</h2>
          <div className={styles.statsGrid}>
            <StatsCard title="Total Members" value={stats.totalMembers || 0} />
            <StatsCard title="Total Programs" value={stats.totalPrograms || 0} />
            <StatsCard title="Active Admins" value={stats.totalActiveAdmins || 0} />
            <StatsCard title="Today's Attendance" value={stats.todayAttendance || 0} />
          </div>
        </section>

        {/* Current Challenge Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Manage Challenges</h2>
            <button 
              className={styles.addProgramBtn} 
              onClick={() => {
                setEditingChallenge(true);
                setEditChallengeValues({
                  id: 'new',
                  title: '',
                  description: '',
                  imageUrl: ''
                });
              }}
            >
              + Add New Challenge
            </button>
          </div>
          
          {/* Show new challenge form */}
          {editingChallenge && editChallengeValues.id === 'new' && (
            <div className={styles.challengeCard}>
              <div className={styles.editForm}>
                <h3 style={{color: '#facc15', marginBottom: '1rem'}}>Create New Challenge</h3>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editChallengeValues.title}
                    onChange={(e) => setEditChallengeValues({...editChallengeValues, title: e.target.value})}
                    placeholder="Challenge Title"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={editChallengeValues.description}
                    onChange={(e) => setEditChallengeValues({...editChallengeValues, description: e.target.value})}
                    placeholder="Challenge Description"
                    rows="4"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editChallengeValues.imageUrl}
                    onChange={(e) => setEditChallengeValues({...editChallengeValues, imageUrl: e.target.value})}
                    placeholder="Image URL"
                  />
                </div>
                
                {editChallengeValues.imageUrl && (
                  <div className={styles.imagePreview}>
                    <img src={editChallengeValues.imageUrl} alt="Challenge preview" />
                  </div>
                )}
                
                <div className={styles.buttonGroup}>
                  <button className={styles.saveBtn} onClick={handleCreateChallenge}>Create Challenge</button>
                  <button className={styles.cancelBtn} onClick={() => setEditingChallenge(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Current Active Challenge */}
          {currentChallenge && (
            <div className={styles.challengeCard}>
              <h3 style={{color: '#4caf50', marginBottom: '1rem'}}>Current Active Challenge</h3>
              {editingChallenge && editChallengeValues.id === currentChallenge.id ? (
                <div className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editChallengeValues.title}
                      onChange={(e) => setEditChallengeValues({...editChallengeValues, title: e.target.value})}
                      placeholder="Challenge Title"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      className={styles.textarea}
                      value={editChallengeValues.description}
                      onChange={(e) => setEditChallengeValues({...editChallengeValues, description: e.target.value})}
                      placeholder="Challenge Description"
                      rows="4"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Image URL</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editChallengeValues.imageUrl}
                      onChange={(e) => setEditChallengeValues({...editChallengeValues, imageUrl: e.target.value})}
                      placeholder="Image URL"
                    />
                  </div>
                  
                  {editChallengeValues.imageUrl && (
                    <div className={styles.imagePreview}>
                      <img src={editChallengeValues.imageUrl} alt="Challenge preview" />
                    </div>
                  )}
                  
                  <div className={styles.buttonGroup}>
                    <button className={styles.saveBtn} onClick={() => handleSaveChallenge(currentChallenge.id)}>Save Changes</button>
                    <button className={styles.cancelBtn} onClick={() => setEditingChallenge(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className={styles.challengeDisplay}>
                  <div className={styles.challengeContent}>
                    <h3>{currentChallenge.title}</h3>
                    <p>{currentChallenge.description}</p>
                    {currentChallenge.imageUrl && (
                      <img src={currentChallenge.imageUrl} alt={currentChallenge.title} className={styles.challengeImage} />
                    )}
                  </div>
                  <div className={styles.programActions}>
                    <button className={styles.editBtn} onClick={() => handleEditChallenge(currentChallenge)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteChallenge(currentChallenge.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* All Challenges List */}
          <div className={styles.scrollablePrograms} style={{marginTop: '2rem'}}>
            <h3 style={{color: '#facc15', marginBottom: '1rem'}}>All Challenges</h3>
            {allChallenges.filter(c => c.id !== currentChallenge?.id).map(challenge => (
              <div key={challenge.id} className={styles.challengeCard}>
                <div className={styles.challengeDisplay}>
                  <div className={styles.challengeContent}>
                    <h4>{challenge.title}</h4>
                    <p>{challenge.description}</p>
                  </div>
                  <div className={styles.programActions}>
                    <button className={styles.saveBtn} onClick={() => handleSetAsCurrent(challenge.id)}>Set as Current</button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteChallenge(challenge.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Programs Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Manage Programs</h2>
            <button 
              className={styles.addProgramBtn} 
              onClick={() => {
                setEditProgramId('new');
                setEditProgramValues({
                  name: '',
                  description: '',
                  duration: '',
                  benefits: '',
                  imageUrl: ''
                });
              }}
            >
              + Add New Program
            </button>
          </div>
          
          {/* Show new program form at the top if creating new */}
          {editProgramId === 'new' && (
            <div className={styles.programCard}>
              <div className={styles.editForm}>
                <h3 style={{color: '#facc15', marginBottom: '1rem'}}>Create New Program</h3>
                <div className={styles.formGroup}>
                  <label>Program Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editProgramValues.name}
                    onChange={(e) => setEditProgramValues({...editProgramValues, name: e.target.value})}
                    placeholder="Program Name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={editProgramValues.description}
                    onChange={(e) => setEditProgramValues({...editProgramValues, description: e.target.value})}
                    placeholder="Description"
                    rows="3"
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Duration</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editProgramValues.duration}
                      onChange={(e) => setEditProgramValues({...editProgramValues, duration: e.target.value})}
                      placeholder="e.g., 3 months"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Cost/Benefits</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editProgramValues.benefits}
                      onChange={(e) => setEditProgramValues({...editProgramValues, benefits: e.target.value})}
                      placeholder="e.g., $99/month"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editProgramValues.imageUrl}
                    onChange={(e) => setEditProgramValues({...editProgramValues, imageUrl: e.target.value})}
                    placeholder="Image URL"
                  />
                </div>
                
                {editProgramValues.imageUrl && (
                  <div className={styles.imagePreview}>
                    <img src={editProgramValues.imageUrl} alt="Program preview" />
                  </div>
                )}
                
                <div className={styles.buttonGroup}>
                  <button className={styles.saveBtn} onClick={() => handleSaveProgram('new')}>Create Program</button>
                  <button className={styles.cancelBtn} onClick={() => setEditProgramId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          
          <div className={styles.scrollablePrograms}>
            {programs.map(program => (
              <div key={program.id} className={styles.programCard}>
                {editProgramId === program.id ? (
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Program Name</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editProgramValues.name}
                        onChange={(e) => setEditProgramValues({...editProgramValues, name: e.target.value})}
                        placeholder="Program Name"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        className={styles.textarea}
                        value={editProgramValues.description}
                        onChange={(e) => setEditProgramValues({...editProgramValues, description: e.target.value})}
                        placeholder="Description"
                        rows="3"
                      />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Duration</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={editProgramValues.duration}
                          onChange={(e) => setEditProgramValues({...editProgramValues, duration: e.target.value})}
                          placeholder="e.g., 3 months"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label>Cost/Benefits</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={editProgramValues.benefits}
                          onChange={(e) => setEditProgramValues({...editProgramValues, benefits: e.target.value})}
                          placeholder="e.g., $99/month"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Image URL</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={editProgramValues.imageUrl}
                        onChange={(e) => setEditProgramValues({...editProgramValues, imageUrl: e.target.value})}
                        placeholder="Image URL"
                      />
                    </div>
                    
                    {editProgramValues.imageUrl && (
                      <div className={styles.imagePreview}>
                        <img src={editProgramValues.imageUrl} alt="Program preview" />
                      </div>
                    )}
                    
                    <div className={styles.buttonGroup}>
                      <button className={styles.saveBtn} onClick={() => handleSaveProgram(program.id)}>Save</button>
                      <button className={styles.cancelBtn} onClick={() => setEditProgramId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.programDisplay}>
                    <div className={styles.programHeader}>
                      <h3>{program.name}</h3>
                      <div className={styles.programActions}>
                        <button className={styles.editBtn} onClick={() => handleEditProgram(program)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteProgram(program.id)}>Delete</button>
                      </div>
                    </div>
                    <p className={styles.programDesc}>{program.description}</p>
                    <div className={styles.programMeta}>
                      <span><strong>Duration:</strong> {program.duration || 'N/A'}</span>
                      <span><strong>Cost:</strong> {program.benefits || 'N/A'}</span>
                    </div>
                    {program.imageUrl && (
                      <img src={program.imageUrl} alt={program.name} className={styles.programImage} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Members Table Section */}
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
      </div>
    </div>
  );
}