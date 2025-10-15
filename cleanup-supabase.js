// Direct Supabase Cleanup using JavaScript Client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://aammkgdhfmkukpqkdduj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbW1rZ2RoZm1rdWtwcWtkZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzgxNTIsImV4cCI6MjA3NTAxNDE1Mn0.V-9vkcctLQ8flXrdc50c3ghIHhxnNGsKl6HfvXHzlY8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupPlans() {
  try {
    console.log('🔍 Fetching plans...');
    
    const { data: plans, error: fetchError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('wine_club_id', '550e8400-e29b-41d4-a716-446655440000')
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📊 Found ${plans.length} plans`);

    // Group by name and bottle_count
    const planGroups = {};
    plans.forEach(plan => {
      const key = `${plan.name}-${plan.bottle_count}`;
      if (!planGroups[key]) {
        planGroups[key] = [];
      }
      planGroups[key].push(plan);
    });

    const plansToDelete = [];
    Object.values(planGroups).forEach((group) => {
      if (group.length > 1) {
        // Sort by created_at desc, keep the first (newest)
        group.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const keepPlan = group[0];
        const deletePlans = group.slice(1);
        
        // If newest has no description, try to find one with description
        if (!keepPlan.description) {
          const planWithDescription = group.find(p => p.description);
          if (planWithDescription) {
            plansToDelete.push(keepPlan.id);
            deletePlans.splice(deletePlans.indexOf(planWithDescription), 1);
          }
        }
        
        plansToDelete.push(...deletePlans.map(p => p.id));
      }
    });

    if (plansToDelete.length === 0) {
      console.log('✅ No duplicates found');
      return;
    }

    console.log(`🗑️  Deleting ${plansToDelete.length} duplicate plans...`);

    const { error: deleteError } = await supabase
      .from('subscription_plans')
      .delete()
      .in('id', plansToDelete);

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Cleanup completed successfully!');

    // Verify
    const { data: remainingPlans } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('wine_club_id', '550e8400-e29b-41d4-a716-446655440000');

    console.log(`📊 Now have ${remainingPlans.length} plans:`);
    remainingPlans.forEach(plan => {
      console.log(`  - ${plan.name} (${plan.bottle_count} bottles) - ${plan.description || 'No description'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cleanupPlans();
