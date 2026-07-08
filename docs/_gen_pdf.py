import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, black, white, grey
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    HRFlowable
)
from reportlab.pdfgen import canvas

OUTPUT = os.path.join(os.path.dirname(__file__), "Juare-Tires-Proyecto-Brief.pdf")

RED = HexColor("#e63946")
DARK = HexColor("#1a1a1a")
GREY_BG = HexColor("#f5f5f5")
GREY_LINE = HexColor("#cccccc")
LIGHT_RED = HexColor("#fde8ea")

W, H = letter

styles = getSampleStyleSheet()

s_title = ParagraphStyle("CoverTitle", parent=styles["Title"], fontSize=36,
                          leading=42, textColor=DARK, alignment=TA_CENTER,
                          spaceAfter=6, fontName="Helvetica-Bold")

s_subtitle = ParagraphStyle("CoverSub", parent=styles["Normal"], fontSize=14,
                             leading=18, textColor=HexColor("#555555"),
                             alignment=TA_CENTER, spaceAfter=4)

s_cover_agency = ParagraphStyle("CoverAgency", parent=styles["Normal"],
                                 fontSize=11, leading=14,
                                 textColor=HexColor("#888888"),
                                 alignment=TA_CENTER)

s_h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=20,
                        leading=24, textColor=RED, spaceAfter=12,
                        spaceBefore=6, fontName="Helvetica-Bold")

s_h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=14,
                        leading=18, textColor=DARK, spaceAfter=8,
                        spaceBefore=14, fontName="Helvetica-Bold")

s_body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10,
                          leading=14, textColor=DARK, alignment=TA_JUSTIFY)

s_small = ParagraphStyle("Small", parent=styles["Normal"], fontSize=8,
                           leading=10, textColor=HexColor("#888888"))

s_field_label = ParagraphStyle("FieldLabel", parent=styles["Normal"],
                                fontSize=9, leading=12, textColor=DARK,
                                fontName="Helvetica-Bold")

s_field_value = ParagraphStyle("FieldValue", parent=styles["Normal"],
                                fontSize=9, leading=12, textColor=HexColor("#666666"))

s_faq_q = ParagraphStyle("FaqQ", parent=styles["Normal"], fontSize=10,
                           leading=14, textColor=DARK, fontName="Helvetica-Bold",
                           spaceBefore=10, spaceAfter=2)

s_faq_a = ParagraphStyle("FaqA", parent=styles["Normal"], fontSize=9,
                           leading=13, textColor=HexColor("#444444"),
                           leftIndent=12, spaceAfter=6, alignment=TA_JUSTIFY)

s_conf = ParagraphStyle("Conf", parent=styles["Normal"], fontSize=8,
                          leading=11, textColor=HexColor("#999999"),
                          alignment=TA_CENTER, spaceBefore=14)

s_firma = ParagraphStyle("Firma", parent=styles["Normal"], fontSize=10,
                           leading=14, textColor=DARK, alignment=TA_CENTER,
                           spaceBefore=6)

def hr():
    return HRFlowable(width="100%", thickness=0.5, color=GREY_LINE,
                      spaceBefore=8, spaceAfter=8)

