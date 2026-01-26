export default function validateBody(schema) {
  return (req, res, next) => {
    const options = {
      abortEarly: false,     // return all errors
      allowUnknown: false,   // reject unknown keys
      stripUnknown: true,    // remove unknown keys from the validated value
      convert: true,         // cast types (e.g., "12" -> 12)
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errors = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join('.'),
        type: detail.type,
      }));
      return res.status(400).json({ success: false, errors });
    }

    req.body = value;
    next();
  };
}
