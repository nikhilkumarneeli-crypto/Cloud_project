import fs from 'fs';
import path from 'path';
import { 
  CloudFormationClient, 
  CreateStackCommand, 
  DescribeStacksCommand, 
  DescribeStackEventsCommand,
  StackStatus 
} from '@aws-sdk/client-cloudformation';

const REGION = process.env.AWS_REGION || 'us-east-1';
const STACK_NAME = 'CanopyServerlessStack';
const LAB_ROLE_ARN = 'arn:aws:iam::218862656675:role/LabRole';

async function deployStack() {
  const cfClient = new CloudFormationClient({ region: REGION });
  const templatePath = path.join(__dirname, '../cdk.out/CanopyServerlessStack.template.json');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Synthesized template not found at ${templatePath}. Run 'npx cdk synth' first.`);
  }

  const templateBody = fs.readFileSync(templatePath, 'utf8');

  console.log(`\n🚀 Initiating deployment of ${STACK_NAME} in ${REGION}...`);
  console.log(`🛡️  CloudFormation Execution Role: ${LAB_ROLE_ARN}`);

  // Check if stack already exists
  let stackExists = false;
  try {
    const describeRes = await cfClient.send(new DescribeStacksCommand({ StackName: STACK_NAME }));
    stackExists = describeRes.Stacks && describeRes.Stacks.length > 0;
  } catch {
    stackExists = false;
  }

  if (stackExists) {
    console.log(`ℹ️ Stack ${STACK_NAME} already exists. Skipping create.`);
  } else {
    console.log(`📦 Creating CloudFormation stack ${STACK_NAME}...`);
    await cfClient.send(
      new CreateStackCommand({
        StackName: STACK_NAME,
        TemplateBody: templateBody,
        RoleARN: LAB_ROLE_ARN,
        Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_AUTO_EXPAND'],
        Tags: [
          { Key: 'Project', Value: 'CanopyEcommerce' },
          { Key: 'Environment', Value: 'LearnerLab' }
        ]
      })
    );
  }

  // Monitor deployment until terminal state
  console.log(`⏳ Monitoring CloudFormation stack events...`);
  const seenEventIds = new Set<string>();

  while (true) {
    await new Promise((r) => setTimeout(r, 5000));

    try {
      const describeRes = await cfClient.send(new DescribeStacksCommand({ StackName: STACK_NAME }));
      const stack = describeRes.Stacks?.[0];
      const status = stack?.StackStatus;

      // Fetch recent events
      const eventsRes = await cfClient.send(new DescribeStackEventsCommand({ StackName: STACK_NAME }));
      const events = (eventsRes.StackEvents || []).reverse();

      for (const ev of events) {
        if (!seenEventIds.has(ev.EventId!)) {
          seenEventIds.add(ev.EventId!);
          const resType = ev.ResourceType || 'Resource';
          const logId = ev.LogicalResourceId || '';
          const resStatus = ev.ResourceStatus || '';
          const reason = ev.ResourceStatusReason ? ` - ${ev.ResourceStatusReason}` : '';
          console.log(`  [${new Date(ev.Timestamp!).toLocaleTimeString()}] ${logId} (${resType}): ${resStatus}${reason}`);
        }
      }

      if (status === StackStatus.CREATE_COMPLETE || status === StackStatus.UPDATE_COMPLETE) {
        console.log(`\n✅ Stack deployment SUCCESSFUL: ${status}`);
        console.log('\n--- CloudFormation Stack Outputs ---');

        const outputs: Record<string, string> = {};
        for (const out of stack?.Outputs || []) {
          outputs[out.OutputKey!] = out.OutputValue!;
          console.log(`  • ${out.OutputKey}: ${out.OutputValue}`);
        }

        // Write outputs to frontend/.env.production and frontend/.env.local
        const envContent = [
          `# Live AWS Academy Learner Lab Configuration`,
          `VITE_API_URL=${outputs.ApiEndpoint || ''}/api`,
          `VITE_COGNITO_USER_POOL_ID=${outputs.UserPoolId || ''}`,
          `VITE_COGNITO_CLIENT_ID=${outputs.UserPoolClientId || ''}`,
          `VITE_AWS_REGION=${REGION}`,
          `VITE_DYNAMODB_TABLE=${outputs.DynamoDbTableName || 'CanopyEcommerceTable'}`
        ].join('\n');

        const frontendEnvPath = path.join(__dirname, '../../frontend/.env.production');
        const frontendLocalEnvPath = path.join(__dirname, '../../frontend/.env.local');

        fs.writeFileSync(frontendEnvPath, envContent);
        fs.writeFileSync(frontendLocalEnvPath, envContent);
        console.log(`\n📝 Successfully wrote live cloud config to frontend/.env.production and frontend/.env.local`);

        return outputs;
      }

      if (
        status === StackStatus.CREATE_FAILED ||
        status === StackStatus.ROLLBACK_COMPLETE ||
        status === StackStatus.ROLLBACK_FAILED
      ) {
        throw new Error(`CloudFormation deployment failed with status: ${status}`);
      }
    } catch (err: any) {
      if (err.message.includes('failed with status')) {
        throw err;
      }
      console.log(`  Waiting for CloudFormation status... (${err.message})`);
    }
  }
}

deployStack().catch((err) => {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
});
