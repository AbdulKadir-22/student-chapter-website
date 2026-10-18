const eventService = require('./event.service');

const getEvents = async (req, res, next) => {
  try {
    const result = await eventService.getEvents(req.query, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEventsStats = async (req, res, next) => {
  try {
    const stats = await eventService.getEventsStats(req.user);
    return res.status(200).json({ data: stats, ...stats });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user);
    return res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const updated = await eventService.updateEvent(req.params.id, req.body);
    return res.status(200).json({
      message: 'Event updated successfully',
      event: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventDetails(req.event, req.user);
    return res.status(200).json({ event, data: event, ...event });
  } catch (error) {
    next(error);
  }
};

const getAttendees = async (req, res, next) => {
  try {
    const result = await eventService.getEventAttendees(req.params.id, req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const exportAttendees = async (req, res, next) => {
  try {
    const { filename, csv } = await eventService.getAttendeesCSV(req.params.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const removeAttendee = async (req, res, next) => {
  try {
    const result = await eventService.removeAttendee(req.params.id, req.params.userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const scanTicket = async (req, res, next) => {
  try {
    const { ticketCode } = req.body;
    const cleanCode = ticketCode.startsWith('ACMT:') ? ticketCode.slice(5) : ticketCode;
    const result = await eventService.processScan(req.event, cleanCode, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventsStats,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAttendees,
  exportAttendees,
  removeAttendee,
  scanTicket,
};
