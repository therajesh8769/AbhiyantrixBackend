const express =require( 'express');
const Announcement=require( '../models/Announcement.js');

const router = express.Router();

// Get the latest announcement
router.get('/', async (req, res) => {
  try {
    const announcement = await Announcement.findOne().sort({ createdAt: -1 });
    if (announcement) {
      res.json(announcement);
    } else {
      // If no announcement exists, create a default one
      const defaultAnnouncement = new Announcement({
        content: 'All Events are on time :)',
        isVisible: true
      });
      const savedAnnouncement = await defaultAnnouncement.save();
      res.json(savedAnnouncement);
    }
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Failed to fetch announcement', error: error.message });
  }
});

// Create a new announcement
router.post('/', async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(400).json({
      message: 'Failed to create announcement',
      error: error.message
    });
  }
});

// Update an announcement
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isVisible } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Announcement ID is required' });
    }

    if (content === undefined && isVisible === undefined) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    updateData.updatedAt = Date.now();

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete an announcement
router.delete('/:id', async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports= router;

