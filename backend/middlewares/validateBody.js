// No changes needed — Joi validation is DB-agnostic
export default function validateBody(schema) {
  return (req, res, next) => {
    const options = {
      abortEarly:    false,
      allowUnknown:  false,
      stripUnknown:  true,
      convert:       true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      const errors = error.details.map((d) => ({
        message: d.message,
        path:    d.path.join("."),
        type:    d.type,
      }));
      return res.status(400).json({ success: false, errors });
    }

    req.body = value;
    next();
  };
}