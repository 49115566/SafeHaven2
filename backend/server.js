import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all shelters
app.get('/api/shelters', (req, res) => {
  db.all('SELECT * FROM shelters', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const shelters = rows.map(row => ({
      id: row.id,
      name: row.name,
      location: {
        latitude: row.latitude,
        longitude: row.longitude,
        address: row.address
      },
      capacity: {
        current: row.current_capacity,
        maximum: row.maximum_capacity
      },
      needs: {
        food: row.food_need,
        water: row.water_need,
        medicalSupplies: row.medical_supplies_need,
        blankets: row.blankets_need,
        clothing: row.clothing_need,
        other: row.other_needs
      },
      status: row.status,
      otherInformation: row.other_information,
      lastUpdated: row.last_updated
    }));
    
    res.json(shelters);
  });
});

// Create shelter
app.post('/api/shelters', (req, res) => {
  const shelter = req.body;
  const stmt = db.prepare(`INSERT INTO shelters (
    id, name, latitude, longitude, address, current_capacity, maximum_capacity,
    food_need, water_need, medical_supplies_need, blankets_need, clothing_need,
    other_needs, status, other_information, last_updated
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run([
    shelter.id, shelter.name, shelter.location.latitude, shelter.location.longitude,
    shelter.location.address, shelter.capacity.current, shelter.capacity.maximum,
    shelter.needs.food, shelter.needs.water, shelter.needs.medicalSupplies,
    shelter.needs.blankets, shelter.needs.clothing, shelter.needs.other,
    shelter.status, shelter.otherInformation, shelter.lastUpdated
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: shelter.id });
  });
});

// Update shelter
app.put('/api/shelters/:id', (req, res) => {
  const shelter = req.body;
  const stmt = db.prepare(`UPDATE shelters SET
    name = ?, latitude = ?, longitude = ?, address = ?, current_capacity = ?, maximum_capacity = ?,
    food_need = ?, water_need = ?, medical_supplies_need = ?, blankets_need = ?, clothing_need = ?,
    other_needs = ?, status = ?, other_information = ?, last_updated = ?
    WHERE id = ?`);
  
  stmt.run([
    shelter.name, shelter.location.latitude, shelter.location.longitude,
    shelter.location.address, shelter.capacity.current, shelter.capacity.maximum,
    shelter.needs.food, shelter.needs.water, shelter.needs.medicalSupplies,
    shelter.needs.blankets, shelter.needs.clothing, shelter.needs.other,
    shelter.status, shelter.otherInformation, shelter.lastUpdated, req.params.id
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Update shelter status only
app.patch('/api/shelters/:id/status', (req, res) => {
  const { status } = req.body;
  const lastUpdated = new Date().toISOString();
  
  db.run('UPDATE shelters SET status = ?, last_updated = ? WHERE id = ?', 
    [status, lastUpdated, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const users = rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      shelterId: row.shelter_id,
      location: row.latitude && row.longitude ? {
        latitude: row.latitude,
        longitude: row.longitude
      } : undefined,
      address: row.address
    }));
    
    res.json(users);
  });
});

// Create user
app.post('/api/users', (req, res) => {
  const user = req.body;
  const stmt = db.prepare(`INSERT INTO users (
    id, name, type, shelter_id, latitude, longitude, address
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
  stmt.run([
    user.id, user.name, user.type, user.shelterId || null,
    user.location?.latitude || null, user.location?.longitude || null,
    user.address || null
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: user.id });
  });
});

app.listen(PORT, () => {
  console.log(`SafeHaven backend running on port ${PORT}`);
});