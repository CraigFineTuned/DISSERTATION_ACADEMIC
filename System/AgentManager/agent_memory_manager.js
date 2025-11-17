/**
 * UGENTIC Agent Memory Manager
 * Manages 6 agents on 16GB RAM through smart loading/unloading
 * 
 * File: C:\Users\craig\Desktop\MainProjects\Ugentic_Dissertation\DISSERTATION_ACADEMIC\System\AgentManager\agent_memory_manager.js
 */

const { Ollama } = require('ollama');

class AgentMemoryManager {
  constructor(options = {}) {
    this.ollama = new Ollama({ host: 'http://localhost:11434' });
    this.loadedAgents = new Map();
    this.maxConcurrent = options.maxConcurrent || 4; // Safe for 16GB RAM
    this.keepAliveMs = options.keepAliveMs || 5 * 60 * 1000; // 5 minutes
    
    // Agent priority (lower = higher priority, never unload)
    this.agentPriority = {
      IT_Support: 1,           // Always loaded (front-line)
      Service_Desk_Manager: 2, // Always loaded (coordinator)
      IT_Manager: 3,           // Load on demand (strategic)
      App_Support: 4,          // Load on demand (specialist)
      Network_Support: 5,      // Load on demand (specialist)
      Infrastructure: 6        // Load on demand (specialist)
    };
    
    // Load system prompts
    this.systemPrompts = require('./agent_config.js').systemPrompts;
    
    // Start cleanup timer
    this.startCleanupTimer();
  }

  /**
   * Load an agent into memory
   */
  async loadAgent(agentName) {
    if (this.loadedAgents.has(agentName)) {
      // Update last used time
      const agent = this.loadedAgents.get(agentName);
      agent.lastUsed = Date.now();
      return agent;
    }

    // Check if we need to unload an agent first
    if (this.loadedAgents.size >= this.maxConcurrent) {
      await this.unloadLowestPriority();
    }

    console.log(`[AgentManager] Loading agent: ${agentName}`);
    
    const agentData = {
      name: agentName,
      model: 'ugentic-qwen:latest',
      systemPrompt: this.systemPrompts[agentName],
      priority: this.agentPriority[agentName],
      lastUsed: Date.now(),
      loadedAt: Date.now()
    };

    this.loadedAgents.set(agentName, agentData);
    
    console.log(`[AgentManager] Agent loaded: ${agentName} (Priority: ${agentData.priority})`);
    console.log(`[AgentManager] Currently loaded: ${Array.from(this.loadedAgents.keys()).join(', ')}`);
    
    return agentData;
  }

  /**
   * Unload the lowest priority agent
   */
  async unloadLowestPriority() {
    // Never unload top 2 priority agents
    const unloadable = Array.from(this.loadedAgents.entries())
      .filter(([name, data]) => data.priority > 2)
      .sort((a, b) => {
        // Sort by: lowest priority first, then oldest last-used
        if (a[1].priority !== b[1].priority) {
          return b[1].priority - a[1].priority;
        }
        return a[1].lastUsed - b[1].lastUsed;
      });

    if (unloadable.length > 0) {
      const [agentName] = unloadable[0];
      console.log(`[AgentManager] Unloading agent: ${agentName}`);
      this.loadedAgents.delete(agentName);
      
      // Ollama automatically frees memory when model is not in use
      console.log(`[AgentManager] Agent unloaded: ${agentName}`);
    }
  }

  /**
   * Get response from an agent (loads if needed)
   */
  async getResponse(agentName, prompt, options = {}) {
    const agent = await this.loadAgent(agentName);
    
    const messages = [
      { role: 'system', content: agent.systemPrompt },
      { role: 'user', content: prompt }
    ];
    
    try {
      const response = await this.ollama.chat({
        model: agent.model,
        messages: messages,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          top_k: options.top_k || 40,
          num_predict: options.maxTokens || 512
        }
      });
      
      // Update last used time
      agent.lastUsed = Date.now();
      
      return response.message.content;
    } catch (error) {
      console.error(`[AgentManager] Error getting response from ${agentName}:`, error);
      throw error;
    }
  }

  /**
   * Get multi-agent conversation response
   */
  async getConversationResponse(agentName, conversationHistory, options = {}) {
    const agent = await this.loadAgent(agentName);
    
    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...conversationHistory
    ];
    
    try {
      const response = await this.ollama.chat({
        model: agent.model,
        messages: messages,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          top_k: options.top_k || 40,
          num_predict: options.maxTokens || 512
        }
      });
      
      agent.lastUsed = Date.now();
      
      return response.message.content;
    } catch (error) {
      console.error(`[AgentManager] Error in conversation with ${agentName}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup inactive agents periodically
   */
  startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      const toUnload = [];
      
      for (const [name, agent] of this.loadedAgents.entries()) {
        // Don't unload high-priority agents
        if (agent.priority <= 2) continue;
        
        // Check if inactive for longer than keepAliveMs
        if (now - agent.lastUsed > this.keepAliveMs) {
          toUnload.push(name);
        }
      }
      
      for (const name of toUnload) {
        console.log(`[AgentManager] Cleanup: Unloading inactive agent ${name}`);
        this.loadedAgents.delete(name);
      }
    }, 60 * 1000); // Check every minute
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      loadedAgents: Array.from(this.loadedAgents.keys()),
      loadedCount: this.loadedAgents.size,
      maxConcurrent: this.maxConcurrent,
      details: Array.from(this.loadedAgents.entries()).map(([name, data]) => ({
        name,
        priority: data.priority,
        lastUsed: new Date(data.lastUsed).toISOString(),
        loadedAt: new Date(data.loadedAt).toISOString()
      }))
    };
  }

  /**
   * Preload high-priority agents
   */
  async preloadCoreAgents() {
    console.log('[AgentManager] Preloading core agents...');
    await this.loadAgent('IT_Support');
    await this.loadAgent('Service_Desk_Manager');
    console.log('[AgentManager] Core agents preloaded');
  }
}

module.exports = AgentMemoryManager;