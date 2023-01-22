import express from 'express'
import Debug from 'debug'
import chalk from 'chalk'
import redis from '../lib/redis.js'
// import { v4 as uuidv4 } from 'uuid'
import { generateUniqueId } from '../lib/utils.js'


const debug = Debug('app:projectsRouter')
const projectsRouter = express.Router()


projectsRouter.route('/').get(async (req, res) => {
  // initialize projects as an empty array
  let projects = [];
  try {
    // fetch list of keys from Redis that match the pattern 'project:*'
    const projectKeys = await redis.keys('project:*');
    if (projectKeys.length > 0) {
      // fetch the data for each project key and parse the JSON
      const projectData = await redis.mget(...projectKeys);

      projects = projectData.map(JSON.parse);
      // debug(chalk.green(JSON.stringify(projects)))
    }

    // render the projects template and pass in the title and projects data
    res.render('projects', { projects });
  } catch (error) {
    debug('error', error)
    res.status(500).send('Error fetching projects');
  }
})


// projects/any-id
projectsRouter.route('/:slug').get(async (req, res) => {
  const slug = req.params.slug
  try {
    let project = await redis.get(`project:slug:${slug}`);
    if (!project) {
      res.status(404).render('404', { message: `Article with id ${id} not found`, title: '404' });
    } else {
      let projectData = JSON.parse(project);

      res.render('project', { project: projectData });
    }
  } catch (error) {
    debug('error', error)
  }
})


export { projectsRouter }