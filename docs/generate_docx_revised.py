import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    """Sets background fill color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
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
    """Creates a styled academic callout/note box with left accent border."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

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
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15

    if title:
        run_title = p.add_run(f"{title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10)
        run_title.font.color.rgb = RGBColor(109, 40, 217)

    run_text = p.add_run(text)
    run_text.font.name = "Consolas"
    run_text.font.size = Pt(9.5)
    run_text.font.color.rgb = RGBColor(51, 65, 85)

    # Spacing after table
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(1)
    sp.paragraph_format.space_after = Pt(4)

def add_page_number_field(run):
    """Inserts a dynamic Word PAGE field."""
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
    run._r.append(fldSimple)

def add_total_pages_field(run):
    """Inserts a dynamic Word NUMPAGES field."""
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w'))
    run._r.append(fldSimple)

def format_heading(heading, size_pt, color_rgb, is_bold=True, before_pt=14, after_pt=5):
    heading.paragraph_format.space_before = Pt(before_pt)
    heading.paragraph_format.space_after = Pt(after_pt)
    heading.paragraph_format.keep_with_next = True
    for run in heading.runs:
        run.font.name = "Calibri"
        run.font.size = Pt(size_pt)
        run.bold = is_bold
        run.font.color.rgb = color_rgb

def add_formatted_runs(paragraph, text):
    """Splits markdown inline formatting (**bold**, *italic*, `code`) into runs."""
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
            run.font.color.rgb = RGBColor(190, 24, 93)
        else:
            run = paragraph.add_run(token)
            run.font.name = "Calibri"
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(51, 65, 85)

def render_markdown_table(doc, table_lines):
    rows = []
    for l in table_lines:
        if not l.strip():
            continue
        cells = [c.strip() for c in l.strip().split("|")]
        if len(cells) > 0 and cells[0] == "":
            cells = cells[1:]
        if len(cells) > 0 and cells[-1] == "":
            cells = cells[:-1]

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
                set_cell_margins(cell, top=120, bottom=120, left=130, right=130)
                run = p.add_run(text)
                run.bold = True
                run.font.name = "Calibri"
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(15, 23, 42)
            else:
                bg = "FFFFFF" if r_idx % 2 == 1 else "F8FAFC"
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=70, bottom=70, left=130, right=130)
                add_formatted_runs(p, text)
                for r in p.runs:
                    r.font.size = Pt(9.0)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(2)
    sp.paragraph_format.space_after = Pt(5)

def build_docx_from_markdown(md_path, docx_path):
    doc = Document()
    base_dir = os.path.dirname(os.path.abspath(md_path))

    # 1.0 inch margins all sides
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

        # Running Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CareerVista — NTCC Minor Project Technical Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)

        # Running Footer with Dynamic Page Numbering
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER

        frun1 = fp.add_run("Page ")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8.5)
        frun1.font.color.rgb = RGBColor(148, 163, 184)

        add_page_number_field(fp.add_run())

        frun2 = fp.add_run(" of ")
        frun2.font.name = "Calibri"
        frun2.font.size = Pt(8.5)
        frun2.font.color.rgb = RGBColor(148, 163, 184)

        add_total_pages_field(fp.add_run())

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
                add_callout_box(doc, code_text, title="Technical Code / Algorithmic Formulation")
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

        # Image tag handling: ![Caption](path/to/img.png)
        img_match = re.match(r"^!\[(.*?)\]\((.*?)\)", line.strip())
        if img_match:
            caption = img_match.group(1)
            rel_img_path = img_match.group(2)
            full_img_path = os.path.normpath(os.path.join(base_dir, rel_img_path))

            if os.path.exists(full_img_path):
                # Center image paragraph
                p_img = doc.add_paragraph()
                p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_img.paragraph_format.space_before = Pt(8)
                p_img.paragraph_format.space_after = Pt(2)
                p_img.paragraph_format.keep_with_next = True

                run_img = p_img.add_run()
                run_img.add_picture(full_img_path, width=Inches(5.8))

                # Caption below
                p_cap = doc.add_paragraph()
                p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p_cap.paragraph_format.space_before = Pt(2)
                p_cap.paragraph_format.space_after = Pt(8)
                run_cap = p_cap.add_run(caption)
                run_cap.italic = True
                run_cap.font.name = "Calibri"
                run_cap.font.size = Pt(9.5)
                run_cap.font.color.rgb = RGBColor(71, 85, 105)
            else:
                print(f"Warning: Image file not found: {full_img_path}")
            i += 1
            continue

        # Table handling
        if "|" in line and not line.startswith("```"):
            table_lines.append(line)
            if i + 1 < total and "|" in lines[i+1]:
                i += 1
                continue
            else:
                render_markdown_table(doc, table_lines)
                table_lines = []
                i += 1
                continue

        # Headings
        if line.startswith("# "):
            text = line[2:].strip()
            h = doc.add_heading(text, level=1)
            h.alignment = WD_ALIGN_PARAGRAPH.LEFT
            format_heading(h, 16, RGBColor(15, 23, 42), True, before_pt=18, after_pt=6)
            i += 1
            continue
        elif line.startswith("## "):
            text = line[3:].strip()
            h = doc.add_heading(text, level=2)
            format_heading(h, 13.5, RGBColor(109, 40, 217), True, before_pt=14, after_pt=5)
            i += 1
            continue
        elif line.startswith("### "):
            text = line[4:].strip()
            h = doc.add_heading(text, level=3)
            format_heading(h, 12, RGBColor(30, 41, 59), True, before_pt=11, after_pt=4)
            i += 1
            continue
        elif line.startswith("#### "):
            text = line[5:].strip()
            h = doc.add_heading(text, level=4)
            format_heading(h, 11, RGBColor(71, 85, 105), True, before_pt=8, after_pt=3)
            i += 1
            continue

        # Horizontal rule
        if line.strip() in ["---", "***", "___"]:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
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
    print(f"Successfully generated revised docx at: {docx_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(base_dir, "CareerVista_NTCC_Project_Report_Revised.md")
    docx_file = os.path.join(base_dir, "CareerVista_NTCC_Project_Report_Revised.docx")
    build_docx_from_markdown(md_file, docx_file)
