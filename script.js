document.addEventListener('DOMContentLoaded', () => {
  // Navigation Logic
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.add('hidden'));

      // Add active to current
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
    });
  });

  // Base setup
  const periods = [
    { period: 1, start: '10:00:00', end: '11:00:00' },
    { period: 2, start: '11:00:00', end: '12:00:00' },
    { period: 3, start: '12:00:00', end: '13:00:00' },
    { period: 4, start: '13:00:00', end: '14:00:00' },
    { period: 5, start: '14:00:00', end: '15:00:00' },
    { period: 6, start: '15:00:00', end: '16:00:00' },
    { period: 7, start: '16:00:00', end: '17:00:00' }
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Utility to format time for display
  function formatTime(timeStr) {
    return timeStr.substring(0, 5); // '09:00:00' -> '09:00'
  }

  // OPTION 1: Faculty Login
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('faculty-id').value.trim();
    const errorEl = document.getElementById('login-error');
    const resultEl = document.getElementById('login-result');
    const tbody = document.querySelector('#faculty-timetable tbody');
    
    errorEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    
    try {
      // Fetch faculty details
      const facultyRes = await fetch(`/api/faculty/${id}`);
      if (!facultyRes.ok) throw new Error('Faculty not found');
      const faculty = await facultyRes.json();
      
      document.getElementById('login-faculty-name').textContent = faculty.name;
      document.getElementById('login-faculty-dept').textContent = faculty.department;

      // Fetch timetable
      const timetableRes = await fetch(`/api/faculty/${id}/timetable`);
      const timetableData = await timetableRes.json();

      // Render Table
      tbody.innerHTML = '';
      
      periods.forEach(p => {
        const tr = document.createElement('tr');
        // Time column
        const timeTd = document.createElement('td');
        timeTd.innerHTML = `<div>Period ${p.period}</div><div class="cell-secondary">${formatTime(p.start)} - ${formatTime(p.end)}</div>`;
        tr.appendChild(timeTd);

        // Day columns
        days.forEach(day => {
          const td = document.createElement('td');
          // Find if there's a class for this period and day
          const classItem = timetableData.find(item => item.period === p.period && item.day.toLowerCase() === day.toLowerCase());
          
          if (classItem && classItem.subject_name) {
            td.innerHTML = `
              <div class="cell-content">
                <span class="cell-primary">${classItem.subject_name}</span>
                <span class="cell-secondary">${classItem.branch} - ${classItem.year}</span>
              </div>
            `;
          } else {
            td.innerHTML = `<span class="free-block">FREE</span>`;
          }
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
      });

      resultEl.classList.remove('hidden');
      resultEl.classList.add('fade-in');

    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

  // Load dropdown data for Options 2 & 3
  async function loadDropdowns() {
    try {
      const facRes = await fetch('/api/faculty');
      if (facRes.ok) {
        const faculties = await facRes.json();
        const facSelect = document.getElementById('search-faculty-select');
        faculties.forEach(f => {
          const opt = document.createElement('option');
          opt.value = f.id;
          opt.textContent = `${f.name} (${f.department})`;
          facSelect.appendChild(opt);
        });
      }

      const secRes = await fetch('/api/sections');
      if (secRes.ok) {
        const sectionsData = await secRes.json();
        const secSelect = document.getElementById('class-select');
        sectionsData.forEach(s => {
          const opt = document.createElement('option');
          opt.value = encodeURIComponent(s.id);
          opt.textContent = `${s.name} - ${s.year}`;
          secSelect.appendChild(opt);
        });
      }
    } catch (err) {
      console.error('Error loading dropdowns', err);
    }
  }

  loadDropdowns();

  // OPTION 2: Search Faculty Schedule
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('search-faculty-select').value;
    const day = document.getElementById('search-day-select').value;
    const errorEl = document.getElementById('search-error');
    const resultEl = document.getElementById('search-result');
    const tbody = document.querySelector('#search-timetable tbody');
    
    errorEl.classList.add('hidden');
    resultEl.classList.add('hidden');

    if (!id || !day) return;

    try {
      const res = await fetch(`/api/faculty/${id}/day/${day}`);
      if (!res.ok) throw new Error('Failed to fetch schedule');
      const data = await res.json();

      tbody.innerHTML = '';
      
      periods.forEach(p => {
        const tr = document.createElement('tr');
        
        const periodTd = document.createElement('td');
        periodTd.textContent = `Period ${p.period}`;
        tr.appendChild(periodTd);

        const timeTd = document.createElement('td');
        timeTd.textContent = `${formatTime(p.start)} - ${formatTime(p.end)}`;
        timeTd.className = "cell-secondary";
        tr.appendChild(timeTd);

        const statusTd = document.createElement('td');
        const classItem = data.find(item => item.period === p.period);
        
        if (classItem && classItem.subject_name) {
          statusTd.innerHTML = `
            <div class="cell-content">
              <span class="cell-primary">${classItem.subject_name}</span>
              <span class="cell-secondary">${classItem.branch} - ${classItem.year}</span>
            </div>
          `;
        } else {
          statusTd.innerHTML = `<span class="free-block">FREE</span>`;
        }
        
        tr.appendChild(statusTd);
        tbody.appendChild(tr);
      });

      resultEl.classList.remove('hidden');
      resultEl.classList.add('fade-in');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

  // OPTION 3: Class Timetable
  const classForm = document.getElementById('class-form');
  classForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('class-select').value;
    const errorEl = document.getElementById('class-error');
    const resultEl = document.getElementById('class-result');
    const tbody = document.querySelector('#class-timetable tbody');
    
    errorEl.classList.add('hidden');
    resultEl.classList.add('hidden');

    if (!id) return;

    try {
      const res = await fetch(`/api/sections/${id}/timetable`);
      if (!res.ok) throw new Error('Failed to fetch class schedule');
      const timetableData = await res.json();

      tbody.innerHTML = '';
      
      periods.forEach(p => {
        const tr = document.createElement('tr');
        const timeTd = document.createElement('td');
        timeTd.innerHTML = `<div>Period ${p.period}</div><div class="cell-secondary">${formatTime(p.start)} - ${formatTime(p.end)}</div>`;
        tr.appendChild(timeTd);

        days.forEach(day => {
          const td = document.createElement('td');
          const classItem = timetableData.find(item => item.period === p.period && item.day.toLowerCase() === day.toLowerCase());
          
          if (classItem && classItem.subject_name && classItem.faculty) {
            td.innerHTML = `
              <div class="cell-content">
                <span class="cell-primary">${classItem.subject_name}</span>
                <span class="cell-secondary">${classItem.faculty.name}</span>
              </div>
            `;
          } else {
            td.textContent = '-';
            td.className = 'cell-secondary';
          }
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
      });

      resultEl.classList.remove('hidden');
      resultEl.classList.add('fade-in');
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    }
  });

});
