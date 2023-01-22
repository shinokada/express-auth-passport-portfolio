import express from 'express'
import chalk from 'chalk'
import Debug from 'debug'
// import { v4 as uuidv4 } from 'uuid'
import redis, { titleExists } from '../lib/redis.js'
import { replaceSpacesWithDashes } from '../lib/utils.js'

const debug = Debug('app:adminRouter')
const adminRouter = express.Router()

adminRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});


adminRouter.route('/').get(async (req, res) => {
  let projects = []
  if (req.user && req.user.isAdmin) {
    // Get all the project keys from Redis
    const projectKeys = await redis.keys('project:*');
    projects = await Promise.all(projectKeys.map(async key => {
      const projectAsString = await redis.get(key);
      return JSON.parse(projectAsString);
    }));
  } else if (req.user) {
    const username = req.user.username
    // This will return an array of project ids for the user with the provided username.
    const projectIds = await redis.smembers(`projects:username:${username}`);

    for await (const id of projectIds) {
      const project = JSON.parse(await redis.get(`project:slug:${id}`))
      projects.push(project)
    }

  }

  res.render('admin/index', { projects });
});


adminRouter.route('/profile').get((req, res) => {
  res.render('admin/profile', { user: req.user });
});

adminRouter.route('/create-project').get((req, res) => {
  const error = ''
  res.render('admin/create-project', { user: req.user, error });
});

adminRouter.route('/create-project').post(async (req, res) => {
  const { projectName, description, image, content, username } = req.body;
  if (!projectName) {
    res.status(400).json({
      error: 'Project name can not be empty',
    })
  } else if (projectName.length < 150) {
    const newId = replaceSpacesWithDashes(projectName);
    // check if the new id already exists in the set of project ids
    const isTitleExist = await titleExists(newId);
    if (isTitleExist) {
      return res.status(409).render('admin/create-project', { user: req.user, error: 'Project name already exists' });
    } else {
      const newEntry = {
        id: newId,
        projectName,
        image,
        created_at: Date.now(),
        description,
        content,
        username
      }

      //validate the newEntry
      if (!newEntry.description || !newEntry.content || !newEntry.image) {
        return res.status(400).render('admin/create-project', { user: req.user, error: 'Description, Content and Image can not be empty' });
      }
      //stringify the new entry
      const newEntryAsString = JSON.stringify(newEntry);
      //save the new entry to redis using the projectKey function
      await redis.set(`project:slug:${newId}`, newEntryAsString);
      // add the new id to the set of project ids. newId is lowercase, spaces replaced with dashes
      // this will be used redis/titleExists function
      await redis.hset("project:titles", newId, 1);
      // Add the project id to the set keyed by the username
      // to collect all projects by username
      await redis.sadd(`projects:username:${newEntry.username}`, newId);
      // Redirect the user to the project page
      res.redirect(`/projects/${newId}`);
    }
  }
});


adminRouter.route('/project-update/:slug').put(async (req, res) => {
  const { projectName, description, image, content, username } = req.body;
  const oldSlug = req.params.slug;
  const newSlug = replaceSpacesWithDashes(projectName);
  const newId = replaceSpacesWithDashes(projectName);

  redis.get(`project:slug:${oldSlug}`, (err, existingProjectAsString) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!existingProjectAsString) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      redis.get(`project:id:${newId}`, (err, existingProjectWithId) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (existingProjectWithId) {
          res.status(409).json({ error: 'Project id already exists' });
        } else {
          const existingProject = JSON.parse(existingProjectAsString);
          // update the existing project with new data
          existingProject.projectName = projectName;
          existingProject.description = description;
          existingProject.image = image;
          existingProject.content = content;
          existingProject.slug = newSlug;
          existingProject.id = newId;
          // delete the old entry
          redis.del(`project:slug:${oldSlug}`);
          // save the updated project to Redis
          redis.set(`project:id:${newId}`, JSON.stringify(existingProject));
          res.json({ message: 'Project updated successfully' });
        }
      });
    }
  });
});

// need to be after PUT
adminRouter.route('/project-update/:slug').get(async (req, res) => {
  const slug = req.params.slug;

  // Get the project from Redis
  const projectAsString = await redis.get(`project:slug:${slug}`);
  if (!projectAsString) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Render the project page
  const project = JSON.parse(projectAsString);

  res.render('admin/edit-project', { user: req.user, project });
});


adminRouter.route('/project-delete/:id').delete(async (req, res) => {

  const id = req.params.id;
  // Delete the project from Redis
  await redis.del(`project:slug:${id}`);
  // delete from project:projectnames", projectName
  // todo
  res.status(200).json({ message: 'Project deleted successfully', status: 'success' });
});


export { adminRouter }