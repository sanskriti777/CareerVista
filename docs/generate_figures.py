import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Ensure docs/figures directory exists
out_dir = os.path.join(os.path.dirname(__file__), "figures")
os.makedirs(out_dir, exist_ok=True)

plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']

def draw_rounded_rect(ax, x, y, w, h, bg_color, border_color="#CBD5E1", lw=1.5, radius=0.03):
    box = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        facecolor=bg_color, edgecolor=border_color, linewidth=lw
    )
    ax.add_patch(box)
    return box

# ==========================================
# 1. SYSTEM ARCHITECTURE (Figure 4.1)
# ==========================================
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis('off')

# Title
ax.text(5, 6.2, "CareerVista: 3-Tier Distributed System Architecture",
        ha='center', va='center', fontsize=14, fontweight='bold', color='#0F172A')

# Presentation Tier Box
draw_rounded_rect(ax, 0.5, 3.8, 9, 2.0, "#F8FAFC", "#64748B", 1.5, 0.08)
ax.text(0.8, 5.55, "PRESENTATION TIER — React 19 Client SPA (Vite 8, React Router v7)",
        fontsize=11, fontweight='bold', color='#475569')

# Frontend Sub-boxes
f_boxes = [
    ("Views / Pages\n• Dashboard\n• Job Catalog\n• Profile / Strength\n• Applications\n• Analytics", 0.8, 4.0, 2.6),
    ("Context Providers\n• AuthContext\n• SavedJobsContext\n• ApplicationsContext\n• ThemeContext", 3.7, 4.0, 2.6),
    ("Client-Side Logic\n• matchingEngine.js\n• profileStrength.js\n• validation.js\n• Fetch API Client", 6.6, 4.0, 2.6),
]
for title, bx, by, bw in f_boxes:
    draw_rounded_rect(ax, bx, by, bw, 1.4, "#FFFFFF", "#7C3AED", 1.2, 0.05)
    ax.text(bx + 0.15, by + 1.25, title.split('\n')[0], fontsize=9.5, fontweight='bold', color='#7C3AED')
    ax.text(bx + 0.15, by + 0.6, '\n'.join(title.split('\n')[1:]), fontsize=8.5, color='#334155', va='center')

# Communication Arrow
ax.annotate("", xy=(5, 3.4), xytext=(5, 3.8),
            arrowprops=dict(arrowstyle="<->", color="#7C3AED", lw=2))
ax.text(5.15, 3.6, "HTTPS / JSON REST API (JWT Bearer Token in Headers)", fontsize=8.5, color='#6D28D9', fontweight='bold', va='center')

# Application Logic Tier Box
draw_rounded_rect(ax, 0.5, 1.6, 9, 1.7, "#F8FAFC", "#64748B", 1.5, 0.08)
ax.text(0.8, 3.05, "APPLICATION LOGIC TIER — Node.js & Express 5 REST API (Port 5000)",
        fontsize=11, fontweight='bold', color='#475569')

b_boxes = [
    ("Security & Gateways\n• CORS Configuration\n• Rate Limiters (IP)\n• authMiddleware.protect\n• uploadMiddleware", 0.8, 1.8, 2.6),
    ("REST Controllers\n• authController\n• loginController\n• userController\n• jobController\n• applicationController", 3.7, 1.8, 2.6),
    ("Services & Utilities\n• profileStrength.js\n• escapeRegex (NoSQL)\n• Multer Disk Engine\n• seedJobs.js Script", 6.6, 1.8, 2.6),
]
for title, bx, by, bw in b_boxes:
    draw_rounded_rect(ax, bx, by, bw, 1.15, "#FFFFFF", "#2563EB", 1.2, 0.05)
    ax.text(bx + 0.15, by + 1.0, title.split('\n')[0], fontsize=9.5, fontweight='bold', color='#2563EB')
    ax.text(bx + 0.15, by + 0.45, '\n'.join(title.split('\n')[1:]), fontsize=8.5, color='#334155', va='center')

