const ResearchAgent = require('./agents/ResearchAgent');
const StrategyAgent = require('./agents/StrategyAgent');
const WriterAgent = require('./agents/WriterAgent');
const SEOAgent = require('./agents/SEOAgent');
const QAAgent = require('./agents/QAAgent');
const PublisherAgent = require('./agents/PublisherAgent');
const AnalyticsAgent = require('./agents/AnalyticsAgent');

class Orchestrator {
  constructor(config = {}) {
    this.agents = {
      research: new ResearchAgent(config),
      strategy: new StrategyAgent(config),
      writer: new WriterAgent(config),
      seo: new SEOAgent(config),
      qa: new QAAgent(config),
      publisher: new PublisherAgent(config),
      analytics: new AnalyticsAgent(config)
    };
    this.executionLog = [];
  }

  async executeFullWorkflow(brief) {
    console.log('🚀 Starting Content Creation Workflow...\n');
    const workflow = {};

    try {
      // Step 1: Research
      console.log('📚 Step 1: Research Agent');
      workflow.research = await this.agents.research.execute({
        topic: brief.topic,
        keywords: brief.keywords,
        domain: brief.domain
      });
      console.log('✅ Research complete\n');

      // Step 2: Strategy
      console.log('🎯 Step 2: Strategy Agent');
      workflow.strategy = await this.agents.strategy.execute({
        brief,
        researchData: workflow.research.data
      });
      console.log('✅ Strategy complete\n');

      // Step 3: Writing
      console.log('✍️  Step 3: Writer Agent');
      workflow.content = await this.agents.writer.execute({
        strategy: workflow.strategy.data,
        researchData: workflow.research.data,
        brief
      });
      console.log('✅ Content written\n');

      // Step 4: SEO Optimization
      console.log('🔍 Step 4: SEO Agent');
      workflow.seo = await this.agents.seo.execute({
        content: workflow.content.data.content,
        keywords: workflow.strategy.data.seoKeywords,
        title: brief.title
      });
      console.log('✅ SEO optimization complete\n');

      // Step 5: Quality Assurance
      console.log('✔️  Step 5: QA Agent');
      workflow.qa = await this.agents.qa.execute({
        content: workflow.content.data.content,
        strategy: workflow.strategy.data,
        researchData: workflow.research.data
      });

      if (!workflow.qa.data.approved) {
        console.log('⚠️  QA Issues found:', workflow.qa.data.issues);
        return { success: false, error: 'QA failed', workflow };
      }
      console.log('✅ Quality assurance passed\n');

      // Step 6: Publishing
      console.log('📤 Step 6: Publisher Agent');
      workflow.published = await this.agents.publisher.execute({
        content: workflow.content.data.content,
        metaTags: workflow.seo.data.metaTags,
        strategy: workflow.strategy.data
      });
      console.log('✅ Content published\n');

      // Step 7: Analytics
      console.log('📊 Step 7: Analytics Agent');
      workflow.analytics = await this.agents.analytics.execute({
        urls: workflow.published.data.urls,
        contentId: 'content-' + Date.now(),
        campaign: brief.campaign
      });
      console.log('✅ Analytics tracking setup\n');

      console.log('🎉 Workflow Complete!\n');
      return { success: true, workflow };

    } catch (error) {
      console.error('❌ Workflow failed:', error);
      return { success: false, error: error.message, workflow };
    }
  }

  async executeAgentOnly(agentName, input) {
    if (!this.agents[agentName]) {
      throw new Error(`Agent ${agentName} not found`);
    }
    return await this.agents[agentName].execute(input);
  }

  getExecutionLog() {
    return this.executionLog;
  }

  async retryFailedSteps(workflow) {
    const failedSteps = Object.entries(workflow)
      .filter(([_, result]) => !result.success);

    for (const [step, result] of failedSteps) {
      console.log(`🔄 Retrying ${step}...`);
      // Re-execute failed step
    }
  }
}

module.exports = Orchestrator;
