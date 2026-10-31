import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=130, bottom=130, left=180, right=180)

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
        run_title.font.size = Pt(10)
        run_title.font.color.rgb = RGBColor(109, 40, 217)

    run_text = p.add_run(text)
    run_text.font.name = "Consolas"
    run_text.font.size = Pt(8.5)
    run_text.font.color.rgb = RGBColor(51, 65, 85)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(1)
    sp.paragraph_format.space_after = Pt(4)

def add_page_number_field(run):
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
    run._r.append(fldSimple)

def add_total_pages_field(run):
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w'))
    run._r.append(fldSimple)

def add_formatted_runs(paragraph, text, base_size=10.5):
    tokens = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith("**") and token.endswith("**") and len(token) >= 4:
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.name = "Calibri"
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor(30, 41, 59)
        elif token.startswith("*") and token.endswith("*") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.italic = True
            run.font.name = "Calibri"
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor(51, 65, 85)
        elif token.startswith("`") and token.endswith("`") and len(token) >= 2:
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Consolas"
            run.font.size = Pt(base_size - 0.5)
            run.font.color.rgb = RGBColor(190, 24, 93)
        else:
            run = paragraph.add_run(token)
            run.font.name = "Calibri"
            run.font.size = Pt(base_size)
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
            p.paragraph_format.space_before = Pt(2.5)
            p.paragraph_format.space_after = Pt(2.5)
            p.paragraph_format.line_spacing = 1.05

            if is_header:
                set_cell_background(cell, "F1F5F9")
                set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
                run = p.add_run(text)
                run.bold = True
                run.font.name = "Calibri"
                run.font.size = Pt(9.0)
                run.font.color.rgb = RGBColor(15, 23, 42)
            else:
                bg = "FFFFFF" if r_idx % 2 == 1 else "F8FAFC"
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=65, bottom=65, left=120, right=120)
                add_formatted_runs(p, text, base_size=8.5)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(1)
    sp.paragraph_format.space_after = Pt(4)

