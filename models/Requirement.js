import mongoose from "mongoose";

const PlannerSchema = new mongoose.Schema(
  {
    servicesNeeded: [{ type: String, trim: true }],
    guestCount: { type: Number, default: 0 },
    planningStage: { type: String, trim: true },
    budget: { type: Number, default: 0 },
    preferredDate: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const PerformerSchema = new mongoose.Schema(
  {
    performerType: { type: String, trim: true },
    genre: { type: String, trim: true },
    performersRequired: { type: Number, default: 1 },
    durationHours: { type: Number, default: 1 },
    equipmentProvided: [{ type: String, trim: true }],
    budget: { type: Number, default: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const CrewSchema = new mongoose.Schema(
  {
    crewRoles: [{ type: String, trim: true }],
    crewSize: { type: Number, default: 1 },
    shiftTiming: { type: String, trim: true },
    experienceRequired: { type: String, trim: true },
    dailyRate: { type: Number, default: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const RequirementSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    dateType: { type: String, enum: ["single", "range"], default: "single" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true, trim: true },
    venue: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["planner", "performer", "crew"],
    },
    plannerDetails: PlannerSchema,
    performerDetails: PerformerSchema,
    crewDetails: CrewSchema,
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Requirement ||
  mongoose.model("Requirement", RequirementSchema);
