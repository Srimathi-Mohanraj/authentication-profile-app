
import { useEffect, useState,  } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { API_BASE_URL } from "../config";

export default function ProfileModal({ onClose, onProfileChange }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!user?.uid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${user.uid}`);
      console.log("GET profile status:", res.status);
      if (res.status === 404) {
        setProfile(null);
        setForm({ name: "", mobile: "", gender: "", avatarUrl: "" });
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        console.error("GET profile error:", data);
        setError(data.message || "Failed to load profile");
        return;
      }
      const data = await res.json();
      setProfile(data);
      setForm({
        name: data.name || "",
        mobile: data.mobile || "",
        gender: data.gender || "",
        avatarUrl: data.avatarUrl || "",
      });
    } catch (err) {
      console.error("GET profile failed:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

  }, [user]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);        
      setSaving(true);           
      const url = await uploadToCloudinary(file);

      setForm((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Image upload failed");
      alert("Image upload failed — check console");
    } finally {
      setUploading(false);
      setSaving(false);          
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

     if (uploading) {
    alert("Please wait until the image upload finishes.");
    return;
  }

    setSaving(true);
    setError("");

    try {
      const body = { ...form };
      let res;

      if (!profile?._id) {
        // CREATE
        body.firebaseUid = user.uid;
        res = await fetch(`${API_BASE_URL}/api/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        // UPDATE
        res = await fetch(`${API_BASE_URL}/api/profile/${profile._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      console.log("SAVE profile status:", res.status);
      const data = await res.json();
      console.log("SAVE profile response:", data);

      if (!res.ok) {
        setError(data.message || "Failed to save profile");
        alert("Profile save failed: " + (data.message || ""));
        return;
      }
      setProfile(data);
      setForm({
        name: data.name || "",
        mobile: data.mobile || "",
        gender: data.gender || "",
        avatarUrl: data.avatarUrl || "",
      });


      if (typeof onProfileChange === "function") onProfileChange(data);

      alert("Profile saved successfully ✅");
    } catch (err) {
      console.error("SAVE profile failed:", err);
      setError("Failed to save profile");
      alert("Profile save failed — see console");
    } finally {
      setSaving(false);

      setTimeout(fetchProfile, 300);
    }
  };

  const handleDelete = async () => {
    if (!profile?._id) return;
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${profile._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Delete failed: " + (data.message || ""));
        return;
      }
      setProfile(null);
      setForm({ name: "", mobile: "", gender: "", avatarUrl: "" });
      if (typeof onProfileChange === "function") onProfileChange(null);
      alert("Profile deleted");
    } catch (err) {
      console.error("DELETE failed:", err);
      alert("Delete failed — see console");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">Profile</h2>

        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <label className="text-sm">
                <span className="block mb-1 font-medium">
                  Profile photo (Cloudinary)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile Number
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
                disabled={!profile?._id || saving}
              >
                Delete Profile
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm border px-3 py-1 rounded-lg"
                >
                  Logout
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : saving ? "Saving..." : profile ? "Update" : "Create"}
                </button>

              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
