"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@api/ApiAuth";
import { getAdminProfile, updateAdminProfile, updateAdminPhoto } from "apis/admin-profile.api";
import { getAdminSettings, updateAdminSettings } from "apis/admin-settings.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import ReactSwitch from "react-switch";

function SettingRow({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-[#26282A] last:border-b-0">
      <div>
        <span className="textBody16 text-[#DFE1E3]">{label}</span>
        {sublabel && <p className="textBody14 text-[#868889] mt-0.5">{sublabel}</p>}
      </div>
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

function InlineInput({ value, onChange, placeholder, width = "200px" }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-1.5 focus:outline-none focus:border-[#B88934] transition"
      style={{ width }}
    />
  );
}

function SaveButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="textLabel14 bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] rounded-[8px] px-4 py-1.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function CancelButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
    >
      {children}
    </button>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // ── Profile state ──
  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [photoPreview, setPhotoPreview] = useState(null);

  // ── Platform state ──
  const [editingDiscord, setEditingDiscord] = useState(false);
  const [discordUrl, setDiscordUrl] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [editingMessage, setEditingMessage] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  // ── Profile query ──
  const { data: profileData } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: getAdminProfile,
    staleTime: 30_000,
  });
  const user = profileData?.data?.user;

  // ── Settings query ──
  const { data: settingsData } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: getAdminSettings,
  });
  const settings = settingsData?.data?.settings;

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setUsername(user.username || "");
      if (user.profilePhoto) {
        localStorage.setItem("profilePhoto", user.profilePhoto);
        window.dispatchEvent(new CustomEvent("app:profile-updated"));
      }
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setDiscordUrl(settings.discordInviteUrl || "");
      setMaintenanceMode(!!settings.maintenanceMode);
      setMaintenanceMessage(settings.maintenanceMessage || "");
    }
  }, [settings]);

  // ── Profile mutations ──
  const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) localStorage.setItem("username", fullName);
      window.dispatchEvent(new CustomEvent("app:profile-updated"));
      setEditingName(false);
      toast({ type: "success", title: "Profile updated", message: "Your name has been saved." });
    },
    onError: (err) => {
      toast({ type: "error", title: "Update failed", message: err?.response?.data?.message || "Something went wrong." });
    },
  });

  const { mutate: saveUsername, isPending: isSavingUsername } = useMutation({
    mutationFn: (newUsername) => updateAdminProfile({ username: newUsername }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      window.dispatchEvent(new CustomEvent("app:profile-updated"));
      setEditingUsername(false);
      toast({ type: "success", title: "Username updated", message: "Your username has been saved." });
    },
    onError: (err) => {
      toast({ type: "error", title: "Update failed", message: err?.response?.data?.message || "Something went wrong." });
    },
  });

  const { mutate: savePhoto, isPending: isSavingPhoto } = useMutation({
    mutationFn: updateAdminPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      setPhotoPreview(null);
      toast({ type: "success", title: "Photo updated", message: "Your profile photo has been saved." });
    },
    onError: (err) => {
      toast({ type: "error", title: "Upload failed", message: err?.response?.data?.message || "Something went wrong." });
    },
  });

  // ── Platform mutations ──
  const { mutate: saveSettings, isPending: isSavingSettings } = useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    },
    onError: (err) => {
      toast({ type: "error", title: "Update failed", message: err?.response?.data?.message || "Something went wrong." });
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    savePhoto(file);
  };

  const handleSaveDiscord = () => {
    saveSettings({ discordInviteUrl: discordUrl.trim() }, {
      onSuccess: () => {
        setEditingDiscord(false);
        toast({ type: "success", title: "Discord URL updated", message: "The invite link has been saved." });
      },
    });
  };

  const handleToggleMaintenance = (checked) => {
    setMaintenanceMode(checked);
    saveSettings({ maintenanceMode: checked }, {
      onSuccess: () => {
        toast({
          type: checked ? "warning" : "success",
          title: checked ? "Maintenance mode ON" : "Maintenance mode OFF",
          message: checked
            ? "Students are now blocked from the platform."
            : "Students can access the platform again.",
        });
      },
    });
  };

  const handleSaveMessage = () => {
    saveSettings({ maintenanceMessage: maintenanceMessage.trim() }, {
      onSuccess: () => {
        setEditingMessage(false);
        toast({ type: "success", title: "Message updated", message: "Maintenance message has been saved." });
      },
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayPhoto = photoPreview || user?.profilePhoto || localStorage.getItem("profilePhoto") || null;
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      <h1 className="textDisplay36 text-[#DFE1E3] mb-10">Settings</h1>

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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
            <OutlineButton onClick={() => fileInputRef.current?.click()} disabled={isSavingPhoto}>
              {isSavingPhoto ? "Uploading..." : "Update"}
            </OutlineButton>
          </SettingRow>

          {/* Full name */}
          <SettingRow label="Full name">
            {editingName ? (
              <div className="flex items-center gap-2">
                <InlineInput value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" width="120px" />
                <InlineInput value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" width="120px" />
                <SaveButton onClick={() => saveProfile({ firstName, lastName })} disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save"}
                </SaveButton>
                <CancelButton onClick={() => { setFirstName(user?.firstName || ""); setLastName(user?.lastName || ""); setEditingName(false); }} disabled={isSavingProfile}>
                  Cancel
                </CancelButton>
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
                <InlineInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" width="180px" />
                <SaveButton onClick={() => saveUsername(username)} disabled={isSavingUsername}>
                  {isSavingUsername ? "Saving..." : "Save"}
                </SaveButton>
                <CancelButton onClick={() => { setUsername(user?.username || ""); setEditingUsername(false); }} disabled={isSavingUsername}>
                  Cancel
                </CancelButton>
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
          <SettingRow label="Role">
            <span className="textLabel14 text-[#B88934] bg-[#AA7C3022] border border-[#37352B] rounded-full px-4 py-1 capitalize">
              {user?.role ?? "—"}
            </span>
          </SettingRow>
        </div>
      </div>

      {/* ── Platform section ── */}
      <div className="mb-10">
        <h2 className="textHeading20 text-[#DFE1E3] mb-1">Platform</h2>
        <p className="textBody14 text-[#ABADAF] mb-4">Global settings that affect all students.</p>
        <div className="border-t border-[#26282A]">

          {/* Discord URL */}
          <SettingRow label="Discord Invite URL" sublabel="Community link shown to students on the dashboard">
            {editingDiscord ? (
              <div className="flex items-center gap-2">
                <InlineInput
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.gg/..."
                  width="260px"
                />
                <SaveButton onClick={handleSaveDiscord} disabled={isSavingSettings}>
                  {isSavingSettings ? "Saving..." : "Save"}
                </SaveButton>
                <CancelButton onClick={() => { setDiscordUrl(settings?.discordInviteUrl || ""); setEditingDiscord(false); }} disabled={isSavingSettings}>
                  Cancel
                </CancelButton>
              </div>
            ) : (
              <>
                <span className="textBody14 text-[#ABADAF] max-w-[260px] truncate">
                  {settings?.discordInviteUrl || "Not set"}
                </span>
                <OutlineButton onClick={() => setEditingDiscord(true)}>Update</OutlineButton>
              </>
            )}
          </SettingRow>

          {/* Maintenance mode */}
          <SettingRow
            label="Maintenance Mode"
            sublabel="When enabled, students are blocked from accessing the platform"
          >
            <div className="flex items-center gap-3">
              {maintenanceMode && (
                <span className="textLabel12 px-2.5 py-1 rounded-full bg-[#3A1A1A] border border-[#5A2A2A] text-[#F87171]">
                  Active
                </span>
              )}
              <ReactSwitch
                checked={maintenanceMode}
                onChange={handleToggleMaintenance}
                onColor="#B88934"
                offColor="#313335"
                onHandleColor="#ffffff"
                offHandleColor="#ffffff"
                handleDiameter={18}
                uncheckedIcon={false}
                checkedIcon={false}
                height={24}
                width={44}
                activeBoxShadow="0 0 0 2px rgba(184,137,52,0.3)"
                disabled={isSavingSettings}
              />
            </div>
          </SettingRow>

          {/* Maintenance message — always visible so admin can pre-set it */}
          <SettingRow label="Maintenance Message" sublabel="Shown to students when maintenance mode is on">
            {editingMessage ? (
              <div className="flex items-center gap-2">
                <input
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="We'll be back soon..."
                  maxLength={300}
                  className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-1.5 focus:outline-none focus:border-[#B88934] transition w-[300px]"
                />
                <SaveButton onClick={handleSaveMessage} disabled={isSavingSettings}>
                  {isSavingSettings ? "Saving..." : "Save"}
                </SaveButton>
                <CancelButton onClick={() => { setMaintenanceMessage(settings?.maintenanceMessage || ""); setEditingMessage(false); }} disabled={isSavingSettings}>
                  Cancel
                </CancelButton>
              </div>
            ) : (
              <>
                <span className="textBody14 text-[#ABADAF] max-w-[300px] truncate">
                  {settings?.maintenanceMessage || "Not set"}
                </span>
                <OutlineButton onClick={() => setEditingMessage(true)}>Update</OutlineButton>
              </>
            )}
          </SettingRow>

        </div>
      </div>

      {/* Sign out */}
      <div className="flex justify-end border-t border-[#26282A] pt-6">
        <button onClick={handleLogout} className="textLabel16 text-[#ABADAF] underline underline-offset-2 hover:text-[#DFE1E3] transition duration-200">
          Sign Out
        </button>
      </div>
    </div>
  );
}
