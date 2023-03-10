import redis from '../lib/redis.js';

export const addUsCities = () => {
  redis.geoadd('uscities', -71.0589, 42.3601, "Boston, Massachusetts");
  redis.geoadd('uscities', -75.1652, 39.9526, "Philadelphia, Pennsylvania");
  redis.geoadd('uscities', -112.0740, 33.4484, "Phoenix, Arizona");
  redis.geoadd('uscities', -98.4936, 29.4241, "San Antonio, Texas");
  redis.geoadd('uscities', -121.8949, 37.3382, "San Jose, California");
  redis.geoadd('uscities', -97.7431, 30.2672, "Austin, Texas");
  redis.geoadd('uscities', -81.6581, 30.3322, "Jacksonville, Florida");
  redis.geoadd('uscities', -97.3307, 32.7555, "Fort Worth, Texas");
  redis.geoadd('uscities', -82.9988, 39.9848, "Columbus, Ohio");
  redis.geoadd('uscities', -80.8431267, 35.2270869, "Charlotte, North Carolina");
  redis.geoadd('uscities', -104.9903, 39.7392, "Denver, Colorado");
  redis.geoadd('uscities', -77.0369, 38.9072, "Washington D.C.");
  redis.geoadd('uscities', -86.7844, 36.1627, "Nashville, Tennessee");
  redis.geoadd('uscities', -106.4850, 31.7619, "El Paso, Texas");
  redis.geoadd('uscities', -115.1398, 36.1749, "Las Vegas, Nevada");
  redis.geoadd('uscities', -85.7585, 38.2527, "Louisville, Kentucky");
  redis.geoadd('uscities', -76.6122, 39.2904, "Baltimore, Maryland");
  redis.geoadd('uscities', -87.9667, 43.0389, "Milwaukee, Wisconsin");
  redis.geoadd('uscities', -106.6056, 35.0845, "Albuquerque, New Mexico");
  redis.geoadd('uscities', -84.3879, 33.7490, "Atlanta, Georgia");
  redis.geoadd('uscities', -94.5786, 39.0997, "Kansas City, Missouri");
  redis.geoadd('uscities', -80.1918, 25.7617, "Miami, Florida");
  redis.geoadd('uscities', -93.2650, 44.9778, "Minneapolis, Minnesota");
  redis.geoadd('uscities', -121.4944, 38.5816, "Sacramento, California");
  redis.geoadd('uscities', -82.4572, 27.9475, "Tampa, Florida");
  redis.geoadd('uscities', -84.5120, 39.1031, "Cincinnati, Ohio");
  redis.geoadd('uscities', -122.6765, 45.5231, "Portland, Oregon");
  redis.geoadd('uscities', -81.6944, 41.4993, "Cleveland, Ohio");
  redis.geoadd('uscities', -86.1580, 39.7684, "Indianapolis, Indiana");
  redis.geoadd('uscities', -73.9235, 40.6635, "Queens, New York");
  redis.geoadd('uscities', -87.6298, 41.8781, "Chicago, Illinois");
  redis.geoadd('uscities', -122.3321, 47.6062, "Seattle, Washington");
  redis.geoadd('uscities', -117.1611, 32.7157, "San Diego, California");
  redis.geoadd('uscities', -95.3698, 29.7604, "Houston, Texas");
  redis.geoadd('uscities', -96.7969, 32.7766, "Dallas, Texas");
  redis.geoadd('uscities', -118.2437, 34.0522, "Los Angeles, California");
  redis.geoadd('uscities', -122.4194, 37.7749, "San Francisco, California");
  redis.geoadd('uscities', -79.9959, 40.4406, "Pittsburgh, Pennsylvania");
  redis.geoadd('uscities', -74.0059, 40.7128, "New York City, New York");
  redis.geoadd('uscities', -97.7431, 30.2672, "Austin, Texas");
  redis.geoadd('uscities', -97.3307, 32.7555, "Fort Worth, Texas");
  redis.geoadd('uscities', -121.8949, 37.3382, "San Jose, California");
}