import express from 'express'
import Debug from 'debug'
import { v4 as uuidv4 } from 'uuid'
import redis from '../lib/redis.js'

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

adminRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
  // Make sure the user is an admin
  if (!req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
});



// adminRouter.route('/').get((req, res) => {
//   const title = "Admin Dashboard"
//   res.render('admin/admin', { title })
// })

adminRouter.route('/').get(async (req, res) => {
  // Get all the project keys from Redis
  const projectKeys = await redis.keys('project:*');
  const projects = await Promise.all(projectKeys.map(async key => {
    const projectAsString = await redis.get(key);
    return JSON.parse(projectAsString);
  }));
  const title = "Profile"
  // Render the projects page
  res.render('admin/admin', { projects, title });
});


adminRouter.route('/profile').get((req, res) => {
  const pageTitle = "Profile"
  res.render('admin/profile', { title: pageTitle, user: JSON.parse(req.user) });
});

adminRouter.route('/create').get((req, res) => {
  const pageTitle = 'Create project'
  res.render('admin/create', { title: pageTitle, user: JSON.parse(req.user) });
});

adminRouter.route('/create').post(async (req, res) => {
  const { projectName, description, image, content, username } = req.body;

  if (!projectName) {
    res.status(400).json({
      error: 'Project name can not be empty',
    })
  } else if (projectName.length < 150) {
    const id = generateUniqueId();
    const newEntry = {
      id,
      projectName,
      image,
      created_at: Date.now(),
      description,
      content,
      username
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

adminRouter.route('/:id').get(async (req, res) => {
  const id = req.params.id;

  // Get the project from Redis
  const projectAsString = await redis.get(`project:${id}`);
  if (!projectAsString) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Render the project page
  const project = JSON.parse(projectAsString);
  res.render('admin/edit', { project });
});


adminRouter.route('/:id/update').put(async (req, res) => {
  const { projectName, description, image, content } = req.body;
  const id = req.params.id;

  // Get the existing project from Redis
  const existingProjectAsString = await redis.get(`project:${id}`);
  if (!existingProjectAsString) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Update the existing project with the new data
  const existingProject = JSON.parse(existingProjectAsString);
  existingProject.projectName = projectName;
  existingProject.description = description;
  existingProject.image = image;
  existingProject.content = content;

  // Save the updated project to Redis
  await redis.set(`project:${id}`, JSON.stringify(existingProject));

  // Redirect the user to the updated project page
  res.redirect(`/projects/${id}`);
});

adminRouter.route('/:id/delete').delete(async (req, res) => {

  const id = req.params.id;
  // Delete the project from Redis
  await redis.del(`project:${id}`);
  res.redirect('/projects');
});


export { adminRouter }