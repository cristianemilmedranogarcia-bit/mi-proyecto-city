import os
import glob

# Style override to insert
style_override = """
        /* Force correct header sizes and font family */
        .printing-topbar,
        .printing-header {
            font-family: "Helvetica Neue", Arial, sans-serif !important;
        }
        .printing-logo {
            font-size: 1.4rem !important;
        }
        .printing-nav {
            gap: 1.25rem !important;
        }
        .printing-nav a {
            font-size: 0.85rem !important;
            font-family: "Helvetica Neue", Arial, sans-serif !important;
        }
        .printing-nav-meta {
            gap: 1.25rem !important;
        }
        .printing-nav-meta a {
            font-size: 0.82rem !important;
            font-family: "Helvetica Neue", Arial, sans-serif !important;
        }
"""

html_files = glob.glob("*.html")
for filepath in html_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "</style>" in content:
        # Check if override is already in file to avoid duplicating
        if "Force correct header sizes and font family" not in content:
            new_content = content.replace("</style>", style_override + "    </style>", 1)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Fixed {filepath}")
        else:
            print(f"Already fixed {filepath}")
    else:
        print(f"Skipped {filepath} (no </style> found)")
