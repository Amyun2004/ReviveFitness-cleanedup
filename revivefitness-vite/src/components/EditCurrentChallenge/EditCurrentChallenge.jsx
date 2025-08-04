// src/components/Admin/EditCurrentChallenge.jsx
import React, { useState, useEffect } from 'react';

const EditCurrentChallenge = () => {
  const [challenge, setChallenge] = useState({ title: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current challenge data to pre-populate the form
    fetch('http://localhost:8080/api/current-challenges')
      .then(res => res.json())
      .then(data => {
        setChallenge(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching challenge:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallenge(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/current-challenges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header for security
          // 'Authorization': `Bearer YOUR_ADMIN_TOKEN`
        },
        body: JSON.stringify(challenge)
      });
      if (response.ok) {
        alert('Challenge updated successfully!');
      } else {
        alert('Failed to update challenge.');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (loading) {
    return <div>Loading challenge data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Current Challenge</h2>
      <label>
        Title:
        <input type="text" name="title" value={challenge.title} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={challenge.description} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={challenge.imageUrl} onChange={handleChange} />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditCurrentChallenge;