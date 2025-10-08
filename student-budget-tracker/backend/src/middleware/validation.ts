import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Query validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  transaction: Joi.object({
    type: Joi.string().valid('INCOME', 'EXPENSE', 'SAVINGS').required(),
    amount: Joi.number().positive().required(),
    category: Joi.string().min(1).max(50).required(),
    date: Joi.date().iso().required(),
    notes: Joi.string().max(500).optional(),
  }),

  goal: Joi.object({
    title: Joi.string().min(1).max(100).required(),
    targetAmount: Joi.number().positive().required(),
    deadline: Joi.date().iso().optional(),
  }),

  course: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(1000).required(),
    price: Joi.number().min(0).optional(),
    thumbnail: Joi.string().uri().optional(),
  }),

  lesson: Joi.object({
    courseId: Joi.string().required(),
    title: Joi.string().min(1).max(200).required(),
    contentType: Joi.string().valid('TEXT', 'VIDEO', 'INTERACTIVE').required(),
    contentRef: Joi.string().required(),
    orderIndex: Joi.number().integer().min(0).required(),
    duration: Joi.number().integer().min(0).optional(),
  }),
};