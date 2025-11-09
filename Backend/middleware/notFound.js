module.exports = (_req, res, _next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
};
