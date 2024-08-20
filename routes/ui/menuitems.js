const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create a MenuItem
router.post('/', async (req, res) => {
  try {
    const menuItem = await db.MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all MenuItem
router.get('/', async (req, res) => {
  try {
    const menuItems = await db.MenuItem.findAll();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a MenuItem by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await db.MenuItem.findByPk(req.params.id);
    if (menuItem) {
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ error: 'MenuItem not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a MenuItem by ID
router.put('/:id', async (req, res) => {
  try {
    const menuItem = await db.MenuItem.findByPk(req.params.id);
    if (menuItem) {
      await menuItem.update(req.body);
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ error: 'MenuItem not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a MenuItem by ID
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await db.MenuItem.findByPk(req.params.id);
    if (menuItem) {
      await menuItem.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'MenuItem not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
