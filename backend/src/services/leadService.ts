import Lead, { ILead, LeadStatus, LeadSource } from '../models/Lead';
import mongoose from 'mongoose';

export const createLead = async (leadData: Partial<ILead>) => {
  return await Lead.create(leadData);
};

export const getLeads = async (query: any, user: any) => {
  const { status, source, search, sort, page = 1, limit = 10 } = query;
  
  let filter: any = {};

  // RBAC: Sales users can only see their assigned leads
  if (user.role === 'Sales User') {
    filter.assignedTo = user._id;
  }

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter)
    .sort(sortOption as any)
    .skip(skip)
    .limit(Number(limit))
    .populate('assignedTo', 'name email');

  return {
    leads,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getLeadById = async (id: string, user: any) => {
  const lead = await Lead.findById(id).populate('assignedTo', 'name email');
  if (!lead) throw new Error('Lead not found');

  if (user.role === 'Sales User' && lead.assignedTo._id.toString() !== user._id.toString()) {
    throw new Error('Not authorized to view this lead');
  }

  return lead;
};

export const updateLead = async (id: string, leadData: Partial<ILead>, user: any) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new Error('Lead not found');

  if (user.role === 'Sales User' && lead.assignedTo.toString() !== user._id.toString()) {
    throw new Error('Not authorized to update this lead');
  }

  return await Lead.findByIdAndUpdate(id, leadData, { new: true });
};

export const deleteLead = async (id: string, user: any) => {
  if (user.role !== 'Admin') {
    throw new Error('Only admins can delete leads');
  }

  const lead = await Lead.findById(id);
  if (!lead) throw new Error('Lead not found');

  await Lead.findByIdAndDelete(id);
  return { message: 'Lead removed' };
};
