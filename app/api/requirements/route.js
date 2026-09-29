import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Requirement from "@/models/Requirement";

export async function GET(request) {
  try {
    await connectDB();

    const category = request.nextUrl.searchParams.get("category");
    const query = category && category !== "all" ? { category } : {};

    const requirements = await Requirement.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(requirements);
  } catch (error) {
    console.error("Failed to fetch requirements:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch requirements" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      eventName,
      eventType,
      dateType = "single",
      startDate,
      endDate,
      location,
      venue,
      category,
      details = {},
      contactName,
      contactEmail,
      contactPhone,
    } = body;

    // Basic required field validations
    if (!eventName || !eventType || !startDate || !location || !category) {
      return NextResponse.json(
        { message: "Please fill in all required event details." },
        { status: 400 }
      );
    }

    if (!["planner", "performer", "crew"].includes(category)) {
      return NextResponse.json(
        { message: "Invalid requirement category selected." },
        { status: 400 }
      );
    }

    if (dateType === "range") {
      if (!endDate) {
        return NextResponse.json(
          { message: "End date is required for a multi-day event." },
          { status: 400 }
        );
      }
      if (new Date(endDate) < new Date(startDate)) {
        return NextResponse.json(
          { message: "End date cannot be prior to start date." },
          { status: 400 }
        );
      }
    }

    if (!contactName || !contactEmail) {
      return NextResponse.json(
        { message: "Contact name and a valid email are required." },
        { status: 400 }
      );
    }

    const payload = {
      eventName,
      eventType,
      dateType,
      startDate: new Date(startDate),
      endDate: dateType === "range" && endDate ? new Date(endDate) : null,
      location,
      venue,
      category,
      contactName,
      contactEmail,
      contactPhone,
    };

    if (category === "planner") payload.plannerDetails = details;
    if (category === "performer") payload.performerDetails = details;
    if (category === "crew") payload.crewDetails = details;

    const requirement = await Requirement.create(payload);
    return NextResponse.json(requirement, { status: 201 });
  } catch (error) {
    console.error("Failed to create requirement:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create requirement" },
      { status: 500 }
    );
  }
}
