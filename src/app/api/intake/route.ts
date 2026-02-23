import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      company,
      role,
      service_type,
      description,
      budget,
      timeline,
      referral_source,
    } = body;

    // Validate required fields
    if (!name || !email || !service_type || !description || !budget) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Check for equity-only submissions
    if (budget === "equity_only") {
      return NextResponse.json(
        {
          equity_only: true,
          message:
            "Thank you for your interest in Girl Code. We are not currently accepting equity-only engagements. If your budget situation changes, we'd love to hear from you again.",
        },
        { status: 200 }
      );
    }

    // Insert into Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // If Supabase isn't configured yet, just log and return success
      console.log("Intake submission (Supabase not configured):", body);
      return NextResponse.json({
        success: true,
        message:
          "Thank you! We've received your information and will be in touch to schedule a discovery call.",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("intake_submissions").insert({
      name,
      email,
      company: company || null,
      role: role || null,
      service_type,
      description,
      budget,
      timeline: timeline || null,
      referral_source: referral_source || null,
      status: "new",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you! We've received your information and will be in touch to schedule a discovery call.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
