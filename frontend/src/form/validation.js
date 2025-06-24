function isDirty(value) {
  return value || value === 0;
}

export function required(requiredFields, values) {
  return requiredFields.reduce(
    (fields, field) => ({
      ...fields,
      ...(isDirty(values[field]) ? undefined : { [field]: 'Required' }),
    }),
    {}
  );
}

export function validateDateRange(start, end) {
  if (start && end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (d2 < d1) {
      return 'End date must be after start date.';
    }
  }
  return null;
}
