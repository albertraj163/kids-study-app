/**
 * Kids Study App - Frontend logic
 * Fetches subjects and quiz data from the backend API.
 */
const API_URL = window.APP_CONFIG.API_URL;

const subjectsList = document.getElementById('subjects-list');
const subjectsSection = document.getElementById('subjects-section');
const quizSection = document.getElementById('quiz-section');
const quizContainer = document.getElementById('quiz-container');
const quizTitle = document.getElementById('quiz-title');
const quizScore = document.getElementById('quiz-score');
const backBtn = document.getElementById('back-btn');
const healthStatus = document.getElementById('health-status');

async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    healthStatus.textContent = data.status === 'healthy' ? 'OK' : data.status;
  } catch {
    healthStatus.textContent = 'offline';
  }
}

async function loadSubjects() {
  subjectsList.innerHTML = '<p class="loading">Loading subjects...</p>';
  try {
    const res = await fetch(`${API_URL}/api/subjects`);
    const data = await res.json();
    subjectsList.innerHTML = '';
    data.subjects.forEach((subject) => {
      const card = document.createElement('button');
      card.className = 'subject-card';
      card.innerHTML = `
        <span class="emoji">${subject.emoji}</span>
        <h3>${subject.name}</h3>
        <p>${subject.description}</p>
      `;
      card.addEventListener('click', () => startQuiz(subject));
      subjectsList.appendChild(card);
    });
  } catch (err) {
    subjectsList.innerHTML = `<p class="error">Could not load subjects. Is the API running?</p>`;
    console.error(err);
  }
}

async function startQuiz(subject) {
  subjectsSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  quizTitle.textContent = `${subject.emoji} ${subject.name} Quiz`;
  quizScore.classList.add('hidden');
  quizContainer.innerHTML = '<p class="loading">Loading quiz...</p>';

  try {
    const res = await fetch(`${API_URL}/api/quiz/${subject.id}`);
    const data = await res.json();
    renderQuiz(data.questions);
  } catch (err) {
    quizContainer.innerHTML = '<p class="error">Quiz not available.</p>';
  }
}

function renderQuiz(questions) {
  quizContainer.innerHTML = '';
  let correct = 0;

  questions.forEach((q, qIndex) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `<h4>Q${qIndex + 1}: ${q.question}</h4>`;
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (optIndex === q.correctIndex) {
          btn.classList.add('correct');
          correct++;
        } else {
          btn.classList.add('wrong');
        }
        optionsDiv.querySelectorAll('button').forEach((b) => (b.disabled = true));
        if (qIndex === questions.length - 1) {
          const pct = Math.round((correct / questions.length) * 100);
          quizScore.textContent = `Score: ${correct}/${questions.length} (${pct}%)`;
          quizScore.classList.remove('hidden');
        }
      });
      optionsDiv.appendChild(btn);
    });

    block.appendChild(optionsDiv);
    quizContainer.appendChild(block);
  });
}

backBtn.addEventListener('click', () => {
  quizSection.classList.add('hidden');
  subjectsSection.classList.remove('hidden');
});

checkHealth();
loadSubjects();
