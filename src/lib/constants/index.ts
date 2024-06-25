export type Category = (typeof CATEGORIES_MAP)[number]["value"];
export const CATEGORIES_MAP = [
  { key: "Autoimmune Disease", value: "autoimmune-disease" },
  { key: "Cancer", value: "cancer" },
  { key: "Cardiovascular Health", value: "cardiovascular-health" },
  { key: "Brain Health", value: "brain-health" },
  { key: "Diabetes & Blood Sugar", value: "diabetes-blood-sugar" },
  { key: "Ear, Nose & Throat", value: "ear-nose-throat" },
  { key: "Energy & Fatigue", value: "energy-fatigue" },
  { key: "Eyes & Vision", value: "eyes-vision" },
  { key: "Fat Loss", value: "fat-loss" },
  { key: "Gut Health", value: "gut-health" },
  { key: "Healthy Aging & Longevity", value: "healthy-aging-longevity" },
  {
    key: "Immunity & Infectious Disease",
    value: "immunity-infectious-disease",
  },
  { key: "Joints & Bones", value: "joints-bones" },
  { key: "Kidney & Urinary Health", value: "kidney-urinary-health" },
  { key: "Liver Health", value: "liver-health" },
  { key: "Lungs & Breathing", value: "lungs-breathing" },
  { key: "Men’s Health", value: "mens-health" },
  { key: "Mental Health", value: "mental-health" },
  { key: "Pain & Inflammation", value: "pain-inflammation" },
  { key: "Muscle Gain & Exercise", value: "muscle-gain-exercise" },
  { key: "Oral Health", value: "oral-health" },
  { key: "Other", value: "other" },
  { key: "Pain", value: "pain" },
  { key: "Pregnancy & Children", value: "pregnancy-children" },
  { key: "Skin, Hair & Nails", value: "skin-hair-nails" },
  { key: "Sleep", value: "sleep" },
  { key: "Women’s Health", value: "womens-health" },
] as const;
export const CATEGORIES = CATEGORIES_MAP.map(({ value }) => value);

export type Tag = (typeof TAGS_MAP)[number]["value"];
export const TAGS_MAP = [
  { key: "Thyroid", value: "thyroid" },
  { key: "Liver", value: "liver" },
  { key: "Heart", value: "heart" },
  { key: "Brain", value: "brain" },
  { key: "Lungs", value: "lungs" },
  { key: "Kidneys", value: "kidneys" },
  { key: "Stomach", value: "stomach" },
  { key: "Pancreas", value: "pancreas" },
  { key: "Intestines", value: "intestines" },
  { key: "Bladder", value: "bladder" },
  { key: "Skin", value: "skin" },
  { key: "Muscles", value: "muscles" },
  { key: "Bones", value: "bones" },
  { key: "Joints", value: "joints" },
  { key: "Blood", value: "blood" },
  { key: "Lymph", value: "lymph" },
  { key: "Immune System", value: "immune-system" },
  { key: "Hormones", value: "hormones" },
  { key: "Metabolism", value: "metabolism" },
  { key: "Energy", value: "energy" },
  { key: "Sleep", value: "sleep" },
  { key: "Mood", value: "mood" },
  { key: "Memory", value: "memory" },
  { key: "Cognition", value: "cognition" },
  { key: "Vision", value: "vision" },
  { key: "Hearing", value: "hearing" },
  { key: "Taste", value: "taste" },
  { key: "Smell", value: "smell" },
  { key: "Speech", value: "speech" },
  { key: "Balance", value: "balance" },
  { key: "Pain", value: "pain" },
  { key: "Inflammation", value: "inflammation" },
  { key: "Infection", value: "infection" },
  { key: "Allergy", value: "allergy" },
  { key: "Autoimmunity", value: "autoimmunity" },
  { key: "Cancer", value: "cancer" },
] as const;
export const TAGS = TAGS_MAP.map(({ value }) => value);

export type Role = (typeof ROLES)[number];
export const ROLES = [
  "admin",
  "moderator",
  "guest",
  "awaiting-approval",
] as const;
// Admin - all access
// Moderator - can create, update and delete their own articles
// Guest - can only read public/authed users-only articles/the ones they were given access to
// Awaiting approval - can only read public articles

export type Privacy = (typeof PRIVACY)[number];
export const PRIVACY = [
  "public", // everyone can see
  "restricted", // only authed users can see
  "private", // only the admin, mod, users with access can see
] as const;

export type Language = (typeof LANGUAGES_MAP)[number]["value"];
export const LANGUAGES_MAP = [
  { key: "Polski", value: "pl" },
  { key: "English", value: "en" },
] as const;
export const LANGUAGES = LANGUAGES_MAP.map(({ value }) => value);

export type Locale = (typeof LOCALES)[number];
export const LOCALES = ["en", "pl"] as const;
