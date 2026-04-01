"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@api/ApiAuth";
import { getStudentProfile, updateStudentProfile, updateStudentPhoto } from "apis/student-profile.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

function SettingRow({ label, children }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-[#26282A] last:border-b-0">
      <span className="textBody16 text-[#DFE1E3]">{label}</span>
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
}

function OutlineButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="textLabel14 text-[#DFE1E3] border border-[#484942] rounded-[8px] px-4 py-1.5 hover:border-[#B88934] hover:text-[#B88934] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["studentProfile"],
    queryFn: getStudentProfile,
  });

  const user = data?.data?.user;

  // Sync form fields when profile loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) localStorage.setItem("username", fullName);
      window.dispatchEvent(new CustomEvent("app:profile-updated"));
      setEditingName(false);
      toast({ type: "success", title: "Profile updated", message: "Your name has been saved." });
    },
    onError: (err) => {
      toast({
        type: "error",
        title: "Update failed",
        message: err?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const { mutate: savePhoto, isPending: isSavingPhoto } = useMutation({
    mutationFn: updateStudentPhoto,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      setPhotoPreview(null);
      toast({ type: "success", title: "Photo updated", message: "Your profile photo has been saved." });
    },
    onError: (err) => {
      toast({
        type: "error",
        title: "Upload failed",
        message: err?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    savePhoto(file);
  };

  const handleNameSave = () => {
    saveProfile({ firstName, lastName });
  };

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEditingName(false);
  };

  const { mutate: saveUsername, isPending: isSavingUsername } = useMutation({
    mutationFn: (newUsername) => updateStudentProfile({ username: newUsername }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      localStorage.setItem("username", `${firstName} ${lastName}`.trim() || username);
      window.dispatchEvent(new CustomEvent("app:profile-updated"));
      setEditingUsername(false);
      toast({ type: "success", title: "Username updated", message: "Your username has been saved." });
    },
    onError: (err) => {
      toast({
        type: "error",
        title: "Update failed",
        message: err?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayPhoto = photoPreview || user?.profilePhoto || null;
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      <h1 className="textDisplay36 text-[#DFE1E3] mb-10">Settings</h1>

      {isLoading ? (
        <Loader isLoading={true} />
      ) : (
        <>
          {/* ── Profile section ── */}
          <div className="mb-10">
            <h2 className="textHeading20 text-[#DFE1E3] mb-1">Profile</h2>
            <p className="textBody14 text-[#ABADAF] mb-4">This information identifies your account.</p>
            <div className="border-t border-[#26282A]">

              {/* Photo */}
              <SettingRow label="Photo">
                <div className="w-10 h-10 rounded-full bg-[#2E2D26] border border-[#484942] flex items-center justify-center overflow-hidden">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <OutlineButton onClick={() => fileInputRef.current?.click()} disabled={isSavingPhoto}>
                  {isSavingPhoto ? "Uploading..." : "Update"}
                </OutlineButton>
              </SettingRow>

              {/* Full name */}
              <SettingRow label="Full name">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-1.5 w-[120px] focus:outline-none focus:border-[#B88934] transition"
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-1.5 w-[120px] focus:outline-none focus:border-[#B88934] transition"
                    />
                    <button
                      onClick={handleNameSave}
                      disabled={isSavingProfile}
                      className="textLabel14 bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] rounded-[8px] px-4 py-1.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingProfile ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSavingProfile}
                      className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="textBody16 text-[#ABADAF]">{fullName}</span>
                    <OutlineButton onClick={() => setEditingName(true)}>Update</OutlineButton>
                  </>
                )}
              </SettingRow>

              {/* Username */}
              <SettingRow label="Username">
                {editingUsername ? (
                  <div className="flex items-center gap-2">
                    <span className="textBody16 text-[#ABADAF]">@</span>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-1.5 w-[180px] focus:outline-none focus:border-[#B88934] transition"
                    />
                    <button
                      onClick={() => saveUsername(username)}
                      disabled={isSavingUsername}
                      className="textLabel14 bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] rounded-[8px] px-4 py-1.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingUsername ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setUsername(user?.username || ""); setEditingUsername(false); }}
                      disabled={isSavingUsername}
                      className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="textBody16 text-[#ABADAF]">@{user?.username}</span>
                    <OutlineButton onClick={() => setEditingUsername(true)}>Update</OutlineButton>
                  </>
                )}
              </SettingRow>

              {/* Email — read only */}
              <SettingRow label="Email address">
                <span className="textBody16 text-[#ABADAF]">{user?.email}</span>
              </SettingRow>

            </div>
          </div>

          {/* ── Account section ── */}
          <div className="mb-10">
            <h2 className="textHeading20 text-[#DFE1E3] mb-1">Account</h2>
            <p className="textBody14 text-[#ABADAF] mb-4">Manage your account settings.</p>
            <div className="border-t border-[#26282A]">
              <SettingRow label="Account type">
                <span className="textLabel14 text-[#B88934] bg-[#AA7C3022] border border-[#37352B] rounded-full px-4 py-1">
                  {user?.status === "active" ? "Authenticated" : user?.status ?? "—"}
                </span>
              </SettingRow>
            </div>
          </div>

          {/* Sign out */}
          <div className="flex justify-end border-t border-[#26282A] pt-6">
            <button
              onClick={handleLogout}
              className="textLabel16 text-[#ABADAF] underline underline-offset-2 hover:text-[#DFE1E3] transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
