#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para converter Markdown para PDF usando reportlab
Versão V2.1 - Corrigida contra loops infinitos em Tabelas e Mermaid
"""

import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from datetime import datetime
import html

# Configurações
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
input_md = str(ROOT / 'docs' / 'apresentacao_projeto.md')
output_pdf = str(ROOT / 'docs' / 'pdf' / 'apresentacao_projeto.pdf')

def parse_markdown(md_content):
    """Converte markdown para uma estrutura de elementos PDF mitigando travamentos"""
    lines = md_content.split('\n')
    elements = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Pular linhas vazias
        if not line.strip():
            i += 1
            continue
        
        # Ignorar linhas de tabelas markdown (evita o loop infinito do else)
        if line.strip().startswith('|'):
            # Opcional: Extrai o texto da tabela de forma simples para não perder a info
            clean_table_line = line.replace('|', ' ').strip()
            if clean_table_line and not clean_table_line.startswith('---'):
                elements.append(('paragraph', f"<i>[Tabela] {clean_table_line}</i>"))
            i += 1
            continue

        # Título nível 1
        if line.startswith('# '):
            elements.append(('h1', line[2:].strip()))
            elements.append(('spacer', 0.3))
            i += 1
        
        # Título nível 2
        elif line.startswith('## '):
            elements.append(('h2', line[3:].strip()))
            elements.append(('spacer', 0.2))
            i += 1
        
        # Título nível 3
        elif line.startswith('### '):
            elements.append(('h3', line[4:].strip()))
            elements.append(('spacer', 0.15))
            i += 1
        
        # Separador horizontal
        elif line.startswith('---'):
            elements.append(('hr', None))
            elements.append(('spacer', 0.2))
            i += 1
        
        # Bloco de código / Mermaid
        elif line.strip().startswith('```'):
            is_mermaid = 'mermaid' in line
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            
            if is_mermaid:
                elements.append(('paragraph', "<b>[Gráfico/Diagrama Mermaid Omitido no ReportLab]</b>"))
            else:
                elements.append(('code', '\n'.join(code_lines)))
            
            elements.append(('spacer', 0.1))
            i += 1
        
        # Lista ordenada
        elif line.strip() and line.strip()[0].isdigit() and '. ' in line:
            list_items = []
            while i < len(lines) and lines[i].strip() and lines[i].strip()[0].isdigit() and '. ' in lines[i]:
                list_items.append(lines[i].strip())
                i += 1
            elements.append(('ordered_list', list_items))
            elements.append(('spacer', 0.1))
        
        # Lista não ordenada
        elif line.strip().startswith(('- ', '* ', '+ ')):
            list_items = []
            while i < len(lines) and lines[i].strip() and lines[i].strip()[0] in '-*+':
                item = lines[i].strip()[2:].strip()
                list_items.append(item)
                i += 1
            elements.append(('bullet_list', list_items))
            elements.append(('spacer', 0.1))
        
        # Parágrafo normal (Garantindo incremento seguro de i)
        else:
            para_lines = []
            while i < len(lines) and lines[i].strip() and not any(lines[i].strip().startswith(x) for x in ['#', '```', '---', '-', '*', '+', '|']):
                if not (lines[i].strip()[0].isdigit() and '. ' in lines[i]):
                    para_lines.append(lines[i])
                    i += 1
                else:
                    break
            
            if para_lines:
                text = ' '.join(para_lines)
                elements.append(('paragraph', text))
                elements.append(('spacer', 0.1))
            else:
                # Se cair em alguma exceção visual não prevista, avança de forma segura
                i += 1
    
    return elements

def format_text(text):
    """Formata texto markdown básico para tags suportadas pelo ReportLab Paragraph"""
    # Tratar alertas markdown customizados
    text = text.replace("[!TIP]", "<b>Dica:</b>")
    
    # Negrito
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    
    # Itálico
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    
    # Código inline
    text = re.sub(r'`(.*?)`', r'<font face="Courier" size="9"><b>\1</b></font>', text)
    
    return text

def md_to_pdf(input_file, output_file):
    """Converte arquivo Markdown para PDF"""
    try:
        print(f"📖 Lendo arquivo: {input_file}")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        print("✅ Arquivo lido com sucesso")
        print("🔄 Convertendo Markdown para elementos PDF...")
        
        doc = SimpleDocTemplate(
            output_file,
            pagesize=A4,
            rightMargin=1.5*cm,
            leftMargin=1.5*cm,
            topMargin=1.5*cm,
            bottomMargin=1.5*cm,
            title="ImóvelPro - Apresentação do Projeto"
        )
        
        styles = getSampleStyleSheet()
        
        style_h1 = ParagraphStyle(
            'CustomH1',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=12,
            spaceBefore=12,
        )
        
        style_h2 = ParagraphStyle(
            'CustomH2',
            parent=styles['Heading2'],
            fontSize=15,
            textColor=colors.HexColor('#0052a3'),
            spaceAfter=10,
            spaceBefore=10,
        )
        
        style_h3 = ParagraphStyle(
            'CustomH3',
            parent=styles['Heading3'],
            fontSize=12,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=8,
            spaceBefore=8,
        )
        
        style_body = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=10,
            leading=14,
            alignment=4,  # Justified
        )
        
        style_code = ParagraphStyle(
            'CustomCode',
            parent=styles['Code'],
            fontSize=8,
            fontName='Courier',
            textColor=colors.HexColor('#333333'),
            backColor=colors.HexColor('#f5f5f5'),
            borderColor=colors.HexColor('#ddd'),
            borderWidth=1,
            borderPadding=6,
        )
        
        elements = []
        
        # Capa Simples
        elements.append(Spacer(1, 2*cm))
        elements.append(Paragraph("<b>📚 APRESENTAÇÃO DO PROJETO</b><br/><font size=18>ImóvelPro</font>", style_h1))
        elements.append(Spacer(1, 0.5*cm))
        elements.append(Paragraph(f"Gerado em: {datetime.now().strftime('%d/%m/%Y')}", style_body))
        elements.append(PageBreak())
        
        # Parse do conteúdo
        parsed = parse_markdown(md_content)
        
        for elem_type, content in parsed:
            if elem_type == 'h1':
                elements.append(PageBreak())
                clean_content = format_text(html.escape(content))
                elements.append(Paragraph(f"<b>{clean_content}</b>", style_h1))
            
            elif elem_type == 'h2':
                clean_content = format_text(html.escape(content))
                elements.append(Paragraph(f"<b>{clean_content}</b>", style_h2))
            
            elif elem_type == 'h3':
                clean_content = format_text(html.escape(content))
                elements.append(Paragraph(f"<b>{clean_content}</b>", style_h3))
            
            elif elem_type == 'paragraph':
                clean_content = format_text(html.escape(content))
                elements.append(Paragraph(clean_content, style_body))
            
            elif elem_type == 'bullet_list':
                for item in content:
                    clean_item = format_text(html.escape(item))
                    elements.append(Paragraph(f"• {clean_item}", style_body))
            
            elif elem_type == 'ordered_list':
                for idx, item in enumerate(content, 1):
                    # Tratar se o item já vem com número do parse anterior
                    clean_item = format_text(html.escape(item))
                    elements.append(Paragraph(f"{clean_item}", style_body))
            
            elif elem_type == 'code':
                code_text = content.strip()
                elements.append(Paragraph(f"<font face='Courier' size='8'>{html.escape(code_text)}</font>", style_code))
            
            elif elem_type == 'spacer':
                elements.append(Spacer(1, float(content)*cm if content else 0.1*cm))
            
            elif elem_type == 'hr':
                elements.append(Paragraph("_" * 80, styles['Normal']))
        
        print("✅ Elementos processados com sucesso")
        print("🖨️  Gerando PDF...")
        doc.build(elements)
        print(f"✅ PDF gerado com sucesso: {output_file}")
        
    except Exception as e:
        print(f"❌ Erro durante conversão: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CONVERSOR MARKDOWN → PDF (ReportLab Corrigido)")
    print("=" * 60)
    print()
    md_to_pdf(input_md, output_pdf)
    print()
    print("=" * 60)