# Communication Arrow to DB
ax.annotate("", xy=(5, 1.25), xytext=(5, 1.6),
            arrowprops=dict(arrowstyle="<->", color="#2563EB", lw=2))
ax.text(5.15, 1.42, "Mongoose 9 ODM / BSON Binary Protocol", fontsize=8.5, color='#1D4ED8', fontweight='bold', va='center')

# Data Persistence Tier Box
draw_rounded_rect(ax, 0.5, 0.15, 9, 1.05, "#F8FAFC", "#64748B", 1.5, 0.08)
ax.text(0.8, 0.95, "DATA PERSISTENCE TIER — MongoDB Atlas & File System Storage",
        fontsize=11, fontweight='bold', color='#475569')

db_boxes = [
    ("Users Collection\n(Profile, Subdocs)", 0.8, 0.3, 2.0),
    ("Jobs Collection\n(Text Index)", 3.1, 0.3, 1.9),
    ("Applications Collection\n(Unique: user+job)", 5.3, 0.3, 2.2),
    ("Avatar Storage\n(/uploads/avatars)", 7.8, 0.3, 1.7),
]
for title, bx, by, bw in db_boxes:
    draw_rounded_rect(ax, bx, by, bw, 0.55, "#FFFFFF", "#059669", 1.2, 0.05)
    ax.text(bx + bw/2, by + 0.28, title, fontsize=8, color='#047857', fontweight='bold', ha='center', va='center')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_architecture.png"), dpi=300)
plt.close(fig)

# ==========================================
# 2. DFD LEVEL 0 (Figure 5.1)
# ==========================================
fig, ax = plt.subplots(figsize=(9, 4.5), dpi=300)
ax.set_xlim(0, 9)
ax.set_ylim(0, 4.5)
ax.axis('off')

ax.text(4.5, 4.2, "Figure 5.1: CareerVista Level-0 Context Data Flow Diagram",
        ha='center', va='center', fontsize=13, fontweight='bold', color='#0F172A')

# Candidate Entity
draw_rounded_rect(ax, 0.5, 1.5, 2.0, 1.5, "#EFF6FF", "#3B82F6", 1.8, 0.06)
ax.text(1.5, 2.4, "CANDIDATE\n(Job Seeker)", ha='center', va='center', fontsize=11, fontweight='bold', color='#1D4ED8')
ax.text(1.5, 1.85, "Primary Actor", ha='center', va='center', fontsize=9, color='#64748B')

# Central System
circle = patches.Circle((4.5, 2.25), 1.25, facecolor="#F5F3FF", edgecolor="#7C3AED", linewidth=2.2)
ax.add_patch(circle)
ax.text(4.5, 2.45, "0.0\nCAREERVISTA\nPLATFORM", ha='center', va='center', fontsize=11, fontweight='bold', color='#6D28D9')
ax.text(4.5, 1.8, "Decoupled Web App", ha='center', va='center', fontsize=8.5, color='#7C3AED')

# Admin Entity
draw_rounded_rect(ax, 6.5, 1.5, 2.0, 1.5, "#F0FDF4", "#10B981", 1.8, 0.06)
ax.text(7.5, 2.4, "ADMIN / EMPLOYER", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#047857')
ax.text(7.5, 1.85, "System / Recruiter", ha='center', va='center', fontsize=9, color='#64748B')

# Arrows Candidate -> System
ax.annotate("", xy=(3.25, 2.6), xytext=(2.5, 2.6), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.8))
ax.text(2.87, 2.75, "Credentials, Profile Data,\nApplications, Saved Jobs", ha='center', va='bottom', fontsize=8, color='#1E40AF')

# Arrows System -> Candidate
ax.annotate("", xy=(2.5, 1.9), xytext=(3.25, 1.9), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.8))
ax.text(2.87, 1.75, "Match Scores, Profile Strength,\nJob Feeds, Status Updates", ha='center', va='top', fontsize=8, color='#6D28D9')

