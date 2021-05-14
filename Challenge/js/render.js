/**
 * @file Render itens on screen helper
 * @author Gleidson Braga 
 */

/* Events */

const FEEDBACK_STATES = {
    'NONE': 0, 'RESULTS': 1, 'TYPING': 2,
    'NO_MATCH': 3, 'START_POINT': 4
}; 

// TODO: be able to show skill without jobs
const formOnChange = ({target: { value }}) => {
    const typingEl = document.getElementsByClassName('typing-keyword').item(0);
    typingEl.hidden = false;
    typingEl.innerText = value;
    // TODO: implement method to give user an autocomplete option
    setUserFeedback( value ? FEEDBACK_STATES.TYPING : FEEDBACK_STATES.START_POINT);
}

const setUserFeedback = (feedback) => {
    document.querySelectorAll('.feedback-check')
        .forEach(el => {
            el.hidden = el.dataset.id != feedback;
        });
}

const formOnSubmit = (event) => {
    event.preventDefault();
    // TODO: Give right feedback to user when there is no match results
    setUserFeedback(FEEDBACK_STATES.RESULTS);
}

/* Renders */

const httpClient = ApiClientJobs()

// TODO: add doc for this method
const JobCard = (uuid, title, parent_uuid) => `
<div data-id="${uuid}" class="card">
    <strong class="pull-right text-small">
        ${uuid}
    </strong>
        <h2>${title}</h2>
    <hr />
    <div class="more-info row"></div>
    <button data-action="skill" class="btn btn-simple btn-action" value="${uuid}">
        Show Skill Required
    </button>
    <button data-action="parent" class="btn btn-simple pull-right btn-action" value="${parent_uuid}">
        Show Parent Job
    </button>
</div>`;


const loadSkillsInfo = (uuid) => {

    // TODO: create a way to undo this action
    document.querySelectorAll('.card')
        .forEach(el => el.classList.add('collapse'));

    document.querySelector('.content-box').classList.remove('col-6');
    document.querySelector('.content-box').classList.add('col-12');

    document.querySelector('.search-box').classList.add('collapse');
    document.querySelector('.pagination').classList.add('collapse');

    document.querySelector(`.card[data-id='${uuid}']`)
        .classList.remove('collapse');
    
    const moreInfoEl = document.querySelector(`.card[data-id='${uuid}'] .more-info`)
    moreInfoEl.innerHTML = '<h2>Loading required skills 📚</h2>';
    // TODO: refactory this to another method
    httpClient.getJobSkillByJobId(uuid)
        .then(response => {
            moreInfoEl.innerHTML = ''; 
            const status = {'ability': 0, 'knowledge': 0, 'skill': 0};
            
            let skillHTML = '';
            response.skills.forEach((skill) => {
                status[skill.skill_type] += skill.importance;
                skillHTML += `<div class="col-6"> 
                    <h3>${skill.skill_type} - ${skill.skill_name} </h3>
                    <p>${skill.description} <br/> ${skill.importance} + ${skill.level}</p>
                </div>`;
            });

            moreInfoEl.innerHTML = `<div class="col-12">
                <p>Ability: ${status.ability} - Knowledge: ${status.knowledge} - Skill: ${status.skill}
                </p>
            </div>`;

            moreInfoEl.innerHTML += skillHTML;
        });
}

const addedBtnActionListeners = () => {
    // TODO: add some action to parent load info
    const actions = {
        skill: loadSkillsInfo,
        parent: (uuid) => {}
    };

    document.querySelectorAll('.btn-action')
        .forEach(el => {
            el.addEventListener('click', ({target}) => {
                actions[target.dataset.action](target.value);
            });
        });
}

const renderJobPage = (page = 0, perPage = 5) => {
    const mainScopeEl = document.querySelector('#main-scope');
    mainScopeEl.innerHTML = '<p class="text-center">Finding new Jobs 😁<p>';
    
    httpClient.getAllJobs(perPage, page * perPage)
        .then(response => {
            mainScopeEl.innerHTML = '';
            // TODO: use this for somethig...
            const pagination = response.pop();
            response.forEach(job => {
                const jobCard = JobCard(job.uuid, job.title, job.parent_uuid)
                mainScopeEl.innerHTML += jobCard;
                console.info("Appending new content");
            });
            addedBtnActionListeners();
            console.info("Added action event listeners"); 
        });
}

