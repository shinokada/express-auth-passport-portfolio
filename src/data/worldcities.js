import redis from '../lib/redis.js';

export const addIntCities = () => {
  redis.geoadd('cities', 0.0000, 0.0000, "North Pole");
  redis.geoadd('cities', -0.1278, 51.5074, "London");
  redis.geoadd('cities', -3.7032, 40.4168, "Madrid");
  redis.geoadd('cities', -77.0369, 38.9072, "Washington D.C.");
  redis.geoadd('cities', 139.6917, 35.6895, "Tokyo")
  redis.geoadd('cities', 2.3522, 48.8566, "Paris");
  redis.geoadd('cities', 12.5673, 41.8719, "Rome");
  redis.geoadd('cities', 77.2300, 28.6100, "Delhi")
  redis.geoadd('cities', -73.5673, 45.5017, "Montreal");
  redis.geoadd('cities', 121.4737, 31.2304, "Shanghai")
  redis.geoadd('cities', -104.9847, 39.7392, "Denver");
  redis.geoadd('cities', 72.8777, 19.0760, "Mumbai")
  redis.geoadd('cities', -99.1332, 19.4326, "Mexico City")
  redis.geoadd('cities', -46.6333, -23.5505, "São Paulo")
  redis.geoadd('cities', -97.5164, 35.4676, "Oklahoma City");
  redis.geoadd('cities', 67.0099, 24.8615, "Karachi")
  redis.geoadd('cities', 28.9784, 41.0082, "Istanbul")
  redis.geoadd('cities', -74.0059, 40.7128, "New York City")
  redis.geoadd('cities', 120.9842, 14.5995, "Manila")
  redis.geoadd('cities', 117.3616, 39.3434, "Tianjin")
  redis.geoadd('cities', 135.5022, 34.6937, "Osaka")
  redis.geoadd('cities', 31.2461, 30.0444, "Cairo")
  redis.geoadd('cities', -118.2437, 34.0522, "Los Angeles")
  redis.geoadd('cities', 37.6173, 55.7558, "Moscow")
  redis.geoadd('cities', 121.4737, 31.2304, "Shanghai")
  redis.geoadd('cities', 88.3639, 22.5726, "Kolkata")
}