# Arrows Admin -> System
ax.annotate("", xy=(5.75, 2.6), xytext=(6.5, 2.6), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.8))
ax.text(6.12, 2.75, "Job Vacancy Postings,\nStatus Transitions", ha='center', va='bottom', fontsize=8, color='#047857')

# Arrows System -> Admin
ax.annotate("", xy=(6.5, 1.9), xytext=(5.75, 1.9), arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.8))
ax.text(6.12, 1.75, "Applicant Inquiries,\nPipeline Statistics", ha='center', va='top', fontsize=8, color='#475569')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_dfd_level0.png"), dpi=300)
plt.close(fig)

# ==========================================
# 3. DFD LEVEL 1 (Figure 5.2)
# ==========================================
fig, ax = plt.subplots(figsize=(10, 5.8), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 5.8)
ax.axis('off')

ax.text(5, 5.5, "Figure 5.2: Level-1 Subsystem Data Flow Diagram",
        ha='center', va='center', fontsize=13, fontweight='bold', color='#0F172A')

processes = [
    ("1.0 Authentication\n& Security", 1.0, 3.8, "#F5F3FF", "#7C3AED"),
    ("2.0 Profile &\nSubdoc Mgmt", 4.0, 3.8, "#EFF6FF", "#2563EB"),
    ("3.0 Job Catalog\n& Search", 7.0, 3.8, "#F0FDF4", "#059669"),
    ("4.0 Deterministic\nMatching Engine", 1.0, 1.4, "#FEF3C7", "#D97706"),
    ("5.0 Application\nTracking", 4.0, 1.4, "#FCE7F3", "#DB2777"),
    ("6.0 Market Demand\nAnalytics", 7.0, 1.4, "#ECFDF5", "#047857"),
]

for title, px, py, bg, bc in processes:
    draw_rounded_rect(ax, px, py, 2.0, 1.05, bg, bc, 1.6, 0.05)
    ax.text(px + 1.0, py + 0.52, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=bc)