def field_row(label, width_pct=100):
    data = [[Paragraph(label, s_field_label), ""]]
    col1 = 2.2 * inch
    col2 = (W - 2 * 0.75 * inch) - col1
    t = Table(data, colWidths=[col1, col2], rowHeights=[28])
    t.setStyle(TableStyle([
        ("LINEBELOW", (1, 0), (1, 0), 0.5, GREY_LINE),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t

def field_row_big(label):
    data = [
        [Paragraph(label, s_field_label)],
        [""],
        [""],
    ]
    full = W - 2 * 0.75 * inch
    t = Table(data, colWidths=[full], rowHeights=[18, 24, 24])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 1), (0, 1), 0.5, GREY_LINE),
        ("LINEBELOW", (0, 2), (0, 2), 0.5, GREY_LINE),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=letter,
        leftMargin=0.75 * inch, rightMargin=0.75 * inch,
        topMargin=0.6 * inch, bottomMargin=0.6 * inch,
    )

    story = []
    full_w = W - 1.5 * inch

    # =============================================
    # 1. CARATULA
    # =============================================
    story.append(Spacer(1, 1.8 * inch))

    # Linea decorativa superior
    story.append(HRFlowable(width="40%", thickness=3, color=RED,
                             spaceBefore=0, spaceAfter=20))

    story.append(Paragraph("JUARE TIRES", s_title))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Sitio Web + Chatbot Multicanal", s_subtitle))
    story.append(Spacer(1, 30))

    story.append(HRFlowable(width="20%", thickness=1, color=GREY_LINE,
                             spaceBefore=0, spaceAfter=20))

    story.append(Paragraph("Propuesta de Proyecto", ParagraphStyle(
        "PropType", parent=s_subtitle, fontSize=12, textColor=HexColor("#777777"))))
    story.append(Spacer(1, 40))

    cover_data = [
        ["Cliente:", "Juare Tires"],
        ["Agencia:", "Black Sheep Agencia"],
        ["Fecha:", "23 de junio de 2026"],
        ["Tipo:", "Sitio Web + Chatbot"],
    ]
    cover_t = Table(cover_data, colWidths=[1.2 * inch, 3 * inch])
    cover_t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), HexColor("#888888")),
        ("TEXTCOLOR", (1, 0), (1, -1), DARK),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(cover_t)

    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("blacksheepagentia@gmail.com", s_cover_agency))
    story.append(Paragraph("Black Sheep Agencia — Todos los derechos reservados",
                            s_cover_agency))

    story.append(PageBreak())

    # =============================================
    # 2. BRIEF / FORMULARIO
    # =============================================
    story.append(Paragraph("BRIEF DEL CLIENTE", s_h1))
    story.append(Paragraph(
        "Por favor llene la siguiente información para que podamos diseñar su sitio web "
        "y chatbot de acuerdo a sus necesidades. Puede llenar a mano o digitalmente.",
        s_body))
    story.append(Spacer(1, 8))

    # --- Datos del negocio ---
    story.append(Paragraph("1. Datos del Negocio", s_h2))
    story.append(hr())
    for label in [
        "Nombre completo del negocio:",
        "Dirección:",
        "Teléfono fijo:",
        "Celular / WhatsApp:",
        "Email de contacto:",
        "Horario de atención (L-V):",
        "Horario de atención (Sáb-Dom):",
        "Facebook (URL o nombre):",
        "Instagram (@):",
        "TikTok (@):",
        "Google Maps (URL):",
    ]:
        story.append(field_row(label))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))

    # --- Identidad de marca ---
    story.append(Paragraph("2. Identidad de Marca", s_h2))
    story.append(hr())
    story.append(field_row("¿Tiene logo? (Sí / No):"))
    story.append(Spacer(1, 2))
    story.append(field_row("Formato del logo (PNG/AI/PDF):"))
    story.append(Spacer(1, 2))
    story.append(field_row("Colores preferidos:"))
    story.append(Spacer(1, 2))
    story.append(field_row("Colores que NO quiere:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Estilo visual que le gusta (moderno, clásico, deportivo, industrial, etc.):"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Sitios web de referencia que le gusten (URLs):"))

    story.append(PageBreak())

    # --- Sobre el negocio ---
    story.append(Paragraph("3. Sobre el Negocio", s_h2))
    story.append(hr())
    story.append(field_row_big("Servicios principales que ofrece:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Marcas de llantas que maneja:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("¿Qué lo diferencia de otras llanteras?:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Público objetivo (tipo de clientes):"))
    story.append(Spacer(1, 2))
    story.append(field_row("¿Maneja llantas seminuevas? (Sí/No):"))
    story.append(Spacer(1, 2))
    story.append(field_row("¿Ofrece servicio a domicilio? (Sí/No):"))
    story.append(Spacer(1, 2))
    story.append(field_row("¿Acepta tarjeta de crédito/débito?:"))
    story.append(Spacer(1, 2))
    story.append(field_row("Rango de precios de alineación:"))
    story.append(Spacer(1, 2))
    story.append(field_row("Rango de precios de balanceo:"))

    story.append(Spacer(1, 10))

    # --- Sobre el sitio web ---
    story.append(Paragraph("4. Sobre el Sitio Web", s_h2))
    story.append(hr())
    story.append(field_row_big("¿Qué quiere transmitir con su sitio web?:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Secciones que considera importantes:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("¿Tiene fotos profesionales del negocio? (Sí/No, cuáles):"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Mensaje principal que quiere en la página de inicio:"))

    story.append(PageBreak())

    # --- Chatbot / WhatsApp ---
    story.append(Paragraph("5. Chatbot / WhatsApp", s_h2))
    story.append(hr())
    story.append(field_row("Número de WhatsApp para el chatbot:"))
    story.append(Spacer(1, 2))
    story.append(field_row("Horario de atención del chatbot:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Tono de comunicación deseado (formal, amigable, técnico, etc.):"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Preguntas frecuentes que recibe de sus clientes:"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("Información que el chatbot NUNCA debe dar (precios exactos, etc.):"))
    story.append(Spacer(1, 2))
    story.append(field_row_big("¿Quiere que el chatbot agende citas? (Sí/No):"))

    story.append(PageBreak())

    # =============================================
    # 3. FAQ PREGENERADO
    # =============================================
    story.append(Paragraph("FAQ — PREGUNTAS FRECUENTES", s_h1))
    story.append(Paragraph(
        "Las siguientes preguntas y respuestas serán utilizadas para alimentar el chatbot "
        "de inteligencia artificial. Por favor revise y ajuste las respuestas según la "
        "información real de su negocio. Tache, corrija o agregue lo que sea necesario.",
        s_body))
    story.append(Spacer(1, 10))

    faqs = [
        ("¿Qué marcas de llantas manejan?",
         "Manejamos las principales marcas del mercado como Michelin, Bridgestone, "
         "Continental, Pirelli, Goodyear, Hankook, entre otras. Consulta disponibilidad "
         "de la marca que buscas."),

        ("¿Tienen llantas seminuevas?",
         "Sí, contamos con llantas seminuevas inspeccionadas y garantizadas. Todas pasan "
         "por un control de calidad antes de ponerse a la venta."),

        ("¿Cuánto cuesta la alineación y balanceo?",
         "El precio de la alineación y balanceo varía según el tipo de vehículo. "
         "Escríbenos por WhatsApp con el modelo de tu carro para darte un precio exacto."),

        ("¿Necesito cita para llevar mi vehículo?",
         "No necesitas cita, trabajamos por orden de llegada. Simplemente ven a la "
         "llantera y te atendemos. En temporada alta te recomendamos llegar temprano."),

        ("¿Cuál es su horario de atención?",
         "Nuestro horario es de lunes a viernes de _____ a _____ y sábados de "
         "_____ a _____. Domingos: _____."),

        ("¿Hacen reparación de llantas ponchadas?",
         "Sí, reparamos llantas ponchadas siempre y cuando el daño lo permita. "
         "Si la llanta no es reparable, te ofrecemos opciones de reemplazo al momento."),

        ("¿Tienen garantía en sus productos y servicios?",
         "Sí, todas nuestras llantas nuevas cuentan con garantía de fábrica. "
         "Las seminuevas tienen garantía de _____ días/km. Nuestros servicios de "
         "alineación y balanceo incluyen garantía de satisfacción."),

        ("¿Aceptan tarjeta de crédito o débito?",
         "Sí, aceptamos efectivo, tarjeta de débito y crédito, y transferencia "
         "bancaria. (Ajustar según métodos de pago reales.)"),

        ("¿Cuánto tarda el servicio?",
         "El cambio de llantas tarda aproximadamente 30–45 minutos. La alineación "
         "y balanceo toma alrededor de 40–60 minutos, dependiendo del vehículo."),

        ("¿Cómo sé qué medida de llanta necesito?",
         "La medida de tu llanta viene grabada en el costado de la llanta actual "
         "(ejemplo: 205/55 R16). También puedes decirnos el año, marca y modelo de "
         "tu vehículo y nosotros te decimos la medida correcta."),

        ("¿Hacen servicio a domicilio?",
         "Actualmente (Sí/No) ofrecemos servicio a domicilio. "
         "(Ajustar según el servicio real del negocio.)"),

        ("¿Dónde están ubicados?",
         "Estamos ubicados en _____________________. "
         "Puedes encontrarnos en Google Maps buscando \"Juare Tires\"."),
    ]

    for i, (q, a) in enumerate(faqs, 1):
        story.append(Paragraph(f"{i}. {q}", s_faq_q))
        story.append(Paragraph(f"R: {a}", s_faq_a))

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=RED,
                             spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(
        "Nota: Las respuestas con líneas en blanco (______) deben ser completadas "
        "por el cliente. Estas respuestas alimentarán directamente al chatbot de IA.",
        ParagraphStyle("NotaFaq", parent=s_small, textColor=RED, fontSize=9)))

    story.append(PageBreak())

    # =============================================
    # 4. ACCESOS Y CONTRASEÑAS
    # =============================================
    story.append(Paragraph("ACCESOS Y CONTRASEÑAS", s_h1))
    story.append(Paragraph(
        "Complete la siguiente tabla con los accesos a sus redes sociales. "
        "Esta información es estrictamente confidencial y será utilizada "
        "únicamente para la configuración y administración de su proyecto digital.",
        s_body))
    story.append(Spacer(1, 16))

    header_style = ParagraphStyle("TH", parent=s_field_label, textColor=white, fontSize=9)
    cell_style = ParagraphStyle("TD", parent=s_field_value, fontSize=9)

    acc_data = [
        [Paragraph("Red Social", header_style),
         Paragraph("Usuario / Email", header_style),
         Paragraph("Contraseña", header_style)],
        [Paragraph("Facebook", cell_style), "", ""],
        [Paragraph("Instagram", cell_style), "", ""],
        [Paragraph("TikTok", cell_style), "", ""],
        [Paragraph("Google Business", cell_style), "", ""],
        [Paragraph("Correo del negocio", cell_style), "", ""],
        [Paragraph("Otro:", cell_style), "", ""],
    ]

    col_w = [1.8 * inch, 2.5 * inch, 2.5 * inch]
    acc_t = Table(acc_data, colWidths=col_w, rowHeights=[30] + [36] * 6)
    acc_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), RED),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, GREY_LINE),
        ("BACKGROUND", (0, 1), (-1, -1), white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GREY_BG]),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(acc_t)

    story.append(Spacer(1, 20))

    # Nota de confidencialidad
    conf_box_data = [[Paragraph(
        "<b>AVISO DE CONFIDENCIALIDAD:</b> La información contenida en esta sección "
        "es de carácter estrictamente confidencial. Black Sheep Agencia se compromete "
        "a resguardar estos datos y utilizarlos únicamente para los fines del proyecto "
        "contratado. No se compartirán con terceros bajo ninguna circunstancia.",
        ParagraphStyle("ConfBox", parent=s_body, fontSize=8, leading=11,
                        textColor=HexColor("#666666")))]]
    conf_t = Table(conf_box_data, colWidths=[full_w])
    conf_t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, GREY_LINE),
        ("BACKGROUND", (0, 0), (-1, -1), GREY_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(conf_t)

    story.append(PageBreak())

    # =============================================
    # 5. FIRMA DE RECIBIDO
    # =============================================
    story.append(Spacer(1, 0.8 * inch))
    story.append(Paragraph("FIRMA DE RECIBIDO", s_h1))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="30%", thickness=2, color=RED,
                             spaceBefore=0, spaceAfter=20))

    story.append(Paragraph(
        "Con esta firma confirmo que he recibido el presente documento, "
        "que la información proporcionada es correcta, y que autorizo a "
        "Black Sheep Agencia a utilizar los datos aquí contenidos "
        "exclusivamente para el desarrollo del proyecto acordado.",
        ParagraphStyle("FirmaText", parent=s_body, alignment=TA_JUSTIFY,
                        spaceBefore=10, spaceAfter=40)))

    firma_data = [
        [Paragraph("Nombre completo:", s_field_label), ""],
        ["", ""],
        [Paragraph("Firma:", s_field_label), ""],
        ["", ""],
        ["", ""],
        [Paragraph("Fecha:", s_field_label), ""],
        ["", ""],
    ]
    firma_t = Table(firma_data, colWidths=[1.5 * inch, 4.5 * inch],
                     rowHeights=[20, 30, 20, 50, 10, 20, 30])
    firma_t.setStyle(TableStyle([
        ("LINEBELOW", (1, 1), (1, 1), 0.5, DARK),
        ("LINEBELOW", (1, 3), (1, 3), 0.5, DARK),
        ("LINEBELOW", (1, 6), (1, 6), 0.5, DARK),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(firma_t)

    story.append(Spacer(1, 1.5 * inch))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GREY_LINE,
                             spaceBefore=0, spaceAfter=10))
    story.append(Paragraph(
        "Black Sheep Agencia — blacksheepagentia@gmail.com",
        ParagraphStyle("FooterFirma", parent=s_cover_agency, fontSize=9)))

    # Build
    doc.build(story)
    print(f"PDF generado: {OUTPUT}")


if __name__ == "__main__":
    build()
