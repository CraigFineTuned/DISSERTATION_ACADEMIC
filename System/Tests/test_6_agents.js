/**
 * UGENTIC 6-Agent Coordination Test
 * Tests full hierarchical coordination with all 6 agents
 * 
 * File: C:\Users\craig\Desktop\MainProjects\Ugentic_Dissertation\DISSERTATION_ACADEMIC\System\Tests\test_6_agents.js
 */

const AgentMemoryManager = require('../AgentManager/agent_memory_manager.js');

async function test6AgentCoordination() {
  console.log('='.repeat(60));
  console.log('UGENTIC 6-AGENT COORDINATION TEST');
  console.log('='.repeat(60));
  console.log('');

  const agentManager = new AgentMemoryManager({ maxConcurrent: 4 });
  
  // Preload core agents
  await agentManager.preloadCoreAgents();
  
  const scenario = `Critical database server is down. Financial systems are offline. 
Multiple departments (Finance, HR, Operations) cannot access critical applications. 
Users are calling the helpdesk. This is affecting ~200 users.`;

  console.log('📋 SCENARIO:');
  console.log(scenario);
  console.log('');
  console.log('🤖 AGENT COORDINATION SEQUENCE:');
  console.log('');

  // Step 1: IT Support receives initial report
  console.log('1️⃣  IT_SUPPORT - Initial Report');
  console.log('-'.repeat(60));
  const supportResponse = await agentManager.getResponse('IT_Support', 
    `A user just reported: "${scenario}" What is your initial response?`
  );
  console.log(supportResponse);
  console.log('');

  // Step 2: Service Desk Manager coordinates
  console.log('2️⃣  SERVICE_DESK_MANAGER - Coordination');
  console.log('-'.repeat(60));
  const managerCoordination = await agentManager.getResponse('Service_Desk_Manager',
    `IT Support has received this critical incident: "${scenario}"
    
    IT Support's initial assessment: "${supportResponse}"
    
    As Service Desk Manager, coordinate the team response.`
  );
  console.log(managerCoordination);
  console.log('');

  // Step 3: Infrastructure diagnoses
  console.log('3️⃣  INFRASTRUCTURE - Diagnosis');
  console.log('-'.repeat(60));
  const infraDiagnosis = await agentManager.getResponse('Infrastructure',
    `The database server is down affecting financial systems.
    
    Service Desk Manager's coordination: "${managerCoordination}"
    
    Please diagnose the root cause and report your findings.`
  );
  console.log(infraDiagnosis);
  console.log('');

  // Step 4: Network Support verifies connectivity
  console.log('4️⃣  NETWORK_SUPPORT - Connectivity Check');
  console.log('-'.repeat(60));
  const networkCheck = await agentManager.getResponse('Network_Support',
    `Database server is down. Infrastructure is diagnosing the server itself.
    
    Please verify network connectivity to the database server and report findings.`
  );
  console.log(networkCheck);
  console.log('');

  // Step 5: App Support assesses application impact
  console.log('5️⃣  APP_SUPPORT - Application Impact');
  console.log('-'.repeat(60));
  const appImpact = await agentManager.getResponse('App_Support',
    `Financial systems are offline due to database server failure.
    
    Infrastructure findings: "${infraDiagnosis}"
    Network findings: "${networkCheck}"
    
    Please assess the application-level impact and dependencies.`
  );
  console.log(appImpact);
  console.log('');

  // Step 6: IT Manager makes strategic decision
  console.log('6️⃣  IT_MANAGER - Strategic Decision');
  console.log('-'.repeat(60));
  const managerDecision = await agentManager.getResponse('IT_Manager',
    `Critical incident - database server down, 200 users affected.
    
    Team findings:
    - Infrastructure: "${infraDiagnosis}"
    - Network Support: "${networkCheck}"
    - App Support: "${appImpact}"
    - Service Desk Manager coordination: "${managerCoordination}"
    
    As IT Manager, make the strategic decision on our response and recovery approach.`
  );
  console.log(managerDecision);
  console.log('');

  // Display status
  console.log('='.repeat(60));
  console.log('📊 AGENT MANAGER STATUS');
  console.log('='.repeat(60));
  const status = agentManager.getStatus();
  console.log(`Currently loaded agents: ${status.loadedCount}/${status.maxConcurrent}`);
  console.log(`Agents: ${status.loadedAgents.join(', ')}`);
  console.log('');
  console.log('Agent details:');
  status.details.forEach(agent => {
    console.log(`  - ${agent.name} (Priority ${agent.priority})`);
    console.log(`    Last used: ${agent.lastUsed}`);
  });
  console.log('');
  console.log('✅ 6-AGENT COORDINATION TEST COMPLETE');
  console.log('='.repeat(60));
}

// Run test
test6AgentCoordination().catch(console.error);