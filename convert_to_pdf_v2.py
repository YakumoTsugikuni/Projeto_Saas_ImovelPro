#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para converter Markdown para PDF usando reportlab
Cria um PDF profissional e bem formatado
"""

import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from datetime import datetime
import html

# Configurações
input_md = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_COMPLETO.md"
output_pdf = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_IMOVEL_PRO.pdf"

def parse_markdown(md_content):
    """Converte markdown para uma estrutura de elementos PDF"""
    lines = md_content.split('\n')
    elements = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Pular linhas vazias (exceto no início)
        if not line.strip():
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
        
        # Bloco de código
        elif line.strip().startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            elements.append(('code', '\n'.join(code_lines)))
            elements.append(('spacer', 0.1))
            i += 1
        
        # Lista ordenada
        elif line.strip() and line[0].isdigit() and '. ' in line:
            list_items = []
            while i < len(lines) and lines[i].strip() and lines[i][0].isdigit() and '. ' in lines[i]:
                item = lines[i].strip()
                list_items.append(item)
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
        
        # Parágrafo normal
        else:
            para_lines = []
            while i < len(lines) and lines[i].strip() and not any(lines[i].startswith(x) for x in ['#', '```', '---', '-', '*', '+']):
                if not (lines[i][0].isdigit() and '. ' in lines[i]):
                    para_lines.append(lines[i])
                    i += 1
                else:
                    break
            
            if para_lines:
                text = ' '.join(para_lines)
                elements.append(('paragraph', text))
                elements.append(('spacer', 0.1))
    
    return elements

def format_text(text):
    """Formata texto markdown para HTML"""
    # Remover emojis
    text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text)
    
    # Negrito
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'__(.*?)__', r'<b>\1</b>', text)
    
    # Itálico
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    text = re.sub(r'_(.*?)_', r'<i>\1</i>', text)
    
    # Código inline
    text = re.sub(r'`(.*?)`', r'<font face="Courier" size="9"><b>\1</b></font>', text)
    
    # Links
    text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" color="blue"><u>\1</u></a>', text)
    
    return text

def md_to_pdf(input_file, output_file):
    """Converte arquivo Markdown para PDF"""
    try:
        print(f"📖 Lendo arquivo: {input_file}")
        
        # Ler arquivo markdown
        with open(input_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        print("✅ Arquivo lido com sucesso")
        print("🔄 Convertendo Markdown para elementos PDF...")
        
        # Configurar PDF
        doc = SimpleDocTemplate(
            output_file,
            pagesize=A4,
            rightMargin=1.5*cm,
            leftMargin=1.5*cm,
            topMargin=1.5*cm,
            bottomMargin=1.5*cm,
            title="ImóvelPro - Documentação de Estudos"
        )
        
        # Estilos customizados
        styles = getSampleStyleSheet()
        
        # Estilos personalizados
        style_h1 = ParagraphStyle(
            'CustomH1',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0066cc'),
            spaceAfter=12,
            spaceBefore=12,
            borderColor=colors.HexColor('#0066cc'),
            borderWidth=2,
            borderPadding=6,
            borderRadius=3,
        )
        
        style_h2 = ParagraphStyle(
            'CustomH2',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#0052a3'),
            spaceAfter=10,
            spaceBefore=10,
        )
        
        style_h3 = ParagraphStyle(
            'CustomH3',
            parent=styles['Heading3'],
            fontSize=13,
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
        
        # Capa do documento
        elements = []
        
        # Adicionar capa
        elements.append(Spacer(1, 2*cm))
        title = Paragraph("<b>📚 DOCUMENTAÇÃO DE ESTUDOS</b><br/><font size=18>ImóvelPro</font>", style_h1)
        elements.append(title)
        elements.append(Spacer(1, 1*cm))
        
        subtitle = Paragraph(
            "<font size=11>Guia Completo sobre Tecnologias, Arquitetura, APIs e Desenvolvimento<br/>"
            f"Atualizado em: {datetime.now().strftime('%d de %B de %Y')}</font>",
            style_body
        )
        elements.append(subtitle)
        elements.append(Spacer(1, 2*cm))
        
        # Sumário
        elements.append(PageBreak())
        elements.append(Paragraph("<b>📋 SUMÁRIO</b>", style_h2))
        elements.append(Spacer(1, 0.3*cm))
        
        sumario_items = [
            "1. Visão Geral do Projeto",
            "2. Stack Tecnológico Completo",
            "3. Arquitetura do Projeto",
            "4. Banco de Dados",
            "5. APIs e Endpoints",
            "6. Componentes React",
            "7. Hooks Customizados",
            "8. Autenticação e Segurança",
            "9. Padrões de Código",
            "10. Fluxos de Trabalho",
            "11. Deployment e Produção",
            "12. Guia de Desenvolvimento",
        ]
        
        for item in sumario_items:
            p = Paragraph(f"• {item}", styles['Normal'])
            elements.append(p)
        
        elements.append(Spacer(1, 0.5*cm))
        
        # Parse markdown
        parsed = parse_markdown(md_content)
        
        # Adicionar elementos parseados
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
                try:
                    elements.append(Paragraph(clean_content, style_body))
                except:
                    elements.append(Paragraph(content[:100], style_body))
            
            elif elem_type == 'bullet_list':
                for item in content:
                    clean_item = format_text(html.escape(item))
                    try:
                        elements.append(Paragraph(f"• {clean_item}", style_body))
                    except:
                        elements.append(Paragraph(f"• {item[:80]}", style_body))
            
            elif elem_type == 'ordered_list':
                for idx, item in enumerate(content, 1):
                    clean_item = format_text(html.escape(item))
                    try:
                        elements.append(Paragraph(f"{idx}. {clean_item}", style_body))
                    except:
                        elements.append(Paragraph(f"{idx}. {item[:80]}", style_body))
            
            elif elem_type == 'code':
                code_text = content.strip()[:500]  # Limitar tamanho
                elements.append(Paragraph(f"<font face='Courier' size='8'>{html.escape(code_text)}</font>", style_code))
            
            elif elem_type == 'spacer':
                elements.append(Spacer(1, float(content)*cm if content else 0.1*cm))
            
            elif elem_type == 'hr':
                elements.append(Paragraph("_" * 80, styles['Normal']))
        
        # Gerar PDF
        print("✅ Elementos processados com sucesso")
        print("🖨️  Gerando PDF...")
        
        doc.build(elements)
        
        print(f"✅ PDF gerado com sucesso: {output_file}")
        
        # Verificar tamanho
        if os.path.exists(output_file):
            size_mb = os.path.getsize(output_file) / (1024 * 1024)
            print(f"📊 Tamanho do arquivo: {size_mb:.2f} MB")
        
    except Exception as e:
        print(f"❌ Erro durante conversão: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CONVERSOR MARKDOWN → PDF (ReportLab)")
    print("=" * 60)
    print()
    
    md_to_pdf(input_md, output_pdf)
    
    print()
    print("=" * 60)
    print("✨ Processo concluído!")
    print("=" * 60)
