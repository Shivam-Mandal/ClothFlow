// controllers/styleController.js
import { Style } from '../models/Style.js';

/**
 * GET /api/styles
 */
export const getAllStyles = async (req, res) => {
  try {
    const styles = await Style.find().sort({ createdAt: -1 });
    res.json({ success: true, data: styles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/styles/:id
 */
export const getStyleById = async (req, res) => {
  try {
    const style = await Style.findById(req.params.id);
    if (!style) return res.status(404).json({ success: false, message: 'Style not found' });
    res.json({ success: true, data: style });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/styles
 * Body: { name, steps? }
 */
export const createStyle = async (req, res) => {
  try {
    const { name, steps } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const style = new Style({
      name,
      steps: Array.isArray(steps) ? steps : []
    });

    await style.save();
    res.status(201).json({ success: true, data: style });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/styles/:id
 * Body: { name?, steps? } - replace provided fields
 */
export const updateStyle = async (req, res) => {
  try {
    const { name, steps } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (steps !== undefined) update.steps = steps;

    const style = await Style.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!style) return res.status(404).json({ success: false, message: 'Style not found' });
    res.json({ success: true, data: style });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PATCH /api/styles/:id/steps
 * Body examples:
 *  - { steps: [...] }         -> replace all steps
 *  - { index: 2, enabled: true } -> update single step by index
 */
export const patchSteps = async (req, res) => {
  try {
    const { steps, index, enabled } = req.body;
    const style = await Style.findById(req.params.id);
    if (!style) return res.status(404).json({ success: false, message: 'Style not found' });

    if (Array.isArray(steps)) {
      style.steps = steps;
    } else if (typeof index === 'number' && typeof enabled === 'boolean') {
      if (index < 0 || index >= style.steps.length) {
        return res.status(400).json({ success: false, message: 'Index out of range' });
      }
      style.steps[index].enabled = enabled;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    await style.save();
    res.json({ success: true, data: style });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/styles/:id
 */
export const deleteStyle = async (req, res) => {
  try {
    const style = await Style.findByIdAndDelete(req.params.id);
    if (!style) return res.status(404).json({ success: false, message: 'Style not found' });
    res.json({ success: true, message: 'Style deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
    