import { v4 as uuidv4 } from 'uuid'

export const generateUniqueId = () => {
  return uuidv4();
}

// export const projectKey = (title) => {
//   return `project:title:${replaceSpacesWithDashes(title)}`;
// }

// lowercase and normalize the string
export const replaceSpacesWithDashes = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
}

