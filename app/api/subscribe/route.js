import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get Mailchimp credentials from environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.error("Mailchimp credentials not configured");
      return NextResponse.json(
        { message: "Subscription service is not configured" },
        { status: 500 }
      );
    }

    // Extract server from API key (format: key-us18)
    const server = apiKey.split("-")[1];
    if (!server) {
      return NextResponse.json(
        { message: "Invalid Mailchimp API key format" },
        { status: 500 }
      );
    }

    // Mailchimp API endpoint
    const mailchimpUrl = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    // Mailchimp uses Basic Auth: base64(apikey:apikey)
    const authString = Buffer.from(`apikey:${apiKey}`).toString("base64");

    // Subscribe user to Mailchimp
    const response = await fetch(mailchimpUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed", // or "pending" for double opt-in
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Mailchimp errors
      if (data.title === "Member Exists") {
        return NextResponse.json(
          { message: "This email is already subscribed!" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { message: data.detail || "Failed to subscribe. Please try again." },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed! Thank you for joining us." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error subscribing to Mailchimp:", error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}