def build_research_paper_docx(md_path, docx_path):
    print(f"Reading markdown: {md_path}")
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    doc = Document()
    base_dir = os.path.dirname(os.path.abspath(md_path))
    figures_dir = os.path.join(base_dir, "figures")

    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

        # Running Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CareerVista: Explainable Job-Matching & Career Readiness Framework")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)

        # Running Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun1 = fp.add_run("Page ")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8.5)
        frun1.font.color.rgb = RGBColor(148, 163, 184)
        add_page_number_field(frun1)

        frun2 = fp.add_run(" of ")
        frun2.font.name = "Calibri"
        frun2.font.size = Pt(8.5)
        frun2.font.color.rgb = RGBColor(148, 163, 184)
        add_total_pages_field(frun2)

    lines = content.split("\n")
    i = 0
    total_lines = len(lines)

    in_author_block = False
    in_abstract_block = False
    abstract_lines = []
    keywords_text = ""

    while i < total_lines:
        line = lines[i]
        stripped = line.strip()

        # Title (# )
        if stripped.startswith("# ") and not stripped.startswith("## "):
            title_text = stripped[2:].strip()
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(14)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(title_text)
            run.font.name = "Calibri"
            run.font.size = Pt(20)
            run.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42)
            in_author_block = True
            i += 1
            continue

        # Section Heading (## )
        if stripped.startswith("## "):
            h_text = stripped[3:].strip()
            if h_text == "ABSTRACT":
                in_author_block = False
                in_abstract_block = True
                i += 1
                continue

            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(5)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(13.5)
            run.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59)
            i += 1
            continue

        # Subsection Heading (### )
        if stripped.startswith("### "):
            h_text = stripped[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(11.5)
            run.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85)
            i += 1
            continue

        # Sub-subsection (#### )
        if stripped.startswith("#### "):
            h_text = stripped[5:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(9)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(h_text)
            run.font.name = "Calibri"
            run.font.size = Pt(10.5)
            run.bold = True
            run.italic = True
            run.font.color.rgb = RGBColor(71, 85, 105)
            i += 1
            continue

        # Author Block lines
        if in_author_block:
            if stripped == "---":
                in_author_block = False
                i += 1
                continue
            if stripped:
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(1)
                p.paragraph_format.space_after = Pt(1)
                add_formatted_runs(p, stripped, base_size=10.0)
            i += 1
            continue

        # Abstract & Keywords Block
        if in_abstract_block:
            if stripped.startswith("**Keywords:**"):
                keywords_text = stripped
                # Render Abstract Box
                tbl = doc.add_table(rows=1, cols=1)
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                tbl.autofit = False
                c = tbl.cell(0, 0)
                c.width = Inches(6.5)
                set_cell_background(c, "F8FAFC")
                set_cell_margins(c, top=140, bottom=140, left=180, right=180)
                tcPr = c._tc.get_or_add_tcPr()
                borders = parse_xml(
                    f'<w:tcBorders {nsdecls("w")}>'
                    f'<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
                    f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
                    f'<w:left w:val="none"/><w:right w:val="none"/>'
                    f'</w:tcBorders>'
                )
                tcPr.append(borders)

                ap = c.paragraphs[0]
                ap.paragraph_format.space_before = Pt(0)
                ap.paragraph_format.space_after = Pt(4)
                ap.paragraph_format.line_spacing = 1.15
                arun = ap.add_run("ABSTRACT\n")
                arun.bold = True
                arun.font.name = "Calibri"
                arun.font.size = Pt(11)
                arun.font.color.rgb = RGBColor(15, 23, 42)

                abstract_full = " ".join(abstract_lines)
                add_formatted_runs(ap, abstract_full, base_size=9.5)

                kp = c.add_paragraph()
                kp.paragraph_format.space_before = Pt(5)
                kp.paragraph_format.space_after = Pt(0)
                add_formatted_runs(kp, keywords_text, base_size=9.0)

                sp = doc.add_paragraph()
                sp.paragraph_format.space_before = Pt(2)
                sp.paragraph_format.space_after = Pt(6)

                in_abstract_block = False
            else:
                if stripped:
                    abstract_lines.append(stripped)
            i += 1
            continue

        # Code Blocks (ASCII / Equations)
        if stripped.startswith("```"):
            block_lines = []
            i += 1
            while i < total_lines and not lines[i].strip().startswith("```"):
                block_lines.append(lines[i])
                i += 1
            i += 1
            block_text = "\n".join(block_lines)

            # Check if followed by figure caption
            fig_caption = ""
            if i < total_lines and lines[i].strip().startswith("*Figure"):
                fig_caption = lines[i].strip()
                i += 1

            add_callout_box(doc, block_text, title="SYSTEM SPECIFICATION / MODEL SCHEMATIC")

            # If Figure 1 caption, embed real architecture png!
            if "Figure 1:" in fig_caption:
                arch_png = os.path.join(figures_dir, "fig_architecture.png")
                if os.path.exists(arch_png):
                    doc.add_picture(arch_png, width=Inches(6.2))
                    last_p = doc.paragraphs[-1]
                    last_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run(fig_caption[1:-1] if fig_caption.startswith("*") and fig_caption.endswith("*") else fig_caption)
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)

            elif "Figure 2:" in fig_caption:
                match_png = os.path.join(figures_dir, "fig_matching_weights.png")
                if os.path.exists(match_png):
                    doc.add_picture(match_png, width=Inches(6.2))
                    last_p = doc.paragraphs[-1]
                    last_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run(fig_caption[1:-1] if fig_caption.startswith("*") and fig_caption.endswith("*") else fig_caption)
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)

            elif fig_caption:
                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run(fig_caption[1:-1] if fig_caption.startswith("*") and fig_caption.endswith("*") else fig_caption)
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)
            continue

        # Tables (| ... |)
        if stripped.startswith("|") and stripped.endswith("|"):
            tbl_lines = [stripped]
            i += 1
            while i < total_lines and lines[i].strip().startswith("|"):
                tbl_lines.append(lines[i].strip())
                i += 1
            render_markdown_table(doc, tbl_lines)
            continue

        # Standalone Figure references or captions
        if stripped.startswith("*Figure") or stripped.startswith("*Table"):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(8)
            clean_cap = stripped[1:-1] if stripped.startswith("*") and stripped.endswith("*") else stripped
            crun = p.add_run(clean_cap)
            crun.italic = True
            crun.font.name = "Calibri"
            crun.font.size = Pt(9.0)
            crun.font.color.rgb = RGBColor(100, 116, 139)
            i += 1
            continue

        # Check text mentioning Figure 4, 5, 6 to embed evaluation figures!
        if "Figure 4" in stripped and not stripped.startswith("*"):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, stripped)

            # Embed fig_eval_latency
            lat_png = os.path.join(figures_dir, "fig_eval_latency.png")
            if os.path.exists(lat_png):
                doc.add_picture(lat_png, width=Inches(6.2))
                doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run("Figure 4: CareerVista Matching Engine Computational Latency & Scalability Curve (N = 10 to 5,000 Postings).")
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)
            i += 1
            continue

        if "Figure 5" in stripped and not stripped.startswith("*"):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, stripped)

            # Embed fig_eval_scenarios
            sc_png = os.path.join(figures_dir, "fig_eval_scenarios.png")
            if os.path.exists(sc_png):
                doc.add_picture(sc_png, width=Inches(6.2))
                doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run("Figure 5: Empirical Compatibility Score Decompositions across Verification Test Suite (Scenarios TC-01 through TC-09).")
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)
            i += 1
            continue

        if "Figure 6" in stripped and not stripped.startswith("*"):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, stripped)

            # Embed fig_profile_progression
            prof_png = os.path.join(figures_dir, "fig_profile_progression.png")
            if os.path.exists(prof_png):
                doc.add_picture(prof_png, width=Inches(6.2))
                doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp = doc.add_paragraph()
                cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(8)
                crun = cp.add_run("Figure 6: Profile Strength Progression Across Developmental Milestone Tiers.")
                crun.italic = True
                crun.font.name = "Calibri"
                crun.font.size = Pt(9.0)
                crun.font.color.rgb = RGBColor(100, 116, 139)
            i += 1
            continue

        # Bullet list (- or •)
        if stripped.startswith("- ") or stripped.startswith("* "):
            bullet_text = stripped[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.12
            add_formatted_runs(p, bullet_text)
            i += 1
            continue

        # Numbered list
        num_match = re.match(r'^(\d+)\.\s+(.*)', stripped)
        if num_match:
            num = num_match.group(1)
            txt = num_match.group(2)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.25)
            p.paragraph_format.space_before = Pt(1.5)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.12
            run_num = p.add_run(f"{num}. ")
            run_num.bold = True
            run_num.font.name = "Calibri"
            run_num.font.size = Pt(10.0)
            run_num.font.color.rgb = RGBColor(30, 41, 59)
            add_formatted_runs(p, txt)
            i += 1
            continue

        # Regular Paragraph
        if stripped:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_runs(p, stripped)

        i += 1

    print(f"Saving DOCX to: {docx_path}")
    doc.save(docx_path)
    print("DOCX successfully generated.")

if __name__ == "__main__":
    src_md = r"c:\Users\sansk\OneDrive\Desktop\CareerVista\docs\CareerVista_Research_Paper.md"
    dst_docx = r"c:\Users\sansk\OneDrive\Desktop\CareerVista\docs\CareerVista_Research_Paper.docx"
    build_research_paper_docx(src_md, dst_docx)

    # Attempt PDF conversion using docx2pdf
    dst_pdf = r"c:\Users\sansk\OneDrive\Desktop\CareerVista\docs\CareerVista_Research_Paper.pdf"
    try:
        from docx2pdf import convert
        print(f"Converting DOCX to PDF: {dst_pdf}")
        convert(dst_docx, dst_pdf)
        print(f"PDF successfully generated at: {dst_pdf}")
    except Exception as e:
        print(f"PDF conversion note: {e}")
