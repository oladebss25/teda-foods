export function validateOrderInput(body) {
  const errors = [];

  if (!body.name || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }
  if (body.name && body.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be under 100 characters' });
  }

  if (!body.phone || !/^0\d{10}$/.test(body.phone.trim())) {
    errors.push({ field: 'phone', message: 'Valid Nigerian phone number required (e.g. 08012345678)' });
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    errors.push({ field: 'email', message: 'Valid email address required' });
  }

  if (body.notes && body.notes.length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be under 500 characters' });
  }

  if (body.orderLines && body.orderLines.length > 5000) {
    errors.push({ field: 'orderLines', message: 'Order too large' });
  }

  return errors;
}
