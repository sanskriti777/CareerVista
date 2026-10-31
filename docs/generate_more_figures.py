import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

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
# 7. DFD LEVEL 2: JOB MATCHING (Figure 5.3)
# ==========================================
fig, ax = plt.subplots(figsize=(10, 5.0), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 5.0)
ax.axis('off')

ax.text(5, 4.7, "Figure 5.3: Level-2 Job Matching & Recommendation Transaction Flow",
        ha='center', va='center', fontsize=12.5, fontweight='bold', color='#0F172A')

# Steps
steps = [
    ("Candidate Profile\n(skills, preferredRole,\nlocation)", 0.5, 2.0, 1.8, 1.6, "#EFF6FF", "#2563EB"),
    ("4.1 Readiness Gate\nCheck if skills > 0\n& role non-empty", 2.6, 2.2, 1.6, 1.2, "#FEF3C7", "#D97706"),
    ("4.2 Skills Scoring\nSet Intersection\nMax 60 Points", 4.5, 3.1, 1.6, 1.1, "#F5F3FF", "#7C3AED"),
    ("4.3 Role Affinity\nToken Overlap\nMax 25 Points", 4.5, 1.8, 1.6, 1.1, "#EFF6FF", "#2563EB"),
    ("4.4 Location Match\nGeo / Remote\nMax 15 Points", 4.5, 0.5, 1.6, 1.1, "#ECFDF5", "#059669"),
    ("4.5 Aggregator\nSum (0-100 Pts)\nAssign Score Band", 6.5, 1.8, 1.6, 1.3, "#FCE7F3", "#DB2777"),
    ("Ranked Recommendations\nList with Matched &\nMissing Skills", 8.4, 1.8, 1.5, 1.4, "#F0FDF4", "#16A34A")
]

for title, sx, sy, sw, sh, bg, bc in steps:
    draw_rounded_rect(ax, sx, sy, sw, sh, bg, bc, 1.4, 0.04)
    lines = title.split('\n')
    ax.text(sx + sw/2, sy + sh - 0.25, lines[0], ha='center', va='center', fontsize=8.5, fontweight='bold', color=bc)
    ax.text(sx + sw/2, sy + (sh - 0.35)/2, '\n'.join(lines[1:]), ha='center', va='center', fontsize=7.5, color='#334155')

# Connecting arrows
ax.annotate("", xy=(2.6, 2.8), xytext=(2.3, 2.8), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.5))
ax.annotate("", xy=(4.5, 3.65), xytext=(4.2, 2.8), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.3))
ax.annotate("", xy=(4.5, 2.35), xytext=(4.2, 2.8), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.3))
ax.annotate("", xy=(4.5, 1.05), xytext=(4.2, 2.8), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.3))

ax.annotate("", xy=(6.5, 2.45), xytext=(6.1, 3.65), arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=1.3))
ax.annotate("", xy=(6.5, 2.45), xytext=(6.1, 2.35), arrowprops=dict(arrowstyle="->", color="#2563EB", lw=1.3))
ax.annotate("", xy=(6.5, 2.45), xytext=(6.1, 1.05), arrowprops=dict(arrowstyle="->", color="#059669", lw=1.3))

ax.annotate("", xy=(8.4, 2.45), xytext=(8.1, 2.45), arrowprops=dict(arrowstyle="->", color="#16A34A", lw=1.5))

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_dfd_level2_matching.png"), dpi=300)
plt.close(fig)

# ==========================================
# 8. UML USE-CASE DIAGRAM (Figure 5.4)
# ==========================================
fig, ax = plt.subplots(figsize=(9.5, 5.2), dpi=300)
ax.set_xlim(0, 9.5)
ax.set_ylim(0, 5.2)
ax.axis('off')

ax.text(4.75, 4.9, "Figure 5.4: CareerVista UML Use-Case Diagram",
        ha='center', va='center', fontsize=12.5, fontweight='bold', color='#0F172A')

# System Boundary
draw_rounded_rect(ax, 2.2, 0.3, 5.1, 4.3, "#F8FAFC", "#64748B", 1.8, 0.05)
ax.text(4.75, 4.35, "CAREERVISTA SYSTEM BOUNDARY", ha='center', va='center', fontsize=10, fontweight='bold', color='#475569')

# Candidate Actor
draw_rounded_rect(ax, 0.4, 1.8, 1.5, 1.6, "#EFF6FF", "#2563EB", 1.5, 0.06)
ax.text(1.15, 2.7, "CANDIDATE\nACTOR", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1D4ED8')
ax.text(1.15, 2.1, "(Job Seeker)", ha='center', va='center', fontsize=8, color='#64748B')

# Admin Actor
draw_rounded_rect(ax, 7.6, 1.8, 1.5, 1.6, "#F0FDF4", "#059669", 1.5, 0.06)
ax.text(8.35, 2.7, "ADMIN /\nEMPLOYER", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#047857')
ax.text(8.35, 2.1, "(Recruiter)", ha='center', va='center', fontsize=8, color='#64748B')

# Use case ovals
cases = [
    ("UC-01: Register & Login (JWT)", 3.8),
    ("UC-02: Manage Profile & Subdocuments", 3.25),
    ("UC-03: Search & Filter Jobs Catalog", 2.7),
    ("UC-04: Calculate Job Match Score", 2.15),
    ("UC-05: Submit Job Application", 1.6),
    ("UC-06: Bookmark / Saved Jobs", 1.05),
    ("UC-07: Track & Withdraw Applications", 0.5)
]

for name, y in cases:
    # draw oval
    oval = patches.Ellipse((4.75, y), 3.8, 0.45, facecolor="#FFFFFF", edgecolor="#7C3AED", linewidth=1.2)
    ax.add_patch(oval)
    ax.text(4.75, y, name, ha='center', va='center', fontsize=8, color='#334155', fontweight='bold')

    # line from Candidate
    ax.plot([1.9, 2.85], [2.6, y], color="#94A3B8", linestyle="--", linewidth=1.0)

# lines from Admin to specific cases
ax.plot([7.6, 6.65], [2.6, 3.8], color="#94A3B8", linestyle="--", linewidth=1.0)
ax.plot([7.6, 6.65], [2.6, 1.6], color="#94A3B8", linestyle="--", linewidth=1.0)

plt.tight_layout()
fig.savefig(os.path.join(out_dir, "fig_use_case.png"), dpi=300)
plt.close(fig)

print("Additional figures generated successfully.")
