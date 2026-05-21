#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para converter Markdown para PDF
Cria um PDF profissional com CSS customizado
"""

import os
import markdown2
from weasyprint import HTML, CSS
from io import BytesIO

# Caminho dos arquivos
input_md = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_COMPLETO.md"
output_pdf = r"c:\Projeto PROMETHEU\imovel-pro\ESTUDO_IMOVEL_PRO.pdf"

# CSS customizado para o PDF
css_style = """
<style>
    * {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
    }

    body {
        margin: 2cm;
        line-height: 1.6;
        font-size: 11pt;
        background-color: white;
    }

    h1 {
        font-size: 28pt;
        color: #0066cc;
        margin-top: 0;
        margin-bottom: 0.5cm;
        padding-bottom: 0.3cm;
        border-bottom: 3px solid #0066cc;
        page-break-after: avoid;
    }

    h2 {
        font-size: 20pt;
        color: #0052a3;
        margin-top: 1.5cm;
        margin-bottom: 0.5cm;
        page-break-after: avoid;
    }

    h3 {
        font-size: 14pt;
        color: #0066cc;
        margin-top: 1cm;
        margin-bottom: 0.3cm;
        page-break-after: avoid;
    }

    h4, h5, h6 {
        font-size: 12pt;
        color: #0052a3;
        margin-top: 0.8cm;
        margin-bottom: 0.3cm;
        page-break-after: avoid;
    }

    p {
        margin: 0.3cm 0;
        text-align: justify;
    }

    strong {
        color: #0052a3;
        font-weight: bold;
    }

    em {
        font-style: italic;
        color: #666;
    }

    a {
        color: #0066cc;
        text-decoration: none;
        border-bottom: 1px dotted #0066cc;
    }

    code {
        background-color: #f5f5f5;
        color: #d63384;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 10pt;
    }

    pre {
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1cm;
        overflow-x: auto;
        margin: 0.5cm 0;
        page-break-inside: avoid;
    }

    pre code {
        background-color: transparent;
        color: #333;
        padding: 0;
        border-radius: 0;
    }

    blockquote {
        border-left: 4px solid #0066cc;
        margin-left: 0;
        padding-left: 1cm;
        color: #666;
        font-style: italic;
    }

    ul, ol {
        margin: 0.5cm 0;
        padding-left: 1.5cm;
    }

    li {
        margin: 0.2cm 0;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        margin: 1cm 0;
        page-break-inside: avoid;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 0.3cm;
        text-align: left;
    }

    th {
        background-color: #e6f2ff;
        color: #0052a3;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .table-wrap {
        overflow-x: auto;
        page-break-inside: avoid;
    }

    hr {
        border: none;
        border-top: 2px solid #0066cc;
        margin: 1.5cm 0;
        page-break-after: avoid;
    }

    /* Classe para cabeçalho de seção */
    .section-header {
        background-color: #e6f2ff;
        padding: 0.5cm;
        margin: 1.5cm 0 1cm 0;
        border-left: 5px solid #0066cc;
        page-break-after: avoid;
    }

    /* Paginação */
    @page {
        size: A4;
        margin: 2cm;
        
        @bottom-center {
            content: "Página " counter(page) " de " counter(pages);
            font-size: 10pt;
            color: #999;
        }

        @top-left {
            content: "ImóvelPro - Documentação de Estudos";
            font-size: 9pt;
            color: #999;
        }
    }

    @page :first {
        @bottom-center {
            content: "";
        }
        @top-left {
            content: "";
        }
    }

    /* Quebra de página para seções principais */
    h1 {
        page-break-before: always;
    }

    h1:first-child {
        page-break-before: avoid;
    }

    /* Espaçamento para melhor legibilidade */
    .highlight {
        background-color: #fffacd;
        padding: 2px 4px;
    }

    /* Links em código */
    code a {
        border-bottom: none;
    }

    /* Listas de tarefas */
    input[type="checkbox"] {
        margin-right: 0.3cm;
    }
</style>
"""

def md_to_pdf(input_file, output_file):
    """Converte arquivo Markdown para PDF"""
    try:
        print(f"📖 Lendo arquivo: {input_file}")
        
        # Ler arquivo markdown
        with open(input_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        print("✅ Arquivo lido com sucesso")
        print("🔄 Convertendo Markdown para HTML...")
        
        # Converter markdown para HTML
        html_content = markdown2.markdown(md_content, extras=['tables', 'fenced-code-blocks'])
        
        # Adicionar CSS e HTML5 doctype
        full_html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ImóvelPro - Documentação de Estudos</title>
    {css_style}
</head>
<body>
{html_content}
</body>
</html>"""
        
        print("✅ HTML gerado com sucesso")
        print("🖨️  Gerando PDF...")
        
        # Gerar PDF
        HTML(string=full_html).write_pdf(output_file)
        
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
    print("🚀 CONVERSOR MARKDOWN → PDF")
    print("=" * 60)
    print()
    
    md_to_pdf(input_md, output_pdf)
    
    print()
    print("=" * 60)
    print("✨ Processo concluído!")
    print("=" * 60)
