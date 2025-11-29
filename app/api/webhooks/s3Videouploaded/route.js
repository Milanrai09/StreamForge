export async function POST(req) {
  try {
    const body = await req.json();

    // ⭐ 1. SNS Confirmation Handling
    if (body.Type === "SubscriptionConfirmation") {
      console.log("📩 SNS Subscription Confirmation Received");

      const subscribeURL = body.SubscribeURL;
      console.log("➡️ Confirming SNS subscription:", subscribeURL);

      // Confirm subscription
      await fetch(subscribeURL);

      return Response.json({ ok: true, message: "Subscription confirmed" });
    }

    // ⭐ 2. SNS Notification Handling (S3 event is inside Message)
    if (body.Type === "Notification") {
      const message = JSON.parse(body.Message);
      const record = message.Records?.[0];

      if (!record) {
        return Response.json({ error: "Invalid S3 event format" }, { status: 400 });
      }

      const bucket = record.s3.bucket.name;
      const key = record.s3.object.key;
      const region = "ap-south-1";

      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

      console.log("🎉 S3 Upload Event Received");
      console.log("Bucket:", bucket);
      console.log("Key:", key);
      console.log("File URL:", fileUrl);

      // ❗ Continue processing here

      return Response.json({ ok: true });
    }

    return Response.json({ message: "Unhandled SNS Message Type" }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
