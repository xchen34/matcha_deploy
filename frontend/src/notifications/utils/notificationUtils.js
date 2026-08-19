// Create sets for each notification mode to track unique actors
export function createEmptyModeSets() {
  return {
    views: new Set(),
    likes: new Set(),
    matches: new Set(),
  };
}

// Check if any of the mode sets have at least one user for attention badge display
export function hasAnyModeAttention(modeSets) {
  return (
    modeSets.views.size > 0 ||
    modeSets.likes.size > 0 ||
    modeSets.matches.size > 0
  );
}

// Map notification type to its corresponding mode for insights tracking
export function mapTypeToMode(type) {
  if (type === "profile_view") return "views";
  if (type === "like_received") return "likes";
  if (type === "match") return "matches";

  return null;
}

// Extract and validate actor user ID from notification payload
export function getActorUserId(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;

  return String(parsed);
}

// Get the latest notification per actor and type, optionally filtering for unread only
export function getLatestPerActorAndType(items, unreadOnly = false) {
  const latestByActorAndType = new Map();

  for (const item of sortByNewest(items)) {
    if (unreadOnly && item.is_read) continue;

    const actorUserId = getActorUserId(item.actor_user_id);
    if (!actorUserId) continue;
    
    const key = `${actorUserId}:${item.type}`;
    if (!latestByActorAndType.has(key)) {
      latestByActorAndType.set(key, item);
    }
  }

  return Array.from(latestByActorAndType.values());
}

// Derive sets of unique actor user IDs for each mode based on the latest unread notifications
export function deriveAttentionFromNotifications(items) {
  const finalUnreadItems = getLatestPerActorAndType(items, true);
  const result = createEmptyModeSets();

  for (const item of finalUnreadItems) {
    const mode = mapTypeToMode(item.type);
    const actorUserId = getActorUserId(item.actor_user_id);
    if (!mode || !actorUserId) {
      continue;
    }

    result[mode].add(actorUserId);
  }

  return result;
}

// Sort notifications by newest first, using created_at and id as tie-breaker
export function sortByNewest(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a?.created_at || 0).getTime();
    const bTime = new Date(b?.created_at || 0).getTime();
    
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    
    if (bTime !== aTime) return bTime - aTime;

    const aId = Number(a?.id || 0);
    const bId = Number(b?.id || 0);

    return bId - aId;
  });
}

/*========== Accent ========== */
export function getGroupAccentClass(type) {
  if (type === "profile_view") {
    return "bg-blue-100 text-blue-700";
  }

  if (type === "like_received") {
    return "bg-pink-200 text-pink-700";
  }

  if (type === "unlike") {
    return "bg-slate-200 text-slate-700";
  }

  if (type === "match") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

/*========== Border ========== */
export function getGroupBorderClass(type) {
  if (type === "profile_view") {
    return "border-blue-200";
  }
  if (type === "like_received") {
    return "border-pink-200";
  }
  if (type === "unlike") {
    return "border-gray-200";
  }
  if (type === "match") {
    return "border-red-200";
  }

  return "border-slate-200";
}