import express from 'express'
import Debug from 'debug'
import redis from '../lib/redis.js'
// import { v4 as uuidv4 } from 'uuid'
import { generateUniqueId } from '../lib/utils.js'

const debug = Debug('app:projectsRouter')
const projectsRouter = express.Router()


projectsRouter.route('/').get(async (req, res) => {
  const title = 'Projects'
  // initialize projects as an empty array
  let projects = [];
  try {
    // fetch list of keys from Redis that match the pattern 'project:*'
    const projectKeys = await redis.keys('project:*');
    if (projectKeys.length > 0) {
      // fetch the data for each project key and parse the JSON
      const projectData = await redis.mget(...projectKeys);
      projects = projectData.map(JSON.parse);
    }
    // render the projects template and pass in the title and projects data
    res.render('projects', { projects, title });
  } catch (error) {
    debug('error', error)
    res.status(500).send('Error fetching projects');
  }
})

// projectsRouter.route('/create').get((req, res) => {
//   if (!req.user) {
//     res.redirect('/auth/login');
//   }
//   debug('req.user: ', req.user)
//   const pageTitle = 'Create project'
//   res.render('create', { title: pageTitle, user: JSON.parse(req.user) });
// });

// projectsRouter.route('/create').post(async (req, res) => {
//   if (!req.user) {
//     res.redirect('/auth/login');
//     return
//   }

//   const { projectName, description, image, content, username } = req.body;

//   if (!projectName) {
//     res.status(400).json({
//       error: 'Project name can not be empty',
//     })
//   } else if (projectName.length < 150) {
//     const id = generateUniqueId();
//     const newEntry = {
//       id,
//       projectName,
//       image,
//       created_at: Date.now(),
//       description,
//       content,
//       username
//     }
//     //validate the newEntry
//     if (!newEntry.description || !newEntry.content || !newEntry.image) {
//       return res.status(400).render('error', { message: 'Description, Content and Image can not be empty' });
//     }

//     //stringify the new entry
//     const newEntryAsString = JSON.stringify(newEntry);
//     //save the new entry to redis
//     await redis.set(`project:${id}`, newEntryAsString);
//     // Redirect the user to the project page
//     res.redirect(`/projects/${newEntry.id}`);
//   }
// });

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