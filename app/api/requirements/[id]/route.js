import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Requirement from "@/models/Requirement";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid requirement ID format." },
        { status: 400 }
      );
    }

    await connectDB();
    const requirement = await Requirement.findById(id).lean();

    if (!requirement) {
      return NextResponse.json(
        { message: "Requirement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(requirement);
  } catch (error) {
    console.error("Error retrieving requirement:", error);
    return NextResponse.json(
      { message: error.message || "Failed to load requirement details." },
      { status: 500 }
    );
  }
}
