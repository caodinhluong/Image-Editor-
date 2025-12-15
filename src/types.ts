import React from 'react';

export type ViewState = 'landing' | 'auth' | 'home' | 'editor' | 'marketplace' | 'team' | 'analytics' | 'profile' | 'settings' | 'brandkit' | 'assets' | 'photoshoot';
export type Language = 'en' | 'vi';

export interface Template {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  price: number | 'Free';
  tags: string[];
  trending?: boolean;
}

export interface Project {
  id: string;
  name: string;
  lastEdited: string;
  status: 'Draft' | 'In Review' | 'Approved';
  thumbnail: string;
  collaborators: string[];
}

export interface AnalyticData {
  name: string;
  views: number;
  sales: number;
  amt: number;
}

export interface ToolItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  isPro?: boolean;
}