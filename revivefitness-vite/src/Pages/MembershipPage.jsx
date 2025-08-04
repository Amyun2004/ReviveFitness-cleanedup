import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import styles from './MembershipPage.module.css';
import ProfileEditPage from '../components/ProfileEdit/ProfileEditPage';

export default function MembershipPage() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState(new Set());
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const storedMember = localStorage.getItem('member');
    if (!storedMember) {
      navigate('/login');
      return;
    }

    const parsedMember = JSON.parse(storedMember);
    setMember(parsedMember);

    const fetchMemberData = async () => {
      if (parsedMember && parsedMember.id) {
        try {
          // --- Fetch Programs ---
          const programsResponse = await fetch(`http://localhost:8080/api/members/${parsedMember.id}/programs`);
          if (!programsResponse.ok) {
            console.warn('Programs endpoint not available yet');
            setPrograms([]);
          } else {
            const programsData = await programsResponse.json();
            if (Array.isArray(programsData)) {
              const formattedPrograms = programsData.map(program => ({
                id: program.id,
                title: program.name,
                desc: program.description,
                image: program.imgUrl,
                cost: program.cost,
                duration: program.duration
              }));
              setPrograms(formattedPrograms);
            } else {
              setPrograms([]);
            }
          }
          
          // --- Fetch Attendance ---
          const attendanceResponse = await fetch(`http://localhost:8080/api/attendance/member/${parsedMember.id}`);
          if (!attendanceResponse.ok) {
            throw new Error(`HTTP error! status: ${attendanceResponse.status}`);
          }
          const attendanceData = await attendanceResponse.json();
          
          // Parse attendance dates correctly
          const formattedAttendance = new Set(attendanceData.map(record => {
            let dateToProcess;
            if (Array.isArray(record.checkInTime)) {
              const [year, month, day] = record.checkInTime;
              dateToProcess = new Date(year, month - 1, day);
            } else {
              dateToProcess = new Date(record.checkInTime);
            }
            
            const year = dateToProcess.getFullYear();
            const month = String(dateToProcess.getMonth() + 1).padStart(2, '0');
            const day = String(dateToProcess.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }));
          
          setAttendance(formattedAttendance);

        } catch (error) {
          console.error('An error occurred while fetching member data:', error);
          setError('Failed to load some data. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMemberData();
  }, [navigate]);

  const goToPrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarCells = [];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      calendarCells.push(<div key={`day-${day}`} className={styles.dayOfWeek}>{day}</div>);
    });
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(<div key={`empty-${i}`} className={styles.emptyCell}></div>);
    }
    
    const currentMonthFormatted = String(month + 1).padStart(2, '0');
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${currentMonthFormatted}-${String(day).padStart(2, '0')}`;
      const isAttended = attendance.has(dateString);
      const isToday = isCurrentMonth && day === todayDate;
      
      calendarCells.push(
        <div 
          key={day} 
          className={`${styles.calendarCell} ${isAttended ? styles.attended : ''} ${isToday ? styles.today : ''}`}
          title={isAttended ? 'Attended' : ''}
        >
          {day}
          {isAttended && <span className={styles.attendedDot}>•</span>}
        </div>
      );
    }
    
    return calendarCells;
  };
  
  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Navbar />
        <p>{error}</p>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className={styles.page}>
        <Navbar />
        You must be logged in to view this page.
      </div>
    );
  }
  
  const joinDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A';

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {member.profilePhotoUrl ? (
              <img src={member.profilePhotoUrl} alt="Profile Avatar" className={styles.profileImage} />
            ) : (
              <span role="img" aria-label="avatar" style={{ fontSize: '2rem' }}>👤</span>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.title}>Welcome, {member.name}</h1>
            <p className={styles.info}><strong>Email:</strong> {member.email}</p>
            <p className={styles.info}><strong>Join Date:</strong> {joinDate}</p>
            <button 
              className={styles.editProfileBtn}
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </button>
          </div>
        </div>
        
        <section className={styles.section}>
          <div className={styles.calendarHeader}>
            <button className={styles.navButton} onClick={goToPrevMonth}>&lt;</button>
            <h2 className={styles.monthYearTitle}>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button className={styles.navButton} onClick={goToNextMonth}>&gt;</button>
            <button className={styles.todayButton} onClick={goToToday}>Today</button>
          </div>
          <div className={styles.attendanceSummary}>
            <p>Total attendance this month: {
              Array.from(attendance).filter(date => {
                const [year, month] = date.split('-');
                return parseInt(year) === currentDate.getFullYear() && 
                       parseInt(month) === currentDate.getMonth() + 1;
              }).length
            } days</p>
          </div>
          <div className={styles.calendarGrid}>
            {renderCalendar()}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Enrolled Programs</h2>
          <div className={styles.programGallery}>
            {programs.length > 0 ? (
              programs.map(program => (
                <div key={program.id} className={styles.programCard}>
                  <img src={program.image} alt={program.title} className={styles.programImage} />
                  <div className={styles.programContent}>
                    <h3 className={styles.programTitle}>{program.title}</h3>
                    <p className={styles.programDesc}>{program.desc}</p>
                    <div className={styles.programDetails}>
                      <p className={styles.info}>
                        <strong>Cost</strong>
                        <span>{program.cost}</span>
                      </p>
                      <p className={styles.info}>
                        <strong>Duration</strong>
                        <span>{program.duration}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.info}>No programs enrolled yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}