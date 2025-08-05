import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import styles from './MembershipPage.module.css';

// Base URL for your Spring Boot backend
const API_BASE = 'http://localhost:8080';

/** Helper: fetch JSON or log errors */
async function fetchJson(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
     'Content-Type': 'application/json',
     // auto-inject the JWT
     Authorization: `Bearer ${localStorage.getItem('token')}`
   }
    });
  const text = await resp.text();
  if (!resp.ok) {
    console.error(`Fetch error ${resp.status} at ${url}:`, text);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error(`Invalid JSON from ${url}:`, text);
    return null;
  }
}

export default function MembershipPage() {
  const navigate = useNavigate();

  // Profile & calendar
  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Programs & challenges
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [enrolledChallenges, setEnrolledChallenges] = useState(new Set());
  const [currentChallenge, setCurrentChallenge] = useState(null);

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch everything on mount
  useEffect(() => {
    const stored = localStorage.getItem('member');
    if (!stored) {
      navigate('/login');
      return;
    }
    const m = JSON.parse(stored);
    setMember(m);

    const fetchData = async () => {
      try {
        // 1) Attendance
        const att = await fetchJson(
          `${API_BASE}/api/attendance/member/${m.id}`
        ) || [];
        setAttendance(new Set(
          att.map(r => new Date(r.checkInTime).toISOString().slice(0,10))
        ));

        // 2) Enrolled Programs
        const listEnrolled = await fetchJson(
          `${API_BASE}/api/members/${m.id}/programs`
        ) || [];
        setEnrolledPrograms(listEnrolled.map(p => ({
          id: p.id,
          title: p.name,
          desc: p.description,
          image: p.imageUrl,
          cost: p.benefits,
          duration: p.duration,
        })));

        // 3) Available Programs
        const allProgs = await fetchJson(`${API_BASE}/api/programs`) || [];
        const enrolledIds = new Set(listEnrolled.map(p => p.id));
        setAvailablePrograms(
          allProgs
            .filter(p => !enrolledIds.has(p.id))
            .map(p => ({
              id: p.id,
              title: p.name,
              desc: p.description,
              image: p.imageUrl,
              cost: p.benefits,
              duration: p.duration,
            }))
        );

        // 4) Enrolled Challenges
        const chEn = await fetchJson(
          `${API_BASE}/api/members/${m.id}/challenges`
        ) || [];
        setEnrolledChallenges(new Set(chEn.map(c => c.id)));

        // 5) Current Challenge
        const cc = await fetchJson(`${API_BASE}/api/current-challenges`);
        if (cc) {
          setCurrentChallenge({
            id: cc.id,
            title: cc.title,
            desc: cc.description,
            image: cc.imageUrl,
          });
        }
      } catch (e) {
        console.error(e);
        setError('Failed loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Program handlers
  const joinProgram = async id => {
    await fetchJson(
      `${API_BASE}/api/members/${member.id}/programs/${id}`,
      { method: 'POST' }
    );
    const joined = availablePrograms.find(p => p.id === id);
    setEnrolledPrograms(a => [...a, joined]);
    setAvailablePrograms(a => a.filter(p => p.id !== id));
  };
  const leaveProgram = async id => {
    await fetchJson(
      `${API_BASE}/api/members/${member.id}/programs/${id}`,
      { method: 'DELETE' }
    );
    const removed = enrolledPrograms.find(p => p.id === id);
    setAvailablePrograms(a => [...a, removed]);
    setEnrolledPrograms(a => a.filter(p => p.id !== id));
  };

  // Challenge handlers
  const joinChallenge = async () => {
    if (!currentChallenge) return;
    await fetchJson(
      `${API_BASE}/api/members/${member.id}/challenges/${currentChallenge.id}`,
      { method: 'POST' }
    );
    setEnrolledChallenges(s => new Set(s).add(currentChallenge.id));
  };
  const leaveChallenge = async () => {
    if (!currentChallenge) return;
    await fetchJson(
      `${API_BASE}/api/members/${member.id}/challenges/${currentChallenge.id}`,
      { method: 'DELETE' }
    );
    setEnrolledChallenges(s => {
      const c = new Set(s);
      c.delete(currentChallenge.id);
      return c;
    });
  };

  // Calendar navigation
  const goToPrevMonth = () =>
    setCurrentDate(d => { d.setMonth(d.getMonth()-1); return new Date(d); });
  const goToNextMonth = () =>
    setCurrentDate(d => { d.setMonth(d.getMonth()+1); return new Date(d); });
  const goToToday = () => setCurrentDate(new Date());

  // Build calendar cells
  const renderCalendar = () => {
    const year = currentDate.getFullYear(),
          month = currentDate.getMonth(),
          firstDay = new Date(year, month, 1).getDay(),
          daysInMonth = new Date(year, month+1, 0).getDate();
    const cells = [];
    const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    daysOfWeek.forEach(d => cells.push(
      <div key={'dw-'+d} className={styles.dayOfWeek}>{d}</div>
    ));
    for(let i=0;i<firstDay;i++){
      cells.push(<div key={'empty-'+i} className={styles.emptyCell}/>);
    }
    const today = new Date();
    const isCurrMonth = today.getFullYear()===year && today.getMonth()===month;
    for(let day=1; day<=daysInMonth; day++){
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const attended = attendance.has(dateStr);
      const isToday = isCurrMonth && day===today.getDate();
      cells.push(
        <div
          key={'day-'+day}
          className={`
            ${styles.calendarCell}
            ${attended ? styles.attended : ''}
            ${isToday ? styles.today : ''}
          `}
          title={attended ? 'Attended' : ''}
        >
          {day}{attended && <span className={styles.attendedDot}>•</span>}
        </div>
      );
    }
    return cells;
  };

  // Loading / error / auth guards
  if (loading) return <div><Navbar/>Loading…</div>;
  if (error)   return <div><Navbar/>{error}</div>;
  if (!member) return <div><Navbar/>Please log in.</div>;

  const joinDate = member.joinDate
    ? new Date(member.joinDate).toLocaleDateString()
    : 'N/A';

  return (
    <div className={styles.page}>
      {/* Profile & Calendar Card */}
      <div className={styles.card}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {member.profilePhotoUrl
              ? <img src={member.profilePhotoUrl} className={styles.profileImage} alt="Avatar"/>
              : <span role="img" aria-label="avatar" style={{fontSize:'2rem'}}>👤</span>
            }
          </div>
          <div>
            <h1 className={styles.title}>Welcome, {member.name}</h1>
            <p className={styles.info}><strong>Email:</strong> {member.email}</p>
            <p className={styles.info}><strong>Joined:</strong> {joinDate}</p>
            <button
              className={styles.todayButton}
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.calendarHeader}>
            <button onClick={goToPrevMonth} className={styles.navButton}>&lt;</button>
            <h2 className={styles.monthYearTitle}>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={goToNextMonth} className={styles.navButton}>&gt;</button>
            <button onClick={goToToday} className={styles.todayButton}>Today</button>
          </div>
          <p className={styles.attendanceSummary}>
            Total this month:{' '}
            {Array.from(attendance).filter(date => {
               const [y, m] = date.split('-');
               return +y === currentDate.getFullYear() && +m === currentDate.getMonth() + 1;
             }).length} days
          </p>
          <div className={styles.calendarGrid}>{renderCalendar()}</div>
        </div>
      </div>

      {/* Programs & Challenge Card */}
      <div className={styles.card}>
        {/* Enrolled Programs */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Enrolled Programs</h2>
          <div className={styles.programGallery}>
            {enrolledPrograms.length > 0 ? enrolledPrograms.map(p => (
              <div key={p.id} className={styles.programCard}>
                <img src={p.image} alt={p.title} className={styles.programImage}/>
                <div className={styles.programContent}>
                  <h3 className={styles.programTitle}>{p.title}</h3>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <div className={styles.programDetails}>
                    <p className={styles.info}><strong>Cost</strong><span>{p.cost}</span></p>
                    <p className={styles.info}><strong>Duration</strong><span>{p.duration}</span></p>
                  </div>
                  <button className={styles.leaveButton} onClick={() => leaveProgram(p.id)}>Leave Program</button>
                </div>
              </div>
            )) : <p className={styles.info}>No programs enrolled yet.</p>}
          </div>
        </section>

        {/* Available Programs */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Programs</h2>
          <div className={styles.programGallery}>
            {availablePrograms.length > 0 ? availablePrograms.map(p => (
              <div key={p.id} className={styles.programCard}>
                <img src={p.image} alt={p.title} className={styles.programImage}/>
                <div className={styles.programContent}>
                  <h3 className={styles.programTitle}>{p.title}</h3>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <div className={styles.programDetails}>
                    <p className={styles.info}><strong>Cost</strong><span>{p.cost}</span></p>
                    <p className={styles.info}><strong>Duration</strong><span>{p.duration}</span></p>
                  </div>
                  <button className={styles.joinButton} onClick={() => joinProgram(p.id)}>Join Program</button>
                </div>
              </div>
            )) : <p className={styles.info}>No more programs available.</p>}
          </div>
        </section>

        {/* Current Challenge */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Challenge</h2>
          {currentChallenge ? (
            <div className={styles.challengeCard}>
              <img src={currentChallenge.image} alt={currentChallenge.title}
                   className={styles.challengeImage}/>
              <div className={styles.challengeContent}>
                <h3>{currentChallenge.title}</h3>
                <p>{currentChallenge.desc}</p>
                {enrolledChallenges.has(currentChallenge.id) ? (
                  <button className={styles.leaveButton} onClick={leaveChallenge}>Leave Challenge</button>
                ) : (
                  <button className={styles.joinButton} onClick={joinChallenge}>Join Challenge</button>
                )}
              </div>
            </div>
          ) : (
            <p className={styles.info}>No active challenges at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
}