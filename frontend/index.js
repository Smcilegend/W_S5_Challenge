async function sprintChallenge5() { 

  let mentors = [];
  let learners = [];
  
  // Task 1: Fetch mentors and learners data
  async function fetchData() {
    try {
      const [learnersResponse, mentorsResponse] = await Promise.all([
        axios.get('http://localhost:3003/api/learners'),
        axios.get('http://localhost:3003/api/mentors')
      ]);
      learners = learnersResponse.data;
      mentors = mentorsResponse.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
    await fetchData();

  // Task 2: Combine learners and mentors
  learners = learners.map(learner => {
    
    const mentorNames = learner.mentors.map(mentorId => {
      
      const mentor = mentors.find(m => m.id === mentorId);
      
      return mentor ? mentor.fullName : null;
    }).filter(name => name !== null);  
  
    
    return {
      id: learner.id,
      email: learner.email,
      fullName: learner.fullName,
      mentors: mentorNames
    };
  });

  // Task 3: Populate the UI with learner cards
  const cardsContainer = document.querySelector('.cards');
  const info = document.querySelector('.info');
  info.textContent = 'No learner is selected';

  for (let learner of learners) {
    const card = document.createElement('div');
    const heading = document.createElement('h3');
    const email = document.createElement('div');
    const mentorsHeading = document.createElement('h4');
    const mentorsList = document.createElement('ul');

    card.className = 'card';
    heading.textContent = learner.fullName;
    email.className = 'email';
    email.textContent = learner.email;
    mentorsHeading.className = 'mentors-heading closed';
    mentorsHeading.textContent = 'Mentors';

    for (let mentor of learner.mentors) {
      const mentorItem = document.createElement('li');
      mentorItem.textContent = mentor;
      mentorsList.appendChild(mentorItem);
    }

    card.appendChild(heading);
    card.appendChild(email);
    card.appendChild(mentorsHeading);
    card.appendChild(mentorsList);

    card.dataset.fullName = learner.fullName;

    cardsContainer.appendChild(card);

    card.addEventListener('click', evt => {
      const mentorsHeading = card.querySelector('h4');
      const didClickTheMentors = evt.target === mentorsHeading;
      const isCardSelected = card.classList.contains('selected');

      document.querySelectorAll('.card').forEach(crd => {
        crd.classList.remove('selected');
        crd.querySelector('h3').textContent = crd.dataset.fullName;
      });

      info.textContent = 'No learner is selected';

      if (!didClickTheMentors) {
        if (!isCardSelected) {
          card.classList.add('selected');
          heading.textContent += `, ID ${learner.id}`;
          info.textContent = `The selected learner is ${learner.fullName}`;
        }
      } else {
        card.classList.add('selected');
        if (mentorsHeading.classList.contains('open')) {
          mentorsHeading.classList.replace('open', 'closed');
        } else {
          mentorsHeading.classList.replace('closed', 'open');
        }

        if (!isCardSelected) {
          heading.textContent += `, ID ${learner.id}`;
          info.textContent = `The selected learner is ${learner.fullName}`;
        }
      }
    });
  }

  // Footer
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;
}

  // ❗ DO NOT CHANGE THIS CODE. WORK ONLY INSIDE TASKS 1, 2, 3
  if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
  else sprintChallenge5();
