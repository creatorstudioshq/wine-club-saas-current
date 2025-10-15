// Cleanup Duplicate Plans Script
// This script will remove duplicate plans from the database

const SUPABASE_URL = 'https://aammkgdhfmkukpqkdduj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8';
const KING_FROSCH_ID = '550e8400-e29b-41d4-a716-446655440000';

async function cleanupDuplicatePlans() {
  try {
    console.log('🔍 Fetching all plans for King Frosch Wine Club...');
    
    // Get all plans
    const response = await fetch(`${SUPABASE_URL}/functions/v1/make-server-9d538b9c/plans/${KING_FROSCH_ID}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch plans: ${response.status}`);
    }

    const data = await response.json();
    const plans = data.plans;
    
    console.log(`📊 Found ${plans.length} plans:`);
    plans.forEach(plan => {
      console.log(`  - ${plan.name} (${plan.bottle_count} bottles) - Created: ${plan.created_at} - Description: ${plan.description || 'None'}`);
    });

    // Group plans by name and bottle_count
    const planGroups = {};
    plans.forEach(plan => {
      const key = `${plan.name}-${plan.bottle_count}`;
      if (!planGroups[key]) {
        planGroups[key] = [];
      }
      planGroups[key].push(plan);
    });

    console.log('\n🔍 Analyzing duplicates...');
    const plansToDelete = [];
    
    Object.entries(planGroups).forEach(([key, group]) => {
      if (group.length > 1) {
        console.log(`\n📋 Found ${group.length} duplicates for ${key}:`);
        
        // Sort by created_at desc, keep the first (newest)
        group.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const keepPlan = group[0];
        const deletePlans = group.slice(1);
        
        console.log(`  ✅ Keeping: ${keepPlan.name} (${keepPlan.id}) - ${keepPlan.created_at} - Description: ${keepPlan.description || 'None'}`);
        
        // If the newest plan has no description, try to find one with description
        if (!keepPlan.description) {
          const planWithDescription = group.find(p => p.description);
          if (planWithDescription) {
            console.log(`  🔄 Switching to plan with description: ${planWithDescription.name} (${planWithDescription.id})`);
            plansToDelete.push(keepPlan.id);
            // Keep the one with description
            deletePlans.splice(deletePlans.indexOf(planWithDescription), 1);
          }
        }
        
        deletePlans.forEach(plan => {
          console.log(`  ❌ Deleting: ${plan.name} (${plan.id}) - ${plan.created_at} - Description: ${plan.description || 'None'}`);
          plansToDelete.push(plan.id);
        });
      }
    });

    if (plansToDelete.length === 0) {
      console.log('\n✅ No duplicates found! All plans are unique.');
      return;
    }

    console.log(`\n🗑️  Will delete ${plansToDelete.length} duplicate plans...`);
    
    // For now, just show what would be deleted
    console.log('\n📝 Manual cleanup required. Please run these SQL commands in Supabase SQL Editor:');
    console.log('\n-- Delete duplicate plans');
    plansToDelete.forEach(planId => {
      console.log(`DELETE FROM subscription_plans WHERE id = '${planId}';`);
    });
    
    console.log('\n✅ Cleanup script completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicatePlans();
