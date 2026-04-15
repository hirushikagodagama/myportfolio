import DOMPurify from "dompurify";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { api } from "../../api/client";
import AdminSection from "../../components/admin/AdminSection";
import ImageUploader from "../../components/admin/ImageUploader";
import ProjectForm from "../../components/admin/ProjectForm";
import StatCard from "../../components/admin/StatCard";
import { useAuth } from "../../context/AuthContext";

const emptyProfile = {
  name: "",
  title: "",
  intro: "",
  bio: "",
  email: "",
  location: "",
  profileImage: "",
  aboutHtml: "",
};

const emptyCategory = { name: "", items: "", order: 0 };
const emptyLink = { label: "", url: "", icon: "link", order: 0 };
const PUBLIC_SYNC_KEY = "portfolio_content_updated_at";

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [overview, setOverview] = useState({
    projectsCount: 0,
    skillsCount: 0,
    linksCount: 0,
    completionScore: 0,
  });
  const [profile, setProfile] = useState(emptyProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);
  const [projectBeingEdited, setProjectBeingEdited] = useState(null);
  const [projectFormVersion, setProjectFormVersion] = useState(0);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [linkForm, setLinkForm] = useState(emptyLink);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("success");

  const loadDashboard = async () => {
    const [{ data: overviewData }, { data: contentData }] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/content"),
    ]);

    setOverview(overviewData);
    setProfile(contentData.profile || emptyProfile);
    setProjects(contentData.projects || []);
    setSkills(contentData.skills || []);
    setLinks(contentData.links || []);
  };

  useEffect(() => {
    loadDashboard().finally(() => setIsLoading(false));
  }, []);

  const notifyPublicRefresh = () => {
    localStorage.setItem(PUBLIC_SYNC_KEY, String(Date.now()));
  };

  const setFlashMessage = (text, tone = "success") => {
    setMessage(text);
    setMessageTone(tone);
    setTimeout(() => setMessage(""), 2500);
  };

  const refresh = async (successMessage) => {
    await loadDashboard();
    notifyPublicRefresh();
    setFlashMessage(successMessage, "success");
  };

  const withFeedback = async (action, successMessage) => {
    try {
      await action();
      await refresh(successMessage);
    } catch (error) {
      setFlashMessage(error.response?.data?.message || "Something went wrong while saving.", "error");
    }
  };

  const resetProjectEditor = () => {
    setProjectBeingEdited(null);
    setProjectFormVersion((value) => value + 1);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    await withFeedback(async () => {
      await api.put("/admin/profile", profile);
    }, "Profile updated");
  };

  const saveAbout = async () => {
    await withFeedback(async () => {
      await api.put("/admin/about", { aboutHtml: profile.aboutHtml });
    }, "About section updated");
  };

  const saveProject = async (payload) => {
    await withFeedback(async () => {
      if (projectBeingEdited?._id) {
        await api.put(`/admin/projects/${projectBeingEdited._id}`, payload);
      } else {
        await api.post("/admin/projects", payload);
      }
      resetProjectEditor();
    }, projectBeingEdited?._id ? "Project updated" : "Project added");
  };

  const removeProject = async (id) => {
    await withFeedback(async () => {
      await api.delete(`/admin/projects/${id}`);
      if (projectBeingEdited?._id === id) {
        resetProjectEditor();
      }
    }, "Project deleted");
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const payload = {
      ...categoryForm,
      order: Number(categoryForm.order) || 0,
    };

    await withFeedback(async () => {
      if (editingCategoryId) {
        await api.put(`/admin/skills/${editingCategoryId}`, payload);
        setEditingCategoryId(null);
      } else {
        await api.post("/admin/skills", payload);
      }

      setCategoryForm(emptyCategory);
    }, "Skills updated");
  };

  const editCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name,
      items: category.items.join(", "),
      order: category.order,
    });
  };

  const removeCategory = async (id) => {
    await withFeedback(async () => {
      await api.delete(`/admin/skills/${id}`);
      if (editingCategoryId === id) {
        setEditingCategoryId(null);
        setCategoryForm(emptyCategory);
      }
    }, "Skill category deleted");
  };

  const saveLink = async (event) => {
    event.preventDefault();
    const payload = {
      ...linkForm,
      order: Number(linkForm.order) || 0,
    };

    await withFeedback(async () => {
      if (editingLinkId) {
        await api.put(`/admin/links/${editingLinkId}`, payload);
        setEditingLinkId(null);
      } else {
        await api.post("/admin/links", payload);
      }

      setLinkForm(emptyLink);
    }, "Links updated");
  };

  const editLink = (link) => {
    setEditingLinkId(link._id);
    setLinkForm({
      label: link.label,
      url: link.url,
      icon: link.icon,
      order: link.order,
    });
  };

  const removeLink = async (id) => {
    await withFeedback(async () => {
      await api.delete(`/admin/links/${id}`);
      if (editingLinkId === id) {
        setEditingLinkId(null);
        setLinkForm(emptyLink);
      }
    }, "Link deleted");
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Admin Dashboard</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">Portfolio Content Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted sm:inline-flex">
              {user?.email}
            </span>
            <a href="/" className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-ink">
              View site
            </a>
            <button
              onClick={logout}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              messageTone === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Projects" value={overview.projectsCount} />
          <StatCard label="Skill Groups" value={overview.skillsCount} tone="bg-sand" />
          <StatCard label="Social Links" value={overview.linksCount} tone="bg-white" />
          <StatCard label="Completion" value={`${overview.completionScore}%`} tone="bg-accent/60" />
        </section>

        <AdminSection
          title="Profile Management"
          description="Update the hero section, contact details, and profile image used across the public website."
        >
          <form onSubmit={saveProfile} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">Name</span>
                <input
                  value={profile.name || ""}
                  onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-canvas"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">Title</span>
                <input
                  value={profile.title || ""}
                  onChange={(event) => setProfile((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-canvas"
                />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ink">Short intro</span>
              <textarea
                rows={3}
                value={profile.intro || ""}
                onChange={(event) => setProfile((current) => ({ ...current, intro: event.target.value }))}
                className="w-full rounded-3xl border-line bg-canvas"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ink">Bio</span>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
                className="w-full rounded-3xl border-line bg-canvas"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">Email</span>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-canvas"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink">Location</span>
                <input
                  value={profile.location || ""}
                  onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-canvas"
                />
              </label>
            </div>
            <ImageUploader
              value={profile.profileImage}
              onChange={(url) => setProfile((current) => ({ ...current, profileImage: url }))}
              label="Profile image"
              helperText="Choose a portrait from your device. The preview updates immediately before you save the profile."
            />
            <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Save profile
            </button>
          </form>
        </AdminSection>

        <AdminSection
          title="About Section Editor"
          description="Rich text editor for the About Me section. The preview below reflects the public website rendering."
        >
          <div className="space-y-5">
            <ReactQuill
              theme="snow"
              value={profile.aboutHtml || ""}
              onChange={(value) => setProfile((current) => ({ ...current, aboutHtml: value }))}
            />
            <div className="rounded-[1.5rem] border border-line bg-canvas p-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-muted">Preview</p>
              <div
                className="prose prose-slate max-w-none prose-p:text-muted"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(profile.aboutHtml || ""),
                }}
              />
            </div>
            <button onClick={saveAbout} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Save about section
            </button>
          </div>
        </AdminSection>

        <AdminSection
          title="Project Management"
          description="Create, update, remove, and reorder project cards. Each project can now store up to five photos."
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4 rounded-[1.75rem] bg-canvas p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">Project editor</h3>
                <button
                  type="button"
                  onClick={resetProjectEditor}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink"
                >
                  <RefreshCcw size={15} />
                  {projectBeingEdited ? "Start new project" : "Clear form"}
                </button>
              </div>
              <ProjectForm
                key={`${projectBeingEdited?._id || "new"}-${projectFormVersion}`}
                initialValue={projectBeingEdited}
                onSubmit={saveProject}
                onCancel={resetProjectEditor}
              />
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-5 md:flex-row"
                >
                  <div className="h-28 w-full overflow-hidden rounded-2xl bg-sand md:w-44">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-ink">{project.title}</h3>
                          <span className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                            {project.images?.length || 0} photos
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted">{project.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setProjectBeingEdited(project)}
                          className="rounded-full border border-line p-3 text-ink"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProject(project._id)}
                          className="rounded-full border border-red-200 p-3 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.images?.length > 1 ? (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {project.images.slice(0, 5).map((image, index) => (
                          <img
                            key={`${project._id}-${index}`}
                            src={image}
                            alt={`${project.title} ${index + 1}`}
                            className="h-16 w-16 flex-none rounded-xl object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </AdminSection>

        <div className="grid gap-8 xl:grid-cols-2">
          <AdminSection
            title="Skills Management"
            description="Organize skills into editable categories that render as grouped tags on the public site."
          >
            <form onSubmit={saveCategory} className="space-y-4 rounded-[1.75rem] bg-canvas p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">Category name</span>
                  <input
                    value={categoryForm.name}
                    onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-2xl border-line bg-white"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">Display order</span>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(event) => setCategoryForm((current) => ({ ...current, order: event.target.value }))}
                    className="w-full rounded-2xl border-line bg-white"
                  />
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-ink">Skills</span>
                <input
                  value={categoryForm.items}
                  onChange={(event) => setCategoryForm((current) => ({ ...current, items: event.target.value }))}
                  placeholder="React, Express, MongoDB"
                  className="w-full rounded-2xl border-line bg-white"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                  {editingCategoryId ? "Update category" : "Add category"}
                </button>
                {editingCategoryId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCategoryForm(emptyCategory);
                    }}
                    className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
            <div className="mt-5 space-y-3">
              {skills.map((category) => (
                <div key={category._id} className="rounded-[1.5rem] border border-line bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{category.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{category.items.join(", ")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editCategory(category)}
                        className="rounded-full border border-line p-3 text-ink"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCategory(category._id)}
                        className="rounded-full border border-red-200 p-3 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection
            title="Links Management"
            description="Manage social links and contact destinations displayed in the website footer and contact area."
          >
            <form onSubmit={saveLink} className="space-y-4 rounded-[1.75rem] bg-canvas p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">Label</span>
                  <input
                    value={linkForm.label}
                    onChange={(event) => setLinkForm((current) => ({ ...current, label: event.target.value }))}
                    className="w-full rounded-2xl border-line bg-white"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-ink">Icon key</span>
                  <input
                    value={linkForm.icon}
                    onChange={(event) => setLinkForm((current) => ({ ...current, icon: event.target.value }))}
                    placeholder="github, linkedin, instagram, link"
                    className="w-full rounded-2xl border-line bg-white"
                  />
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-ink">URL</span>
                <input
                  type="url"
                  value={linkForm.url}
                  onChange={(event) => setLinkForm((current) => ({ ...current, url: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-white"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-ink">Display order</span>
                <input
                  type="number"
                  value={linkForm.order}
                  onChange={(event) => setLinkForm((current) => ({ ...current, order: event.target.value }))}
                  className="w-full rounded-2xl border-line bg-white"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
                  {editingLinkId ? "Update link" : "Add link"}
                </button>
                {editingLinkId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLinkId(null);
                      setLinkForm(emptyLink);
                    }}
                    className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
            <div className="mt-5 space-y-3">
              {links.map((link) => (
                <div key={link._id} className="rounded-[1.5rem] border border-line bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{link.label}</h3>
                      <p className="mt-1 text-sm text-muted">{link.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editLink(link)}
                        className="rounded-full border border-line p-3 text-ink"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLink(link._id)}
                        className="rounded-full border border-red-200 p-3 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>
        </div>
      </main>
    </div>
  );
}
