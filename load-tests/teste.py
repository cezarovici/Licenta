import re
import matplotlib.pyplot as plt
import numpy as np

# --- DATELE DE INTRARE ---

# 1. Copiază aici sumarul text de la finalul rulării k6
k6_output_text = """
2025-07-08 22:44:54      checks_total.......................: 41128   42.835119/s
2025-07-08 22:44:54      checks_succeeded...................: 100.00% 41128 out of 41128
2025-07-08 22:44:54      checks_failed......................: 0.00%   0 out of 41128
2025-07-08 22:44:54  
2025-07-08 22:44:54      ✓ status 200
2025-07-08 22:44:54      ✓ returnează token
2025-07-08 22:44:54  
2025-07-08 22:44:54      HTTP
2025-07-08 22:44:54      http_req_duration.......................................................: avg=8.37s min=427.5ms  med=9.18s max=29.49s p(90)=13.81s p(95)=13.87s
2025-07-08 22:44:54        { expected_response:true }............................................: avg=8.37s min=427.5ms  med=9.18s max=29.49s p(90)=13.81s p(95)=13.87s
2025-07-08 22:44:54      http_req_failed.........................................................: 0.00%  0 out of 20564
2025-07-08 22:44:54      http_reqs...............................................................: 20564  21.41756/s
"""

stress_test_stages = [
    { "duration": "2m", "target": 100 },
    { "duration": "3m", "target": 100 },
    { "duration": "2m", "target": 200 },
    { "duration": "3m", "target": 200 },
    { "duration": "2m", "target": 300 },
    { "duration": "3m", "target": 300 },
    { "duration": "1m", "target": 0 },
]


def generate_performance_chart(k6_output):
    """Generează diagrama cu timpii de răspuns."""
    print("Generez diagrama de performanță...")
    
    def convert_to_ms(time_str):
        time_str = time_str.strip()
        if 'ms' in time_str:
            return float(time_str.replace('ms', ''))
        elif 's' in time_str:
            return float(time_str.replace('s', '')) * 1000
        return 0

    match = re.search(r"http_req_duration\.*:\s*avg=([\d\.]+\w+)\s*min=([\d\.]+\w+)\s*med=([\d\.]+\w+)\s*max=([\d\.]+\w+)\s*p\(90\)=([\d\.]+\w+)\s*p\(95\)=([\d\.]+\w+)", k6_output)

    if not match:
        print("Eroare: Nu am putut găsi linia 'http_req_duration' în output.")
        return

    metrics = {
        'Average (avg)': convert_to_ms(match.group(1)),
        'Median (med)': convert_to_ms(match.group(3)),
        '90th Percentile (p90)': convert_to_ms(match.group(5)),
        '95th Percentile (p95)': convert_to_ms(match.group(6)),
        'Maximum (max)': convert_to_ms(match.group(4))
    }
    
    labels = list(metrics.keys())
    values = list(metrics.values())

    plt.style.use('seaborn-v0_8-darkgrid')
    fig, ax = plt.subplots(figsize=(12, 7))
    bars = ax.bar(labels, values, color=['#4E79A7', '#59A14F', '#F28E2B', '#E15759', '#B07AA1'])
    ax.set_ylabel('Timp de răspuns (ms)', fontsize=14)
    ax.set_title('Sumar Performanță Cereri HTTP', fontsize=16, fontweight='bold')
    ax.tick_params(axis='x', rotation=25, labelsize=12)

    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 150, f'{yval:,.0f} ms', ha='center', va='bottom')

    plt.tight_layout()
    file_name = "performance_summary.png"
    plt.savefig(file_name)
    print(f"-> Diagrama salvată ca: {file_name}\n")


def generate_load_profile_chart(stages):
    """Generează diagrama cu profilul de încărcare."""
    print("Generez diagrama profilului de încărcare...")
    time_points = [0]
    vu_points = [0]
    current_time = 0

    for stage in stages:
        duration_seconds = int(stage["duration"].replace("m", "")) * 60 if "m" in stage["duration"] else int(stage["duration"].replace("s", ""))
        current_time += duration_seconds
        time_points.append(current_time)
        vu_points.append(stage["target"])
    
    plt.style.use('seaborn-v0_8-darkgrid')
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(time_points, vu_points, marker='o', linestyle='-', color='#007ACC')
    ax.set_title('Stress Test', fontsize=16, fontweight='bold')
    ax.set_xlabel('Timpul scurs (secunde)', fontsize=12)
    ax.set_ylabel('Număr de Utilizatori Virtuali (VUs)', fontsize=12)
    ax.fill_between(time_points, vu_points, color='#007ACC', alpha=0.1)
    ax.grid(True, which='both', linestyle='--', linewidth=0.5)

    plt.tight_layout()
    file_name = "load_profile.png"
    plt.savefig(file_name)
    print(f"-> Diagrama salvată ca: {file_name}\n")


if __name__ == "__main__":
    generate_performance_chart(k6_output_text)
    generate_load_profile_chart(stress_test_stages)
    print("Toate diagramele au fost generate cu succes.")