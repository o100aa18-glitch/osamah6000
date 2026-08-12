import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, serviceBookingRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type CreateBookingRequestInput = {
  reference: string;
  requestKey: string;
  serviceSummary: string;
  requestDescription: string;
  area: string;
  appointmentText: string;
  customerName: string;
  customerPhone: string;
};

export async function createOrGetBookingRequest(input: CreateBookingRequestInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الطلبات غير متاحة حالياً");

  const existing = await db.select().from(serviceBookingRequests)
    .where(eq(serviceBookingRequests.requestKey, input.requestKey)).limit(1);
  if (existing[0]) return existing[0];

  await db.insert(serviceBookingRequests).values(input);
  const created = await db.select().from(serviceBookingRequests)
    .where(eq(serviceBookingRequests.reference, input.reference)).limit(1);
  if (!created[0]) throw new Error("تعذر إنشاء سجل الطلب");
  return created[0];
}

export async function markBookingWhatsAppOpened(reference: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الطلبات غير متاحة حالياً");

  await db.update(serviceBookingRequests)
    .set({ status: "whatsapp_opened", whatsappOpenedAt: new Date() })
    .where(eq(serviceBookingRequests.reference, reference));
}
