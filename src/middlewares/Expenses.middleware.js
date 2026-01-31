import Joi from 'joi';


export class ExpensesRequest {

  CreateExpenseSchema = Joi.object({
    usu_id: Joi.number().required(),
    exp_name: Joi.string().required(),
    exp_amount: Joi.number().required(),
    exp_percentVta: Joi.number().required(),
    cat_id: Joi.number().required(),
  }) 

  GetAllExpensesSchema = Joi.object({
    usu_id: Joi.number().required(),
  })

  paramsSchema = Joi.object({
    usu_id: Joi.string().required(),
    exp_id: Joi.string().required(),
  })

  UpdateExpenseSchema = Joi.object({
    exp_name: Joi.string().required(),
    exp_amount: Joi.number().required(),
    exp_percentVta: Joi.number().required(),
    cat_id: Joi.number().required(),
  }); 

  validateCreate = (req, res, next) => {
    const { error } = this.CreateExpenseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  validateUpdate = (req, res, next) => {
    const { error: paramsError } = this.paramsSchema.validate(req.params);
    if (paramsError) {
      return res.status(400).json({ message: paramsError.details[0].message });
    } 
    const { error: updateError } = this.UpdateExpenseSchema.validate(req.body); 
    if (updateError) {
      return res.status(400).json({ message: updateError.details[0].message });
    }
    next();
  };  

  validateDelete = (req, res, next) => {
    const { error } = this.paramsSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: paramsError.details[0].message });
    }
    next(); 
  }

  validateGetAll = (req, res, next) => {


    const { error } = this.GetAllExpensesSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  }; 
}