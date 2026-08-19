import { Eye, Heart, HeartCrack, Zap } from "lucide-react"

/* ========== Icon ========== */
export function GroupTypeIcon({ type }) {
  if (type === "profile_view") {
    return <Eye className="h-5 w-5" aria-hidden="true" />;
  }

  if (type === "like_received") {
    return <Heart className="h-5 w-5" aria-hidden="true" />;
  }

  if (type === "unlike") {
    return <HeartCrack className="h-5 w-5" aria-hidden="true" />;
  }

  if (type === "match") {
    return <Zap className="h-5 w-5" aria-hidden="true" />;
  }

  return <Heart className="h-5 w-5" aria-hidden="true" />;
}