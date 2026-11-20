-- =====================================================================
-- Cloudflare D1 SQL Initialization Script for Aditya Thete Portfolio
-- Run this in your Cloudflare D1 "Console" tab to create the table and seed data
-- =====================================================================

CREATE TABLE IF NOT EXISTS portfolio_store (
  id TEXT PRIMARY KEY DEFAULT 'master',
  data TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verify table creation
SELECT name FROM sqlite_master WHERE type='table' AND name='portfolio_store';
