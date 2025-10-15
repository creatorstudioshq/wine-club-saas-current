// Execute SQL Cleanup Script
const SUPABASE_URL = 'https://aammkgdhfmkukpqkdduj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8';

async function executeCleanup() {
  const planIdsToDelete = [
    'a9a924e9-d954-4a39-a8e2-f45b8373a3bb',
    '3caacf9d-a6df-40eb-9cad-658c6b69f2f2', 
    '99adf485-098b-40d3-986f-21df5a7a02ab'
  ];

  console.log('🗑️  Deleting duplicate plans...');
  
  for (const planId of planIdsToDelete) {
    try {
      console.log(`Deleting plan ${planId}...`);
      
      // Try to delete through the REST API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/subscription_plans?id=eq.${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`✅ Successfully deleted plan ${planId}`);
      } else {
        console.log(`❌ Failed to delete plan ${planId}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error deleting plan ${planId}:`, error.message);
    }
  }

  // Verify cleanup
  console.log('\n🔍 Verifying cleanup...');
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/functions/v1/make-server-9d538b9c/plans/550e8400-e29b-41d4-a716-446655440000`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      console.log(`✅ Cleanup complete! Now have ${data.plans.length} plans:`);
      data.plans.forEach(plan => {
        console.log(`  - ${plan.name} (${plan.bottle_count} bottles) - ${plan.description || 'No description'}`);
      });
    }
  } catch (error) {
    console.log('❌ Error verifying cleanup:', error.message);
  }
}

executeCleanup();
