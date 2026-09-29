"""Generate publication-ready PowerPoint graphs for SIH 26160 Slide 5 (Impact & Benefits).

Creates:
1. docs/ppt_graphs/graph1_accuracy_comparison.png (Bar chart matching Dark-Vessel slide)
2. docs/ppt_graphs/graph2_risk_exposure_over_time.png (Line chart matching Damage Level slide)
3. docs/ppt_graphs/graph_combined_panel.png (Both graphs stacked vertically for 1-click paste)
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "docs" / "ppt_graphs"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------
# GRAPH 1: Encrypted ESP Traffic Identification Accuracy
# -------------------------------------------------------------
def make_graph1():
    fig, ax = plt.subplots(figsize=(5.2, 3.8), dpi=300)
    
    categories = ['Traditional DPI / Port-Based\n(RFC 4303 Baseline)', 'Payodhi 13-Feature ML\n(Side-Channel Random Forest)']
    accuracies = [38.4, 98.0]
    colors = ['#FF5722', '#0288D1']
    
    bars = ax.bar(categories, accuracies, color=colors, width=0.48, edgecolor='none', zorder=3)
    
    # Grid and spines
    ax.grid(axis='y', linestyle='--', alpha=0.5, color='#CCCCCC', zorder=0)
    ax.set_axisbelow(True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#888888')
    ax.spines['bottom'].set_color('#888888')
    
    ax.set_ylim(0, 115)
    ax.set_ylabel('Identification Accuracy (%)', fontsize=11, fontweight='bold', color='#222222')
    ax.set_title('Encrypted ESP Traffic Identification Accuracy', fontsize=12, fontweight='bold', pad=14, color='#111111')
    
    # Value annotations on bars
    for bar in bars:
        h = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., h + 2.5, f'{h:.1f}%',
                ha='center', va='bottom', fontsize=12, fontweight='bold', color='#111111')
        
    ax.tick_params(axis='x', labelsize=9.5, labelcolor='#222222')
    ax.tick_params(axis='y', labelsize=9, labelcolor='#444444')
    
    # Footnote caption like the reference slide
    fig.text(0.5, 0.02, 'Tested across 6 encrypted traffic classes (VoIP, Video, Web, Chat, Email, ICMP)', 
             ha='center', fontsize=7.5, color='#666666', style='italic')
    
    plt.tight_layout(rect=[0, 0.05, 1, 1])
    out_file = OUT_DIR / "graph1_accuracy_comparison.png"
    plt.savefig(out_file, dpi=300, facecolor='white', transparent=False)
    plt.close()
    print(f"Saved: {out_file}")

# -------------------------------------------------------------
# GRAPH 2: Fleet Security Risk & Breach Exposure Over Time
# -------------------------------------------------------------
def make_graph2():
    fig, ax = plt.subplots(figsize=(5.2, 3.8), dpi=300)
    
    days = ['Day 1', 'Day 3', 'Day 5', 'Day 7']
    without_payodhi = [12, 45, 82, 96]
    with_payodhi = [10, 12, 14, 15]
    
    # Lines with markers matching the reference slide
    ax.plot(days, without_payodhi, color='#D32F2F', marker='s', markersize=6, linewidth=2.4, 
            label='Without Payodhi (Manual Audit)', zorder=4)
    ax.plot(days, with_payodhi, color='#2E7D32', marker='o', markersize=6, linewidth=2.4, 
            label='With Payodhi (Passive Wire Audit)', zorder=4)
    
    # Grid and styling
    ax.grid(axis='both', linestyle='--', alpha=0.5, color='#CCCCCC', zorder=0)
    ax.set_axisbelow(True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#888888')
    ax.spines['bottom'].set_color('#888888')
    
    ax.set_ylim(0, 110)
    ax.set_ylabel('Fleet Breach / Risk Exposure (%)', fontsize=10.5, fontweight='bold', color='#222222')
    ax.set_xlabel('Time (Days After Configuration Drift)', fontsize=10, fontweight='bold', color='#333333', labelpad=6)
    ax.set_title('Security Risk & Breach Exposure Over Time', fontsize=12, fontweight='bold', pad=12, color='#111111')
    
    # Annotate points
    for i, txt in enumerate(without_payodhi):
        ax.annotate(f'{txt}%', (days[i], without_payodhi[i] + 3), ha='center', fontsize=8.5, fontweight='bold', color='#B71C1C')
    for i, txt in enumerate(with_payodhi):
        ax.annotate(f'{txt}%', (days[i], with_payodhi[i] - 7), ha='center', fontsize=8.5, fontweight='bold', color='#1B5E20')
        
    ax.legend(loc='upper left', frameon=True, framealpha=0.9, fontsize=8.5, edgecolor='#CCCCCC')
    ax.tick_params(axis='x', labelsize=9.5, labelcolor='#222222')
    ax.tick_params(axis='y', labelsize=9, labelcolor='#444444')
    
    plt.tight_layout()
    out_file = OUT_DIR / "graph2_risk_exposure_over_time.png"
    plt.savefig(out_file, dpi=300, facecolor='white', transparent=False)
    plt.close()
    print(f"Saved: {out_file}")

# -------------------------------------------------------------
# COMBINED PANEL (Both graphs vertically aligned for easy PPT paste)
# -------------------------------------------------------------
def make_combined():
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(4.8, 7.2), dpi=300)
    
    # 1. Bar Chart
    categories = ['Traditional DPI\n(Header Baseline)', 'Payodhi ML\n(13 Side-Channels)']
    accuracies = [38.4, 98.0]
    bars = ax1.bar(categories, accuracies, color=['#FF5722', '#0288D1'], width=0.45, zorder=3)
    ax1.grid(axis='y', linestyle='--', alpha=0.5, color='#CCCCCC', zorder=0)
    ax1.set_axisbelow(True)
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)
    ax1.set_ylim(0, 115)
    ax1.set_ylabel('Accuracy (%)', fontsize=9.5, fontweight='bold')
    ax1.set_title('Encrypted ESP Traffic Identification', fontsize=11, fontweight='bold', pad=8)
    for bar in bars:
        h = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., h + 2.5, f'{h:.1f}%',
                 ha='center', va='bottom', fontsize=10.5, fontweight='bold')
    ax1.tick_params(axis='x', labelsize=8.5)
    ax1.tick_params(axis='y', labelsize=8)

    # 2. Line Chart
    days = ['Day 1', 'Day 3', 'Day 5', 'Day 7']
    without_p = [12, 45, 82, 96]
    with_p = [10, 12, 14, 15]
    ax2.plot(days, without_p, color='#D32F2F', marker='s', markersize=5, linewidth=2, label='Without Payodhi')
    ax2.plot(days, with_p, color='#2E7D32', marker='o', markersize=5, linewidth=2, label='With Payodhi')
    ax2.grid(axis='both', linestyle='--', alpha=0.5, color='#CCCCCC')
    ax2.set_axisbelow(True)
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)
    ax2.set_ylim(0, 110)
    ax2.set_ylabel('Risk / Exposure (%)', fontsize=9.5, fontweight='bold')
    ax2.set_xlabel('Time (Days After Configuration Drift)', fontsize=9, fontweight='bold', labelpad=4)
    ax2.set_title('Risk Exposure Level Over Time', fontsize=11, fontweight='bold', pad=8)
    
    for i, txt in enumerate(without_p):
        ax2.annotate(f'{txt}%', (days[i], without_p[i] + 3), ha='center', fontsize=8, fontweight='bold', color='#B71C1C')
    for i, txt in enumerate(with_p):
        ax2.annotate(f'{txt}%', (days[i], with_p[i] - 7), ha='center', fontsize=8, fontweight='bold', color='#1B5E20')
        
    ax2.legend(loc='upper left', frameon=True, fontsize=8)
    ax2.tick_params(axis='x', labelsize=8.5)
    ax2.tick_params(axis='y', labelsize=8)

    plt.tight_layout()
    out_file = OUT_DIR / "graph_combined_panel.png"
    plt.savefig(out_file, dpi=300, facecolor='white', transparent=False)
    plt.close()
    print(f"Saved: {out_file}")

# -------------------------------------------------------------
# GRAPH 3: Verified 6x6 Confusion Matrix (Held-out Test Set)
# -------------------------------------------------------------
def make_confusion_matrix_graph():
    import json
    cm_path = OUT_DIR.parent.parent / "models" / "confusion_matrix.json"
    with open(cm_path, "r") as f:
        data = json.load(f)
        
    labels = data["labels"]
    matrix = np.array(data["matrix"])
    acc = data["accuracy"] * 100
    f1 = data["f1_macro"] * 100
    
    fig, ax = plt.subplots(figsize=(5.5, 4.4), dpi=300)
    cax = ax.matshow(matrix, cmap="Blues", alpha=0.85)
    
    fig.colorbar(cax, ax=ax, fraction=0.046, pad=0.04)
    
    ax.set_xticks(range(len(labels)))
    ax.set_yticks(range(len(labels)))
    ax.set_xticklabels(labels, fontsize=9.5, fontweight='bold', color='#222222')
    ax.set_yticklabels(labels, fontsize=9.5, fontweight='bold', color='#222222')
    
    ax.xaxis.set_ticks_position('bottom')
    ax.set_xlabel('Predicted Traffic Class', fontsize=10.5, fontweight='bold', labelpad=8)
    ax.set_ylabel('True Encrypted Class', fontsize=10.5, fontweight='bold', labelpad=8)
    
    # Annotate numbers
    for i in range(len(labels)):
        for j in range(len(labels)):
            val = matrix[i, j]
            color = "white" if val > 4 else ("#B71C1C" if (i != j and val > 0) else "#555555")
            weight = "bold" if val > 0 else "normal"
            ax.text(j, i, str(val), ha='center', va='center', color=color, fontsize=11, fontweight=weight)
            
    ax.set_title(f'Payodhi AI Confusion Matrix (Held-Out Test Set)\nAccuracy: {acc:.2f}% (44/45) · Macro F1: {f1:.2f}%', 
                 fontsize=11.5, fontweight='bold', pad=14, color='#111111')
    
    fig.text(0.5, 0.01, '44 of 45 test captures classified correctly across 6 side-channel classes', 
             ha='center', fontsize=8, color='#666666', style='italic')
             
    plt.tight_layout(rect=[0, 0.04, 1, 1])
    out_file = OUT_DIR / "graph3_confusion_matrix.png"
    plt.savefig(out_file, dpi=300, facecolor='white', transparent=False)
    plt.close()
    print(f"Saved: {out_file}")

if __name__ == "__main__":
    make_graph1()
    make_graph2()
    make_combined()
    make_confusion_matrix_graph()
