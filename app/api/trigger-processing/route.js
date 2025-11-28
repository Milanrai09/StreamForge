import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecs = new ECSClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  try {
    const body = await req.json();

    // Handle AWS SNS structure
    if (body.Type === "SubscriptionConfirmation") {
      // Confirm SNS subscription (only happens once)
      const confirmUrl = body.SubscribeURL;
      console.log("Confirming SNS subscription:", confirmUrl);
      return Response.json({ message: "Subscription confirmation received" });
    }

    if (body.Type === "Notification") {
      // Extract event data from SNS notification
      const snsMessage = JSON.parse(body.Message);
      const record = snsMessage.Records[0];
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key);

      console.log("🎥 New video uploaded:", key);

      // Launch ECS task to process video
      const command = new RunTaskCommand({
        cluster: process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.VIDEO_TASK_DEFINITION, // your docker image task
        launchType: "FARGATE",
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [process.env.AWS_SUBNET_ID],
            assignPublicIp: "ENABLED",
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: process.env.VIDEO_CONTAINER_NAME,
              environment: [
                { name: "S3_BUCKET", value: bucket },
                { name: "S3_KEY", value: key },
                { name: "BACKEND_URL", value: process.env.BACKEND_URL },
              ],
            },
          ],
        },
      });

      const response = await ecs.send(command);
      console.log("🚀 ECS Task started:", response.tasks?.[0]?.taskArn);

      return Response.json({ message: "ECS task launched", taskArn: response.tasks?.[0]?.taskArn });
    }

    return Response.json({ message: "Invalid SNS message type" }, { status: 400 });
  } catch (err) {
    console.error("Error in trigger-processing:", err);
    return Response.json({ error: "Failed to trigger ECS" }, { status: 500 });
  }
}
