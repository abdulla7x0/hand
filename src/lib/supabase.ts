import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Export actual client if variables are present, otherwise a fully functional mock client.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Type cast so code compiles

// Mock Storage and DB implementation for local preview
class LocalStorageMockDB {
  private getStorage(key: string): any[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(`jyotish_ai_${key}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(key: string, data: any[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`jyotish_ai_${key}`, JSON.stringify(data));
    } catch {}
  }

  async getScans(userId: string = "demo-user") {
    return this.getStorage("palm_scans").filter(s => s.user_id === userId);
  }

  async saveScan(scan: any) {
    const scans = this.getStorage("palm_scans");
    const newScan = {
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      user_id: "demo-user",
      ...scan,
    };
    scans.unshift(newScan);
    this.setStorage("palm_scans", scans);
    return newScan;
  }

  async getChatHistory(userId: string = "demo-user") {
    const chats = this.getStorage("chat_history");
    if (chats.length === 0) {
      // Seed initial greeting
      const seed = [
        {
          id: "seed-1",
          role: "assistant",
          content: "Namaste! I am your AI Astrologer. I can read your palm lines, explain your mounts, or tell you about your daily horoscope. What would you like to know today?",
          created_at: new Date(Date.now() - 60000).toISOString(),
          user_id: userId,
        }
      ];
      this.setStorage("chat_history", seed);
      return seed;
    }
    return chats.filter(c => c.user_id === userId);
  }

  async saveChatMessage(message: { role: string; content: string }, userId: string = "demo-user") {
    const chats = this.getStorage("chat_history");
    const newMessage = {
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      user_id: userId,
      ...message,
    };
    chats.push(newMessage);
    this.setStorage("chat_history", chats);
    return newMessage;
  }

  async clearChat(userId: string = "demo-user") {
    this.setStorage("chat_history", []);
    return this.getChatHistory(userId);
  }

  async getSubscription(userId: string = "demo-user") {
    const sub = localStorage.getItem(`jyotish_ai_subscription_${userId}`);
    if (!sub) {
      const defaultSub = {
        user_id: userId,
        status: "free",
        plan: "Free Tier",
        expires_at: null,
      };
      localStorage.setItem(`jyotish_ai_subscription_${userId}`, JSON.stringify(defaultSub));
      return defaultSub;
    }
    return JSON.parse(sub);
  }

  async upgradeSubscription(userId: string = "demo-user", tier: "premium" | "free" = "premium") {
    const upgraded = {
      user_id: userId,
      status: tier,
      plan: tier === "premium" ? "Premium Access" : "Free Tier",
      expires_at: tier === "premium" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    };
    localStorage.setItem(`jyotish_ai_subscription_${userId}`, JSON.stringify(upgraded));
    return upgraded;
  }
}

export const localDB = new LocalStorageMockDB();
