import os
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Ensure docs/figures exists
out_dir = os.path.join(os.path.dirname(__file__), "figures")
os.makedirs(out_dir, exist_ok=True)

eval_file = r"C:/Users/sansk/.gemini/antigravity-ide/brain/775c146f-70fc-4e7c-b639-8e8e7133553e/scratch/eval_results.json"
with open(eval_file, "r", encoding="utf-8") as f:
    eval_data = json.load(f)

plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']

# ==============================================================================
# FIGURE 1: SCALABILITY & EXECUTION LATENCY BENCHMARK
# ==============================================================================
bench = eval_data["scalabilityBenchmarks"]
sizes = [b["catalogSize"] for b in bench]
means = [b["meanMs"] for b in bench]
std_devs = [b["stdDevMs"] for b in bench]
throughputs = [b["throughputJobsPerSec"] for b in bench]

fig, ax1 = plt.subplots(figsize=(8.5, 4.8), dpi=300)

color1 = '#6D28D9'
color2 = '#059669'

ax1.set_xlabel('Number of Evaluated Job Postings (Catalog Size $N$)', fontsize=11, fontweight='bold', labelpad=8)
ax1.set_ylabel('Execution Latency (Milliseconds, ms)', color=color1, fontsize=11, fontweight='bold', labelpad=8)
line1 = ax1.errorbar(sizes, means, yerr=std_devs, fmt='-o', color=color1, ecolor='#C4B5FD', elinewidth=2, capsize=4, linewidth=2.2, label='Evaluation Latency (ms)')
ax1.tick_params(axis='y', labelcolor=color1)
ax1.set_ylim(-0.5, 20)
ax1.grid(True, linestyle='--', alpha=0.5, color='#CBD5E1')

# Add 60 FPS UI frame deadline annotation (16.67 ms)
ax1.axhline(y=16.67, color='#DC2626', linestyle=':', linewidth=1.8, label='60 FPS Frame Boundary (16.67 ms)')
ax1.text(200, 17.1, '60 FPS Interactive UI Deadline (16.67 ms)', color='#DC2626', fontsize=9, fontweight='bold')

# Second axis for throughput
ax2 = ax1.twinx()
ax2.set_ylabel('Throughput (Evaluations / Second)', color=color2, fontsize=11, fontweight='bold', labelpad=8)
line2 = ax2.plot(sizes, throughputs, '-s', color=color2, linewidth=1.8, linestyle='--', label='Throughput (Jobs/sec)')
ax2.tick_params(axis='y', labelcolor=color2)
ax2.set_ylim(0, 450000)

# Value annotations on key points
for i in [2, 4, 5, 7]: # 100, 500, 1000, 5000
    ax1.annotate(f"{means[i]:.2f} ms\n({sizes[i]} jobs)",
                 (sizes[i], means[i]),
                 textcoords="offset points",
                 xytext=(-15, 12),
                 ha='center',
                 fontsize=8.5,
                 fontweight='bold',
                 bbox=dict(boxstyle='round,pad=0.25', fc='#EDE9FE', ec=color1, lw=1))

plt.title('CareerVista Matching Engine Computational Latency & Scalability Curve', fontsize=12, fontweight='bold', pad=14, color='#0F172A')

lines = [line1, line2[0]]
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left', frameon=True, facecolor='#FFFFFF', framealpha=0.9, edgecolor='#CBD5E1')

plt.tight_layout()
out_path1 = os.path.join(out_dir, "fig_eval_latency.png")
plt.savefig(out_path1, dpi=300)
plt.close()
print(f"Generated: {out_path1}")

# ==============================================================================
# FIGURE 2: COMPONENT SCORE BREAKDOWN ACROSS TEST SCENARIOS
# ==============================================================================
scenarios = eval_data["matchingScenarios"]
sc_ids = [s["testId"] for s in scenarios]
skills_scores = [s["skillsScore"] for s in scenarios]
role_scores = [s["roleScore"] for s in scenarios]
loc_scores = [s["locationScore"] for s in scenarios]
total_scores = [s["totalScore"] for s in scenarios]

fig, ax = plt.subplots(figsize=(10, 5.2), dpi=300)

x = np.arange(len(sc_ids))
width = 0.55

p1 = ax.bar(x, skills_scores, width, label='Technical Skills (Max 60 pts)', color='#7C3AED', edgecolor='#5B21B6', alpha=0.9)
p2 = ax.bar(x, role_scores, width, bottom=skills_scores, label='Role Alignment (Max 25 pts)', color='#2563EB', edgecolor='#1D4ED8', alpha=0.9)
bottom_loc = np.array(skills_scores) + np.array(role_scores)
p3 = ax.bar(x, loc_scores, width, bottom=bottom_loc, label='Location Fit (Max 15 pts)', color='#059669', edgecolor='#047857', alpha=0.9)

