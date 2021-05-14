/**
 * @file Consume API handler
 * @author Gleidson Braga 
 */

/**
 * @description help handler fetch in a simplest way
 * @param {string} url 
 * @param {RequestInfo} options 
 * @returns {Promise<any>}
 */
const RequestWrapper = async (url, options = {}) => {
    console.info("Requesting URI: ", url);
    const response = await fetch(url, options);
    // TOFIX: Throw NotValidJSONFormatException and return null 
    const result = await response.json();
    return result;
}  

/**
 * @description Query Param Builder
 * @param {Object} initValue
 * @returns {QueryParamsBuilder}
 */
const QueryParamsBuilder = (initValue = {}) => {
    const __ = initValue;
    const that = {}
    /**
     * Append a new value to be used as query param
     * @param {string} key query param key
     * @param {string} value query param value
     */
    that.append = (key, value) => {
        __[key] = value; 
        return that;
    }
    /**
     * @description build all information appended and transform in one string
     * @returns {string}
     */
    that.build = () => {
        return Object.keys(__).map(key => `${key}=${__[key]}`)
            .reduce((prev, current) => `${prev}${current}&`, '?')
            .slice(0, -1);
    }
    return that;
}

/**
 * @description API handler
 */
const ApiClientJobs = () => {
    const BASE_URL = 'http://api.dataatwork.org/v1/';

    const JOB_URL = BASE_URL + 'jobs'

    /**
     * Retrieves the names, descriptions, and UUIDs of all job titles.
    * @param {number} limit Pagination offset. Default is 0.
     * @param {number} offset Maximum number of items per page. Default is 20 and cannot exceed 500
     * @returns {Promise<Array<Job>>}
     */
    const getAllJobs = (limit = 20, offset = 0) => {
        // TODO: added pagination 
        return RequestWrapper(JOB_URL);
    }

    /**
     * Retrieves the name, description, and UUID of a job by specifying its O*NET SOC Code or UUID.
     * @param {string} id 
     * @returns  {Promise<Job>}
     */
    const getJobById = (id) => RequestWrapper(JOB_URL + '/' + id);
    /**
     * Retrieves a collection of skills associated with a specified job.
     * @param {string} id job id
     * @returns {Promise<Array<Skill>>}
     */
    const getJobSkillByJobId = (id) => RequestWrapper(JOB_URL + '/' + id + '/related_skills');

     /**
     * Retrieves a collection of jobs associated with a specified job.
     * @param {string} id job id
     * @returns {Promise<Array<Job>>}
     */
    const getJobRelatedByJobId = (id) => RequestWrapper(JOB_URL + '/' + id + '/related_jobs');

  
    /**
     * Retrieves the names, descriptions, and UUIDs of all job titles matching a given search criteria
     * @param {string} beginWith search for string that begin with...
     * @param {strign} contains search for string that contains...
     * @param {string} endWith search for string that ends with...
     * @returns {Promise<Job>}
     */
    const getJobAutocompletion = (beginWith, contains, endWith) => {
        const builder = QueryParamsBuilder();
        
        // TODO: Remove null parameters
        const queryParams = builder.append('begin_with', beginWith)
               .append('contains', contains)
               .append('end_with', endWith)
               .build();
        
        return RequestWrapper(JOB_URL + '/autocomplete' + queryParams)
    }
    /**
     * Retrieves the canonical job title for a synonymous job title
     * @param {string} jobTitle canonical job title for job matching
     * @param {numer} limit maximumn number of job title synomyms to return
     * @returns {Promise<Array<Job>>}
     */
    const getJobNormalizer = (jobTitle, limit) => {
        const builder = QueryParamsBuilder();

        const queryParams = builder.append('job_title', jobTitle)
            .append('limit', limit).build();

        return RequestWrapper(JOB_URL + '/normalize' + queryParams)
    };

    /**
     * Retrieves a list of unusual job titles and the UUIDs of their canonical jobs. 
     * @returns {Promise<Array<Job>>}
     */
    const getJobUnusualTitles = () => RequestWrapper(JOB_URL + '/unusual_titles');

    // TODO: Implement and use 3 skill methods, reference:
    // http://api.dataatwork.org/v1/spec/#!/default/

    /**
     * Retrieve the names, descriptions, and UUIDs of all skills.
     * @param {number} limit Pagination offset. Default is 0.
     * @param {number} offset Maximum number of items per page. Default is 20 and cannot exceed 500
     * @returns {Promise<Array<Skill>>}
     */
    const getAllSkills = (limit = 20, offset = 0) => 1;
    /**
     * Retrieves the name, description, and UUID of a job by specifying its UUID.
     * @param {string} id 
     * @returns {Promise<Skill>}
     */
    const getSkillById = (id) => 1; 

    /**
     * Retrieves a collection of jobs associated with a specified skill.
     * @param {string} id 
     * @returns {Promise<Skill>}
     */
    const getSkillRelatedJobBySkillId = (id) => 1;
    /**
     * Retrieves a collection of skills associated with a specified skill.
     * @param {string} id 
     * @returns {Promise<Skill>}
     */
    const getSkillRelatedSkillBySkillId = (id) => 1;
    /**
     * Retrieves the names, descriptions, and UUIDs of all skills matching a given search criteria.
     * @param {string} beginWith search for string that begin with...
     * @param {strign} contains search for string that contains...
     * @param {string} endWith search for string that ends with...
     * @returns {Promise<Skill>}
     */
    const getSkillAutocompletion = (beginWith, contains, endWith) => 1;

    /**
     * Retrieves the canonical skill name for a synonymous skill name
     * @param {string} skillName
     * @returns {Promise<Skill>}
     */
    const getSkillNormalizer = (skillName) => 1;

    return {
        getAllJobs, getJobById, getJobSkillByJobId,
        getJobRelatedByJobId, getJobAutocompletion,
        getJobNormalizer, getJobUnusualTitles,
        getAllSkills, getSkillById, getSkillRelatedJobBySkillId,
        getSkillRelatedSkillBySkillId, getSkillAutocompletion,
        getSkillNormalizer
    };
}
