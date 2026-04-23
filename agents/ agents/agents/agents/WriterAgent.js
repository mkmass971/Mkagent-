const BaseAgent = require('./BaseAgent');

class WriterAgent extends BaseAgent {
  constructor(config = {}) {
    super('writer', 'Writer Agent', config);
    this.llm = config.llm; // OpenAI client
  }

  async process(input) {
    const { strategy, researchData, brief } = input;

    // Call LLM to generate content
    const draft = await this.generateDraft(strategy, researchData, brief);

    return {
      content: draft,
      wordCount: draft.split(' ').length,
      keywordDensity: this.analyzeKeywords(draft, strategy.seoKeywords),
      timestamp: new Date().toISOString()
    };
  }

  async generateDraft(strategy, researchData, brief) {
    // In production: Call OpenAI/Claude API
    const prompt = this.buildPrompt(strategy, researchData, brief);
    
    // Mock response
    return `
    # ${brief.title || 'Content Title'}

    ## Introduction
    Hook: Problem statement about ${brief.topic}

    ## Main Content
    ${strategy.sections.map(s => `### ${s}\nContent for ${s} section.`).join('\n\n')}

    ## Conclusion
    Strong CTA: ${strategy.cta}
    `;
  }

  buildPrompt(strategy, researchData, brief) {
    return `
Write a ${strategy.contentType} in ${strategy.tone} tone.
Topic: ${brief.topic}
Keywords: ${strategy.seoKeywords.join(', ')}
Structure: ${JSON.stringify(strategy.sections)}
Facts: ${researchData.facts.join('; ')}
Audience: ${JSON.stringify(strategy.audiencePersona)}
CTA: ${strategy.cta}
    `;
  }

  analyzeKeywords(content, keywords) {
    const lower = content.toLowerCase();
    const analysis = {};
    keywords.forEach(kw => {
      const count = (lower.match(new RegExp(kw.toLowerCase(), 'g')) || []).length;
      analysis[kw] = { count, density: ((count / content.split(' ').length) * 100).toFixed(2) + '%' };
    });
    return analysis;
  }
}

module.exports = WriterAgent;
