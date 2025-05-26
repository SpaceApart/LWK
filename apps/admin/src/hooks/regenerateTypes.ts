import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Hook to regenerate types when collections change
 * This should be added to Payload config
 */
export const regenerateTypesHook = async () => {
  try {
    console.log('🔄 Regenerating types...');
    
    // Generate Payload types
    await execAsync('npm run generate:types', {
      cwd: process.cwd()
    });
    
    // Sync dashboard types
    await execAsync('cd ../../packages/types && npm run sync:types');
    
    console.log('✅ Types regenerated successfully');
  } catch (error) {
    console.error('❌ Error regenerating types:', error);
  }
};

/**
 * Hook to be used in collection afterChange
 */
export const afterChangeRegenerateTypes = async ({ 
  collection,
  operation 
}: {
  collection: any;
  operation: 'create' | 'update' | 'delete';
}) => {
  // Only regenerate on schema changes, not on every document change
  // This would typically be triggered manually or via admin UI
  if (process.env.REGENERATE_TYPES_ON_CHANGE === 'true') {
    await regenerateTypesHook();
  }
};
