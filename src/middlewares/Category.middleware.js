import Joi from "joi";

export class CategoryRequest {
  
  CreateCategorySchema = Joi.object({
    usu_id: Joi.number().required(),
    cat_name: Joi.string().required(),
    sec_id: Joi.number().required(),
    cat_profit_percent: Joi.number().optional(),
    supplies: Joi.array().items(
        Joi.object({
            sup_id: Joi.number().required(),
            quantity: Joi.number().min(1).required()
        })
    ).optional()
  });

  // --- AQUÍ ESTÁ LA CORRECCIÓN ---
  UpdateCategorySchema = Joi.object({
    cat_name: Joi.string().required(),
    
    // Agregamos el porcentaje para que Joi lo acepte
    cat_profit_percent: Joi.number().optional(),

    // Agregamos estos campos como opcionales por si el Frontend los envía en el body
    // (para evitar errores "is not allowed" si se te escapa un ID en el objeto data)
    cat_id: Joi.number().optional(),
    usu_id: Joi.number().optional(),
    sec_id: Joi.number().optional()
  });
  // -------------------------------

  paramsUpdateCategorySchema = Joi.object({
    cat_id: Joi.number().required(),
    usu_id: Joi.number().required(),
  });

  paramsGetAllSchema = Joi.object({
    usu_id: Joi.number().required(),
    sec_id: Joi.number().optional() // Agregué esto opcional por si acaso usas el filtro por sección
  });

  DeleteCategorySchema = Joi.object({
    cat_id: Joi.number().required(),
    usu_id: Joi.number().required(),
  });

  validateCreate = (req, res, next) => {
    const { error: bodyError } = this.CreateCategorySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
    }
    next();
  }

  validateUpdate = (req, res, next) => {
    // 1. Validar Params (ID en la URL)
    const { error: paramsError } = this.paramsUpdateCategorySchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }

    // 2. Validar Body (Datos a actualizar)
    // .validate(req.body, { allowUnknown: true }) // Opción rápida si quieres permitir todo
    const { error: bodyError } = this.UpdateCategorySchema.validate(req.body);
    
    if (bodyError) {
        return res.status(400).json({ message: bodyError.details[0].message });
    }

    next();
  }

  validateGetAll = (req, res, next) => {
    // Permitimos que valide query params también si los mandas por ahí, o solo params
    // Joi valida req.params. Si usas query (?sec_id=1), deberías validar req.query
    // Asumo que tu ruta es /getAll/:usu_id, así que validamos params.
    const { error: paramsError } = this.paramsGetAllSchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    next();
  }

  validateDelete = (req, res, next) => {
    const { error: paramsError } = this.DeleteCategorySchema.validate(req.params);
    if (paramsError) {
        return res.status(400).json({ message: paramsError.details[0].message });
    }
    next();
  }
}