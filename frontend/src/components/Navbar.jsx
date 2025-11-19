
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import { API_BASE_URL } from "../config";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    if (!user?.uid) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${user.uid}`);
      if (!res.ok) {
        setProfile(null);
        return;
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Navbar loadProfile:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    loadProfile();
   
  }, [user]);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-3 bg-slate-900 text-white">
        <div className="font-semibold text-lg">My App</div>
        <div className="flex items-center gap-4">
          <button
            onClick={logout}
            className="hidden sm:inline text-sm border border-white/40 px-3 py-1 rounded-lg hover:bg-white/10"
          >
            Logout
          </button>

          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium overflow-hidden"
            title={user?.email}
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              (user?.email?.[0] || "P").toUpperCase()
            )}
          </button>
        </div>
      </nav>

      {open && (
        <ProfileModal
          onClose={() => {
            setOpen(false);
            loadProfile(); 
          }}
          onProfileChange={(p) => {
            
            setProfile(p);
          }}
        />
      )}
    </>
  );
}
