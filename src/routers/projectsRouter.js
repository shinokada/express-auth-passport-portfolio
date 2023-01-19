import express from 'express'
import Debug from 'debug'
import redis from '../lib/redis.js'
import { v4 as uuidv4 } from 'uuid'

const debug = Debug('app:adminRouter')
const projectsRouter = express.Router()

projectsRouter.route('/test').get((req, res) => {
  if (!req.user) {
    res.redirect('/auth/login');
  }
  res.render('projects-test', { user: JSON.parse(req.user), title: 'test' })
})

projectsRouter.route('/').get(async (req, res) => {
  try {
    let projects = await redis.keys('project:*');
    let projectsData = await redis.mget(...projects);
    projects = projectsData.map(JSON.parse);
    debug('projects: ', projects)
    const pageTitle = 'Admin: projects'
    res.render('projects', { projects, title: pageTitle })
  } catch (error) {
    debug('error', error)
  }
})

projectsRouter.route('/create').get((req, res) => {
  if (!req.user) {
    res.redirect('/auth/login');
  }
  debug('req.user: ', req.user)
  const pageTitle = 'Create project'
  res.render('create', { title: pageTitle, user: { ...req.user } });
});

projectsRouter.route('/create').post(async (req, res) => {
  if (!req.user) {
    res.redirect('/auth/login');
  }

  const { projectName, description, image, content, name } = req.body;

  if (!projectName) {
    res.status(400).json({
      error: 'Project name can not be empty',
    })
  } else if (projectName.length < 150) {
    const id = uuidv4();
    const newEntry = {
      id,
      projectName,
      image,
      created_at: Date.now(),
      description,
      content,
      name
    }
    //validate the newEntry
    if (!newEntry.description || !newEntry.content || !newEntry.image) {
      return res.status(400).render('error', { message: 'Description, Content and Image can not be empty' });
    }

    //stringify the new entry
    const newEntryAsString = JSON.stringify(newEntry);
    //save the new entry to redis
    await redis.set(`project:${id}`, newEntryAsString);
    // Redirect the user to the project page
    res.redirect(`/projects/${newEntry.id}`);
  }
});

// projects/any-id
projectsRouter.route('/:id').get(async (req, res) => {
  const id = req.params.id
  try {
    debug('Connecting DB ...')
    let project = await redis.get(`project:${id}`);
    debug('project: ', project)
    if (!project) {
      res.status(404).render('404', { message: `Article with id ${id} not found`, title: '404' });
    } else {
      let projectData = JSON.parse(project);
      const pageTitle = 'Article'
      res.render('project', { project: projectData, title: pageTitle });
    }
  } catch (error) {
    debug('error', error)
  }
})


export { projectsRouter }