import { useEffect, useState } from "react";
import { getProfile, updateProfile, type User } from "../../lib/userApi";

function EditableField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setEditing(false);
    if (tempValue !== value) {
      setSaving(true);
      await onSave(tempValue);
      setSaving(false);
    }
  };

  return (
    <div className="group">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {editing ? (
        <input
          className="border rounded-md p-1 w-full mt-1"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          autoFocus
        />
      ) : (
        <div
          className="flex items-center justify-between cursor-pointer mt-1"
          onClick={() => setEditing(true)}
        >
          <span className="text-gray-800">{saving ? "Saving..." : value}</span>
          <span className="text-indigo-500 hidden group-hover:inline">✏️</span>
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setUser(await getProfile());
        setLoading(false);
      } catch (err) {
        setError("Error fetching user profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFieldSave = async (field: keyof User, newValue: string) => {
    if (!user) return;
    try {
      const updatedUserData = {
        ...user,
        [field]: newValue,
      };
      const updatedUser = await updateProfile(updatedUserData);
      setUser(updatedUser);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile field. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          {loading && (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && user && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>{" "}
                {/* Placeholder for profile picture */}
                <div className="space-y-2">
                  <EditableField
                    label="Username"
                    value={user.username}
                    onSave={(newVal) => handleFieldSave("username", newVal)}
                  />
                  <EditableField
                    label="Email"
                    value={user.email}
                    onSave={(newVal) => handleFieldSave("email", newVal)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Profile Details
                  </h3>
                  <EditableField
                    label="Role"
                    value={user.role}
                    onSave={(newVal) => handleFieldSave("role", newVal)}
                  />
                  <p className="text-gray-600">
                    Account Created:{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Last Updated:{" "}
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Account Status: {user.isEnabled ? "Active" : "Inactive"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Settings
                  </h3>
                  <button
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                    onClick={() =>
                      alert("Profile settings page (add functionality here)")
                    }
                  >
                    Edit Profile
                  </button>
                  <button
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none mt-2"
                    onClick={() => alert("Change password functionality")}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