# Labels above bars
for i, tot in enumerate(total_scores):
    tier = scenarios[i]["label"].replace(" Match", "").replace("Profile ", "")
    ax.text(i, tot + 2.5, f"{tot}%\n({tier})", ha='center', va='bottom', fontsize=8, fontweight='bold', color='#1E293B')

ax.set_ylabel('Calculated Compatibility Score (%)', fontsize=11, fontweight='bold', labelpad=8)
ax.set_xlabel('Algorithmic Verification Test Scenarios', fontsize=11, fontweight='bold', labelpad=8)
ax.set_title('Empirical Compatibility Score Decompositions across Verification Test Suite', fontsize=12, fontweight='bold', pad=14, color='#0F172A')
ax.set_xticks(x)
ax.set_xticklabels(sc_ids, fontsize=9.5, fontweight='bold')
ax.set_ylim(0, 118)
ax.grid(axis='y', linestyle='--', alpha=0.5, color='#CBD5E1')
ax.legend(loc='upper right', frameon=True, facecolor='#FFFFFF', framealpha=0.95, edgecolor='#CBD5E1', fontsize=9.5)

# Scenario summary table text below
scenario_descriptions = [
    "TC-01: Perfect Fit (P1/J1)",
    "TC-02: Partial Skills (P2/J2)",
    "TC-03: Loc Mismatch (P4/J4)",
    "TC-04: Open Candidate (P5/J3)",
    "TC-05: Skills Mismatch (P4/J1)",
    "TC-06: Remote Vacancy (P1/J5)",
    "TC-07: Incomplete Gate (P6)",
    "TC-08: Missing Role Gate (P7)",
    "TC-09: Missing Skills Gate (P8)"
]

plt.tight_layout()
out_path2 = os.path.join(out_dir, "fig_eval_scenarios.png")
plt.savefig(out_path2, dpi=300)
plt.close()
print(f"Generated: {out_path2}")

# ==============================================================================
# FIGURE 3: PROFILE STRENGTH PROGRESSION ACROSS MILESTONES
# ==============================================================================
strength = eval_data["profileStrengthTiers"]
tier_labels = [s["tier"].split(":")[0] + "\n(" + s["milestone"] + ")" for s in strength]
identity_pts = [s["breakdown"]["name"] + s["breakdown"]["email"] + s["breakdown"]["phone"] + s["breakdown"]["location"] for s in strength]
prof_pts = [s["breakdown"]["headline"] + s["breakdown"]["preferredRole"] + s["breakdown"]["bio"] for s in strength]
tech_pts = [s["breakdown"]["skills"] + s["breakdown"]["projects"] + s["breakdown"]["resumeUrl"] for s in strength]
hist_pts = [s["breakdown"]["education"] + s["breakdown"]["experience"] for s in strength]
tot_pts = [s["score"] for s in strength]

fig, ax = plt.subplots(figsize=(9, 4.8), dpi=300)

x = np.arange(len(tier_labels))
width = 0.52

b1 = ax.bar(x, identity_pts, width, label='Identity & Contact (Max 20)', color='#3B82F6', edgecolor='#1D4ED8')
b2 = ax.bar(x, prof_pts, width, bottom=identity_pts, label='Professional Positioning (Max 20)', color='#8B5CF6', edgecolor='#6D28D9')
bot3 = np.array(identity_pts) + np.array(prof_pts)
b3 = ax.bar(x, tech_pts, width, bottom=bot3, label='Technical Profile (Max 35)', color='#EC4899', edgecolor='#BE185D')
bot4 = bot3 + np.array(tech_pts)
b4 = ax.bar(x, hist_pts, width, bottom=bot4, label='Career History (Max 25)', color='#10B981', edgecolor='#047857')

for i, tot in enumerate(tot_pts):
    ax.text(i, tot + 2.5, f"{tot} / 100", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#0F172A')

ax.set_ylabel('Earned Profile Strength Points', fontsize=11, fontweight='bold', labelpad=8)
ax.set_xlabel('Candidate Profile Completeness Progression Milestone Tiers', fontsize=11, fontweight='bold', labelpad=8)
ax.set_title('Profile Strength Progression Across Developmental Milestone Tiers', fontsize=12, fontweight='bold', pad=14, color='#0F172A')
ax.set_xticks(x)
ax.set_xticklabels(tier_labels, fontsize=9.5, fontweight='bold')
ax.set_ylim(0, 115)
ax.grid(axis='y', linestyle='--', alpha=0.5, color='#CBD5E1')
ax.legend(loc='upper left', frameon=True, facecolor='#FFFFFF', framealpha=0.95, edgecolor='#CBD5E1', fontsize=9)

plt.tight_layout()
out_path3 = os.path.join(out_dir, "fig_profile_progression.png")
plt.savefig(out_path3, dpi=300)
plt.close()
print(f"Generated: {out_path3}")

print("All scientific evaluation figures successfully generated in docs/figures/.")
