#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script simples para converter Markdown para PDF usando FPDF2
"""

import re
from fpdf import FPDF
from datetime import datetime

input_md = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_COMPLETO.md"
output_pdf = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_IMOVEL_PRO.pdf"

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "", 9)
        self.cell(0, 10, "ImóvelPro - Documentação de Estudos", 0, 1, "C")
        self.line(10, self.y, 200, self.y)
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "", 8)
        self.cell(0, 10, f"Página {self.page_no()}", 0, 0, "C")

def md_to_pdf(input_file, output_file):
    try:
        print("📖 Lendo arquivo Markdown...")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print("✅ Arquivo lido com sucesso")
        print("🔄 Processando conteúdo...")
        
        # Criar PDF
        pdf = PDF("P", "mm", "A4")
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Configurar fontes
        pdf.add_font("Arial", "", "C:\\Windows\\Fonts\\arial.ttf")
        pdf.add_font("Arial", "B", "C:\\Windows\\Fonts\\arialbd.ttf")
        pdf.add_font("Courier", "", "C:\\Windows\\Fonts\\cour.ttf")
        
        # Processar linhas
        lines = content.split('\n')
        for line in lines:
            if not line.strip():
                pdf.ln(2)
                continue
            
            # Remover emojis
            line = re.sub(r'[\U0001F300-\U0001F9FF]', '', line)
            
            # Títulos H1
            if line.startswith('# '):
                if pdf.y > 250:  # Quebra de página se necessário
                    pdf.add_page()
                pdf.set_font("Arial", "B", 18)
                pdf.set_text_color(0, 51, 153)
                title = line[2:].strip()
                pdf.multi_cell(0, 10, title)
                pdf.set_text_color(0, 0, 0)
                pdf.ln(3)
            
            # Títulos H2
            elif line.startswith('## '):
                pdf.set_font("Arial", "B", 14)
                pdf.set_text_color(0, 51, 102)
                title = line[3:].strip()
                pdf.multi_cell(0, 8, title)
                pdf.set_text_color(0, 0, 0)
                pdf.ln(2)
            
            # Títulos H3
            elif line.startswith('### '):
                pdf.set_font("Arial", "B", 12)
                pdf.set_text_color(0, 51, 153)
                title = line[4:].strip()
                pdf.multi_cell(0, 7, title)
                pdf.set_text_color(0, 0, 0)
                pdf.ln(1)
            
            # Separador horizontal
            elif line.startswith('---'):
                pdf.line(10, pdf.y, 200, pdf.y)
                pdf.ln(3)
            
            # Listas
            elif line.strip().startswith(('- ', '* ', '+ ')):
                pdf.set_font("Arial", "", 10)
                item = line.strip()[2:].strip()
                # Limpar formatação markdown
                item = item.replace('**', '').replace('`', '').replace('*', '')
                pdf.multi_cell(0, 6, f"• {item[:100]}", ln=True)
            
            # Código
            elif line.strip().startswith('```'):
                continue
            
            # Parágrafo normal
            else:
                pdf.set_font("Arial", "", 10)
                text = line.strip()
                if len(text) > 3:
                    # Limpar markdown
                    text = text.replace('**', '').replace('`', '').replace('*', '')
                    text = text.replace('[', '').replace(']', '')
                    if len(text) > 200:
                        text = text[:200] + "..."
                    if text and text[0] not in '#-*+|':
                        pdf.multi_cell(0, 5, text, ln=True)
        
        # Salvar PDF
        pdf.output(output_file)
        print(f"✅ PDF salvo: {output_file}")
        
        import os
        size = os.path.getsize(output_file) / (1024 * 1024)
        print(f"📊 Tamanho: {size:.2f} MB")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CONVERSOR MARKDOWN → PDF (FPDF2)")
    print("=" * 60)
    md_to_pdf(input_md, output_pdf)
    print("✨ Concluído!")