# Data Stores
draw_rounded_rect(ax, 3.8, 2.7, 2.4, 0.55, "#F1F5F9", "#475569", 1.2, 0.02)
ax.text(5.0, 2.97, "D1: USERS Collection", ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

draw_rounded_rect(ax, 6.8, 2.7, 2.4, 0.55, "#F1F5F9", "#475569", 1.2, 0.02)
ax.text(8.2, 2.97, "D2: JOBS Collection", ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

draw_rounded_rect(ax, 3.8, 0.35, 2.4, 0.55, "#F1F5F9", "#475569", 1.2, 0.02)
ax.text(5.0, 0.62, "D3: APPLICATIONS Coll.", ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

draw_rounded_rect(ax, 0.8, 0.35, 2.4, 0.55, "#F1F5F9", "#475569", 1.2, 0.02)
ax.text(2.0, 0.62, "D4: SAVEDJOBS Coll.", ha='center', va='center', fontsize=9, fontweight='bold', color='#1E293B')

# Interconnecting arrows
ax.annotate("", xy=(3.0, 4.3), xytext=(4.0, 4.3), arrowprops=dict(arrowstyle="<->", color="#64748B", lw=1.4))
ax.annotate("", xy=(5.0, 3.8), xytext=(5.0, 3.25), arrowprops=dict(arrowstyle="<->", color="#2563EB", lw=1.4))
ax.annotate("", xy=(8.0, 3.8), xytext=(8.0, 3.25), arrowprops=dict(arrowstyle="<->", color="#059669", lw=1.4))
ax.annotate("", xy=(5.0, 1.4), xytext=(5.0, 0.9), arrowprops=dict(arrowstyle="<->", color="#DB2777", lw=1.4))
ax.annotate("", xy=(2.0, 1.4), xytext=(2.0, 0.9), arrowprops=dict(arrowstyle="<->", color="#D97706", lw=1.4))
ax.annotate("", xy=(7.0, 1.9), xytext=(6.0, 1.9), arrowprops=dict(arrowstyle="<-", color="#047857", lw=1.4))
ax.annotate("", xy=(3.0, 1.9), xytext=(4.0, 1.9), arrowprops=dict(arrowstyle="->", color="#D97706", lw=1.4))

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_dfd_level1.png"), dpi=300)
plt.close(fig)

# ==========================================
# 4. DATABASE ENTITY-RELATIONSHIP (Figure 5.5)
# ==========================================
fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.2)
ax.axis('off')

ax.text(5, 5.9, "Figure 5.5: CareerVista MongoDB Collections & Subdocument Data Model",
        ha='center', va='center', fontsize=13, fontweight='bold', color='#0F172A')

# User Entity
draw_rounded_rect(ax, 0.5, 1.5, 4.0, 4.0, "#FFFFFF", "#7C3AED", 2.0, 0.05)
ax.text(2.5, 5.25, "USER ENTITY (Collection: users)", ha='center', va='center', fontsize=11, fontweight='bold', color='#6D28D9')
user_fields = [
    "_id : ObjectId (Primary Key)",
    "name : String [required, 2-60]",
    "email : String [required, unique]",
    "password : String [bcrypt hash]",
    "role : Enum ['jobseeker','employer','admin']",
    "phone, location, headline : String",
    "preferredRole : String",
    "skills : [String] (Technical Competencies)",
    "resumeUrl : String (URL validated)",
    "profilePicture : String (relative path)",
    "isFresher : Boolean [default: false]",
    "--- Embedded Subdocuments ---",
    "education : [educationSchema] (max 5)",
    "experience : [experienceSchema] (max 10)",
    "projects : [projectSchema] (max 6)"
]
for idx, field in enumerate(user_fields):
    y_pos = 4.95 - (idx * 0.23)
    c = '#7C3AED' if idx == 11 else '#334155'
    b = True if idx in [0, 11] else False
    ax.text(0.7, y_pos, field, fontsize=8.2, color=c, fontweight='bold' if b else 'normal')

# Job Entity
draw_rounded_rect(ax, 5.5, 2.2, 4.0, 3.3, "#FFFFFF", "#059669", 2.0, 0.05)
ax.text(7.5, 5.25, "JOB ENTITY (Collection: jobs)", ha='center', va='center', fontsize=11, fontweight='bold', color='#047857')
job_fields = [
    "_id : ObjectId (Primary Key)",
    "title : String [required, text-indexed]",
    "company : String [required, text-indexed]",
    "location : String [required, text-indexed]",
    "type : Enum ['Full Time','Internship',...]",
    "salary : String, salaryNumeric : Number",
    "experience : String [required]",
    "skills : [String] [text-indexed]",
    "description : String [required]",
    "responsibilities, requirements : [String]",
    "postedBy : ObjectId (Ref -> User)",
    "isActive : Boolean [default: true]"
]
for idx, field in enumerate(job_fields):
    y_pos = 4.95 - (idx * 0.23)
    b = True if idx == 0 else False
    ax.text(5.7, y_pos, field, fontsize=8.2, color='#334155', fontweight='bold' if b else 'normal')

# Application Junction Entity
draw_rounded_rect(ax, 5.5, 0.2, 4.0, 1.7, "#FFFFFF", "#2563EB", 1.8, 0.05)
ax.text(7.5, 1.65, "APPLICATION ENTITY (applications)", ha='center', va='center', fontsize=10, fontweight='bold', color='#1D4ED8')
app_fields = [
    "_id : ObjectId (Primary Key)",
    "user : ObjectId (Ref -> User, Indexed)",
    "job : ObjectId (Ref -> Job, Indexed)",
    "fullName, email, resumeName, notes : String",
    "status : Enum ['Submitted','Under Review',...]",
    "** Compound Unique Index: {user:1, job:1} **"
]
for idx, field in enumerate(app_fields):
    y_pos = 1.45 - (idx * 0.22)
    c = '#DC2626' if idx == 5 else '#334155'
    b = True if idx in [0, 5] else False
    ax.text(5.7, y_pos, field, fontsize=8.0, color=c, fontweight='bold' if b else 'normal')

# SavedJob Junction Entity
draw_rounded_rect(ax, 0.5, 0.2, 4.0, 1.0, "#FFFFFF", "#D97706", 1.8, 0.05)
ax.text(2.5, 0.95, "SAVEDJOB ENTITY (savedjobs)", ha='center', va='center', fontsize=10, fontweight='bold', color='#B45309')
save_fields = [
    "_id : ObjectId (PK), createdAt : Date",
    "user : ObjectId (Ref -> User), job : ObjectId (Ref -> Job)",
    "** Compound Unique Index: {user:1, job:1} **"
]
for idx, field in enumerate(save_fields):
    y_pos = 0.75 - (idx * 0.22)
    c = '#DC2626' if idx == 2 else '#334155'
    ax.text(0.7, y_pos, field, fontsize=8.0, color=c, fontweight='bold' if idx == 2 else 'normal')

# Relational lines
ax.annotate("", xy=(5.5, 1.0), xytext=(4.5, 2.0), arrowprops=dict(arrowstyle="<->", color="#2563EB", lw=1.6))
ax.text(4.8, 1.5, "1:N", fontsize=9, fontweight='bold', color='#2563EB')

ax.annotate("", xy=(7.5, 2.2), xytext=(7.5, 1.9), arrowprops=dict(arrowstyle="<->", color="#059669", lw=1.6))
ax.text(7.65, 2.05, "1:N", fontsize=9, fontweight='bold', color='#059669')

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_er_diagram.png"), dpi=300)
plt.close(fig)

# ==========================================
# 5. MATCHING ENGINE BREAKDOWN (Figure 8.1)
# ==========================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)

# Donut Chart for Weights
weights = [60, 25, 15]
labels = ['Technical Skills Match\n(60 Points / 60%)', 'Preferred Role Alignment\n(25 Points / 25%)', 'Location Compatibility\n(15 Points / 15%)']
colors = ['#7C3AED', '#2563EB', '#10B981']
explode = (0.04, 0.02, 0.02)

wedges, texts, autotexts = ax1.pie(
    weights, labels=labels, autopct='%1.0f%%', startangle=140,
    colors=colors, explode=explode, pctdistance=0.75,
    textprops=dict(color="#0F172A", fontsize=8.5, fontweight='bold')
)
for at in autotexts:
    at.set_color('white')
    at.set_fontsize(11)

centre_circle = plt.Circle((0, 0), 0.55, fc='white')
ax1.add_artist(centre_circle)
ax1.text(0, 0, "100 PTS\nMAX", ha='center', va='center', fontsize=12, fontweight='bold', color='#1E293B')
ax1.set_title("Scoring Dimension Weights", fontsize=11, fontweight='bold', color='#0F172A', pad=10)

# Score Bands Bar Chart
bands = ['Strong Match\n(80–100%)', 'Good Match\n(60–79%)', 'Partial Match\n(40–59%)', 'Low Match\n(0–39%)']
band_min = [80, 60, 40, 0]
band_widths = [20, 20, 20, 40]
band_colors = ['#16A34A', '#2563EB', '#D97706', '#64748B']

y_pos = range(len(bands))
ax2.barh(y_pos, band_widths, left=band_min, color=band_colors, height=0.55, edgecolor='#CBD5E1', lw=1.2)
ax2.set_yticks(y_pos)
ax2.set_yticklabels(bands, fontsize=8.5, fontweight='bold', color='#1E293B')
ax2.set_xlabel("Score Range (0 to 100 Points)", fontsize=9, fontweight='bold', color='#475569')
ax2.set_xlim(0, 100)
ax2.set_title("Compatibility Classification Tiers", fontsize=11, fontweight='bold', color='#0F172A', pad=10)

for i, (b_min, b_w) in enumerate(zip(band_min, band_widths)):
    ax2.text(b_min + b_w/2, i, f"{b_min}-{b_min+b_w}%", ha='center', va='center', color='white', fontweight='bold', fontsize=8.5)

plt.suptitle("Figure 8.1: CareerVista Explainable Job Matching Engine Architecture", fontsize=12, fontweight='bold', y=0.98)
plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_matching_weights.png"), dpi=300)
plt.close(fig)

# ==========================================
# 6. PROFILE STRENGTH MATRIX (Figure 8.2)
# ==========================================
fig, ax = plt.subplots(figsize=(10, 4.2), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 4.2)
ax.axis('off')

ax.text(5, 3.9, "Figure 8.2: Profile Strength Rubric & Progression Milestones",
        ha='center', va='center', fontsize=12, fontweight='bold', color='#0F172A')

categories = [
    ("Identity & Contact\n(Max 20 Pts)", "Name: 5\nEmail: 5\nPhone: 5\nLocation: 5", 0.5, 1.8, 2.1, "#EFF6FF", "#2563EB"),
    ("Positioning\n(Max 20 Pts)", "Headline: 5\nTarget Role: 10\nBio (>=30): 5", 2.8, 1.8, 2.1, "#F5F3FF", "#7C3AED"),
    ("Technical Validation\n(Max 35 Pts)", "Skills: 15 (1-5+)\nProject: 10\nResume URL: 10", 5.1, 1.8, 2.1, "#ECFDF5", "#059669"),
    ("History & Background\n(Max 25 Pts)", "Education: 15\nExperience: 10\n(or isFresher)", 7.4, 1.8, 2.1, "#FFFBEB", "#D97706"),
]

for title, details, cx, cy, cw, bg, bc in categories:
    draw_rounded_rect(ax, cx, cy, cw, 1.7, bg, bc, 1.5, 0.05)
    ax.text(cx + cw/2, cy + 1.45, title.split('\n')[0], ha='center', va='center', fontsize=9.5, fontweight='bold', color=bc)
    ax.text(cx + cw/2, cy + 1.25, title.split('\n')[1], ha='center', va='center', fontsize=8, color='#475569')
    ax.text(cx + 0.15, cy + 0.55, details, fontsize=8.5, color='#334155', va='center')

# Milestone Bar at the bottom
draw_rounded_rect(ax, 0.5, 0.3, 9.0, 1.1, "#F8FAFC", "#64748B", 1.4, 0.04)
ax.text(0.7, 1.1, "PROGRESSION MILESTONE TIERS (0 - 100 Scale):", fontsize=9, fontweight='bold', color='#1E293B')

milestones = [
    ("Getting Started\n(0–24 Pts)", 0.7, 0.45, 1.6, "#64748B"),
    ("Basic Profile\n(25–49 Pts)", 2.5, 0.45, 1.6, "#D97706"),
    ("Intermediate\n(50–74 Pts)", 4.3, 0.45, 1.6, "#2563EB"),
    ("Advanced\n(75–89 Pts)", 6.1, 0.45, 1.6, "#7C3AED"),
    ("All-Star Profile\n(90–100 Pts)", 7.9, 0.45, 1.6, "#16A34A"),
]
for title, mx, my, mw, mc in milestones:
    draw_rounded_rect(ax, mx, my, mw, 0.55, "#FFFFFF", mc, 1.5, 0.04)
    ax.text(mx + mw/2, my + 0.27, title, ha='center', va='center', fontsize=7.8, fontweight='bold', color=mc)

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_profile_strength.png"), dpi=300)
plt.close(fig)

print("Successfully generated all academic technical diagrams in docs/figures/")
