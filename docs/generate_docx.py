import re
import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Sets the background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets inner padding for a table cell in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    """Sets subtle light-gray borders on a table."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_callout_box(doc, text, title=""):
    """Creates a styled academic callout/note box."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    # Left thick purple accent border
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="7C3AED"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15

    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10.5)
        run_title.font.color.rgb = RGBColor(109, 40, 217)

    run_text = p.add_run(text)
    run_text.font.name = "Calibri"
    run_text.font.size = Pt(10)
    run_text.font.color.rgb = RGBColor(51, 65, 85)

def build_docx_from_markdown(md_path, docx_path):
    doc = Document()

    # Page setup - 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

        # Add running header & footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CareerVista — NTCC Project Technical Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Page [ Academic Technical Project Report ]")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    i = 0
    total = len(lines)

    while i < total:
        line = lines[i].rstrip("\r\n")

        # Page break tag
        if "<div style=\"page-break-after: always;\"></div>" in line:
            doc.add_page_break()
            i += 1
            continue

        # Code block handling
        if line.startswith("```"):
            if in_code_block:
                in_code_block = False
                code_text = "\n".join(code_lines)
                add_callout_box(doc, code_text, title="Technical Specification / Implementation Code")
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Table handling
        if "|" in line and not line.startswith("```"):
            # Start collecting table lines
            table_lines.append(line)
            # Peek next line to see if table continues
            if i + 1 < total and "|" in lines[i+1]:
                i += 1
                continue
            else:
                # End of table, render it
                render_markdown_table(doc, table_lines)
                table_lines = []
                i += 1
                continue

        # Headings
        if line.startswith("# "):
            text = line[2:].strip()
            h = doc.add_heading(text, level=1)
            h.alignment = WD_ALIGN_PARAGRAPH.LEFT
            format_heading(h, 16, RGBColor(30, 41, 59), True)
            i += 1
            continue
        elif line.startswith("## "):
            text = line[3:].strip()
            h = doc.add_heading(text, level=2)
            format_heading(h, 13.5, RGBColor(109, 40, 217), True)
            i += 1
            continue
        elif line.startswith("### "):
            text = line[4:].strip()
            h = doc.add_heading(text, level=3)
            format_heading(h, 12, RGBColor(51, 65, 85), True)
            i += 1
            continue
        elif line.startswith("#### "):
            text = line[5:].strip()
            h = doc.add_heading(text, level=4)
            format_heading(h, 11, RGBColor(71, 85, 105), True)
            i += 1
            continue

        # Horizontal rule
        if line.strip() in ["---", "***", "___"]:
            # Add subtle horizontal line or spacing
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            i += 1
            continue

        # Blank line
        if not line.strip():
            i += 1
            continue

        # Bullet list
        if line.strip().startswith("- ") or line.strip().startswith("* "):
            bullet_text = line.strip()[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, bullet_text)
            i += 1
            continue

        # Numbered list
        num_match = re.match(r"^(\d+)\.\s+(.*)", line.strip())
        if num_match:
            item_text = num_match.group(2)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, item_text)
            i += 1
            continue

        # Standard paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_runs(p, line)
        i += 1

    doc.save(docx_path)
    print(f"Successfully generated docx at: {docx_path}")

def format_heading(heading, size_pt, color_rgb, is_bold=True):
    heading.paragraph_format.space_before = Pt(14)
    heading.paragraph_format.space_after = Pt(6)
    heading.paragraph_format.keep_with_next = True
    for run in heading.runs:
        run.font.name = "Calibri"
        run.font.size = Pt(size_pt)
        run.bold = is_bold
        run.font.color.rgb = color_rgb

def add_formatted_runs(paragraph, text):
    """Splits markdown inline formatting (**bold**, *italic*, `code`) into runs."""
    # Pattern to match bold, italic, code
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith("**") and token.endswith("**") and len(token) >= 4:
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.name = "Calibri"
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(30, 41, 59)
        elif token.startswith("*") and token.endswith("*") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.italic = True
            run.font.name = "Calibri"
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(51, 65, 85)
        elif token.startswith("`") and token.endswith("`") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(10)
            run.font.color.rgb = RGBColor(190, 24, 93)  # Rose accent
        else:
            run = paragraph.add_run(token)
            run.font.name = "Calibri"
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(51, 65, 85)

def render_markdown_table(doc, table_lines):
    # Parse rows
    rows = []
    for l in table_lines:
        if not l.strip():
            continue
        cells = [c.strip() for c in l.strip().split("|")]
        # If line started/ended with |, drop first/last empty
        if len(cells) > 0 and cells[0] == "":
            cells = cells[1:]
        if len(cells) > 0 and cells[-1] == "":
            cells = cells[:-1]

        # Check if separator row like :--- | :---
        if all(re.match(r'^:?-+:?$', c) for c in cells if c):
            continue
        rows.append(cells)

    if not rows:
        return

    col_count = max(len(r) for r in rows)
    doc_table = doc.add_table(rows=len(rows), cols=col_count)
    doc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    doc_table.autofit = False
    set_table_borders(doc_table, color="CBD5E1", sz="4")

    for r_idx, row_data in enumerate(rows):
        is_header = (r_idx == 0)
        for c_idx in range(col_count):
            cell = doc_table.cell(r_idx, c_idx)
            text = row_data[c_idx] if c_idx < len(row_data) else ""

            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.05

            if is_header:
                set_cell_background(cell, "F1F5F9")
                set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
                run = p.add_run(text)
                run.bold = True
                run.font.name = "Calibri"
                run.font.size = Pt(10)
                run.font.color.rgb = RGBColor(15, 23, 42)
            else:
                bg = "FFFFFF" if r_idx % 2 == 1 else "F8FAFC"
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=80, bottom=80, left=140, right=140)
                add_formatted_runs(p, text)
                for r in p.runs:
                    r.font.size = Pt(9.5)

    # Spacing after table
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(2)
    sp.paragraph_format.space_after = Pt(6)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(base_dir, "CareerVista_NTCC_Project_Report.md")
    docx_file = os.path.join(base_dir, "CareerVista_NTCC_Project_Report.docx")
    build_docx_from_markdown(md_file, docx_file)
