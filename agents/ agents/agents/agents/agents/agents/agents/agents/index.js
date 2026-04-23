const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const Orchestrator = require('./Orchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Orchestrator
const orchestrator = new Orchestrator({
  apiKey: process.env.OPENAI_API_KEY,
  platforms: ['blog', 'social', 'email']
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'AI Agent System Running', timestamp: new Date() });
});

// Main Workflow
app.post('/api/create-content', async (req, res) => {
  try {
    const brief = req.body;
    if (!brief.topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const result = await orchestrator.executeFullWorkflow(brief);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Research Endpoint
app.post('/api/research', async (req, res) => {
  try {
    const result = await orchestrator.agents.research.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Strategy Endpoint
app.post('/api/strategy', async (req, res) => {
  try {
    const result = await orchestrator.agents.strategy.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Writer Endpoint
app.post('/api/write', async (req, res) => {
  try {
    const result = await orchestrator.agents.writer.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEO Endpoint
app.post('/api/seo', async (req, res) => {
  try {
    const result = await orchestrator.agents.seo.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QA Endpoint
app.post('/api/qa', async (req, res) => {
  try {
    const result = await orchestrator.agents.qa.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publisher Endpoint
app.post('/api/publish', async (req, res) => {
  try {
    const result = await orchestrator.agents.publisher.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Endpoint
app
