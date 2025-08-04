import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEditPage.module.css';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    profilePhotoUrl: ''
  });
  
  // Programs data
  const [allPrograms, setAllPrograms] = useState([]);
  const [enrolledProgramIds, setEnrolledProgramIds] = useState(new Set());
  
  // Photo upload preview and file state
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null); // New state for the selected file

  useEffect(() => {
    const storedMember = localStorage.getItem('member');
    if (!storedMember) {
      navigate('/login');
      return;
    }

    const parsedMember = JSON.parse(storedMember);
    setMember(parsedMember);
    setFormData({
      name: parsedMember.name || '',
      profilePhotoUrl: parsedMember.profilePhotoUrl || ''
    });
    setPhotoPreview(parsedMember.profilePhotoUrl || '');

    fetchData(parsedMember.id);
  }, [navigate]);

  const fetchData = async (memberId) => {
    try {
      // Fetch all programs
      const programsResponse = await fetch('http://localhost:8080/api/programs');
      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setAllPrograms(programsData);
      }

      // Fetch member's enrolled programs
      const enrolledResponse = await fetch(`http://localhost:8080/api/members/${memberId}/programs`);
      if (enrolledResponse.ok) {
        const enrolledData = await enrolledResponse.json();
        const enrolledIds = new Set(enrolledData.map(p => p.id));
        setEnrolledProgramIds(enrolledIds);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'profilePhotoUrl') {
      setPhotoPreview(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      // Clear the URL input to avoid conflicts
      setFormData(prev => ({ ...prev, profilePhotoUrl: '' }));
    } else {
      setPhotoFile(null);
      setPhotoPreview(member.profilePhotoUrl || '');
    }
  };

  const handleProgramToggle = (programId) => {
    setEnrolledProgramIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const handleGenerateAvatar = () => {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ffcc00&color=000&size=200`;
    setFormData(prev => ({ ...prev, profilePhotoUrl: avatarUrl }));
    setPhotoPreview(avatarUrl);
    setPhotoFile(null); // Clear any selected file
  };
  
  const uploadPhoto = async () => {
      if (!photoFile) {
          return formData.profilePhotoUrl;
      }
      
      const photoFormData = new FormData();
      photoFormData.append('file', photoFile);

      const response = await fetch(`http://localhost:8080/api/members/${member.id}/upload-photo`, {
          method: 'POST',
          body: photoFormData,
      });

      if (!response.ok) {
          throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      return data.photoUrl;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // 1. Upload photo if a new one was selected
      let finalPhotoUrl = formData.profilePhotoUrl;
      if (photoFile) {
        finalPhotoUrl = await uploadPhoto();
      }

      // 2. Update member profile
      const profileResponse = await fetch(`http://localhost:8080/api/members/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...member,
          name: formData.name,
          profilePhotoUrl: finalPhotoUrl
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedMember = await profileResponse.json();
      
      // 3. Update programs enrollment
      const enrollmentResponse = await fetch(`http://localhost:8080/api/members/${member.id}/programs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Array.from(enrolledProgramIds)),
      });

      if (!enrollmentResponse.ok) {
        throw new Error('Failed to update program enrollment');
      }

      // Update local storage
      localStorage.setItem('member', JSON.stringify({
        ...updatedMember,
        password: undefined // Don't store password
      }));

      setSuccess('Profile updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/membership');
      }, 2000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Profile Photo Section */}
          {/* Profile Photo Section */}
            <div className={styles.photoSection}>
            <div className={styles.photoPreview}>
                {photoPreview ? (
                <img src={photoPreview} alt="Profile" />
                ) : (
                <div className={styles.photoPlaceholder}>No Photo</div>
                )}
            </div>
            
            <div className={styles.photoControls}>
                <label htmlFor="photo-upload" className={styles.fileLabel}>
                Choose File
                </label>
                <input
                type="file"
                id="photo-upload"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                className={styles.fileInput}
                />
                <button
                type="button"
                onClick={handleGenerateAvatar}
                className={styles.generateBtn}
                >
                Generate Avatar
                </button>
            </div>
            </div>

          {/* Name Section */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          {/* Programs Section */}
          <div className={styles.programsSection}>
            <h2>Select Programs to Enroll</h2>
            <div className={styles.programsGrid}>
              {allPrograms.map(program => (
                <div key={program.id} className={styles.programCard}>
                  <input
                    type="checkbox"
                    id={`program-${program.id}`}
                    checked={enrolledProgramIds.has(program.id)}
                    onChange={() => handleProgramToggle(program.id)}
                    className={styles.checkbox}
                  />
                  <label htmlFor={`program-${program.id}`} className={styles.programLabel}>
                    <img 
                      src={program.imageUrl || 'https://via.placeholder.com/300x200'} 
                      alt={program.title}
                      className={styles.programImage}
                    />
                    <div className={styles.programInfo}>
                      <h3>{program.title}</h3>
                      <p>{program.description}</p>
                      <div className={styles.programMeta}>
                        <span className={styles.cost}>{program.benefits || program.cost}</span>
                        <span className={styles.duration}>{program.duration}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Buttons */}
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/membership')}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={styles.saveBtn}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}