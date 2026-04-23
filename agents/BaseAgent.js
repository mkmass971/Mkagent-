// BaseAgent.js - Foundation for all agents
class BaseAgent {
  constructor(id, name, config = {}) {
    this.id = id;
    this.name = name;
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;
    this.logger = config.logger || console;
  }

  async execute(input) {
    let retries = 0;
    let lastError = null;

    while (retries < this.maxRetries) {
      try {
        this.logger.log(`[${this.name}] Executing with input:`, input);
        const result = await this.process(input);
        this.logger.log(`[${this.name}] Success:`, result);
        return { success: true, data: result, agent: this.id };
      } catch (error) {
        lastError = error;
        retries++;
        this.logger.warn(`[${this.name}] Attempt ${retries} failed:`, error.message);
        
        if (retries < this.maxRetries) {
          await this.delay(1000 * retries); // Exponential backoff
        }
      }
    }

    // Final failure
    this.logger.error(`[${this.name}] Failed after ${this.maxRetries} retries`);
    return {
      success: false,
      error: lastError.message,
      agent: this.id,
      retries: this.maxRetries
    };
  }

  async process(input) {
    throw new Error('process() must be implemented by subclass');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BaseAgent;
