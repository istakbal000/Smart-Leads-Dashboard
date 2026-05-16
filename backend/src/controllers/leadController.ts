import { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leadData = { ...req.body, assignedTo: req.body.assignedTo || (req as any).user._id };
    const lead = await leadService.createLead(leadData);
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await leadService.getLeads(req.query, (req as any).user);
    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.getLeadById(req.params.id as string, (req as any).user);
    res.status(200).json({
      success: true,
      message: 'Lead fetched successfully',
      data: lead,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadService.updateLead(req.params.id as string, req.body, (req as any).user);
    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await leadService.deleteLead(req.params.id as string, (req as any).user);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    next(error);
  }
};
