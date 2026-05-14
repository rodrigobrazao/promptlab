"""
Extintor de incêndio realista (referência: extintor vermelho com base preta).
Peças separadas, materiais PBR. Cola no Script Editor do Blender e corre.
Renderiza em Cycles.
"""

import bpy
import bmesh
from math import radians

# ---------- limpar cena ----------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for block in (bpy.data.meshes, bpy.data.materials, bpy.data.curves, bpy.data.lights, bpy.data.cameras):
    for b in list(block):
        block.remove(b)

# ---------- helpers ----------
def mat(name, color, metallic=0.0, roughness=0.5, clearcoat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    # Clearcoat para verniz do corpo vermelho
    for key in ("Coat Weight", "Clearcoat", "Clearcoat Weight"):
        if key in b.inputs:
            b.inputs[key].default_value = clearcoat
            break
    return m

def smooth(o):
    for p in o.data.polygons: p.use_smooth = True

def assign(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)

def apply_bevel(o, width=0.005, segments=3):
    md = o.modifiers.new("Bevel", 'BEVEL')
    md.width = width; md.segments = segments; md.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier="Bevel")

# ---------- materiais ----------
M_RED      = mat("Body_Red_Gloss",  (0.50, 0.02, 0.02), metallic=0.1, roughness=0.18, clearcoat=1.0)
M_BLACK    = mat("Black_Plastic",   (0.015, 0.015, 0.015), metallic=0.0, roughness=0.45)
M_LEVER    = mat("Lever_Plastic",   (0.02, 0.02, 0.02), metallic=0.2, roughness=0.35)
M_STEEL    = mat("Brushed_Steel",   (0.72, 0.72, 0.75), metallic=1.0, roughness=0.32)
M_CHROME   = mat("Chrome",          (0.85, 0.85, 0.88), metallic=1.0, roughness=0.12)
M_RUBBER   = mat("Rubber_Hose",     (0.018, 0.018, 0.018), metallic=0.0, roughness=0.75)
M_GAUGE    = mat("Gauge_Face",      (0.93, 0.93, 0.93), metallic=0.0, roughness=0.4)
M_LABEL    = mat("Label_White",     (0.95, 0.95, 0.95), metallic=0.0, roughness=0.55)

# ============================================================
# 1. CORPO (cilindro vermelho com topo arredondado tipo dome)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.11, depth=0.46, location=(0,0,0.30))
body = bpy.context.object
body.name = "01_Body"

me = body.data
bm = bmesh.new(); bm.from_mesh(me)
top_verts = [v for v in bm.verts if v.co.z > 0.22]
bot_verts = [v for v in bm.verts if v.co.z < -0.22]
bmesh.ops.bevel(bm, geom=top_verts, offset=0.07, segments=12, profile=0.6, affect='VERTICES')
bmesh.ops.bevel(bm, geom=bot_verts, offset=0.015, segments=4, profile=0.7, affect='VERTICES')
bm.to_mesh(me); bm.free()
smooth(body); assign(body, M_RED)

# ============================================================
# 2. BASE PRETA (anel de borracha/plástico na parte de baixo)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.1115, depth=0.085, location=(0,0,0.0425))
base = bpy.context.object
base.name = "02_Black_Base"
# arredondar bordo inferior
me = base.data; bm = bmesh.new(); bm.from_mesh(me)
bot = [v for v in bm.verts if v.co.z < -0.03]
bmesh.ops.bevel(bm, geom=bot, offset=0.012, segments=5, profile=0.7, affect='VERTICES')
bm.to_mesh(me); bm.free()
smooth(base); assign(base, M_BLACK)

# ============================================================
# 3. ETIQUETA branca (envolve corpo)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=0.1108, depth=0.22, location=(0,0,0.27))
label = bpy.context.object
label.name = "03_Label"
smooth(label); assign(label, M_LABEL)

# ============================================================
# 4. GOLA / NECK (entre corpo e válvula)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.038, depth=0.025, location=(0,0,0.555))
neck = bpy.context.object
neck.name = "04_Neck"
smooth(neck); assign(neck, M_STEEL)

# ============================================================
# 5. VÁLVULA (corpo em metal escovado)
# ============================================================
bpy.ops.mesh.primitive_cube_add(size=1, location=(0,0,0.605))
valve = bpy.context.object
valve.name = "05_Valve_Body"
valve.scale = (0.11, 0.055, 0.05)
bpy.ops.object.transform_apply(scale=True)
apply_bevel(valve, 0.008, 4)
smooth(valve); assign(valve, M_STEEL)

# ============================================================
# 6. PEGA SUPERIOR (lever preta - é apertada para descarregar)
# ============================================================
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.04, 0, 0.66))
lever = bpy.context.object
lever.name = "06_Top_Lever"
lever.scale = (0.10, 0.038, 0.018)
bpy.ops.object.transform_apply(scale=True)
# inclinar ligeiramente
lever.rotation_euler = (0, radians(8), 0)
apply_bevel(lever, 0.004, 3)
smooth(lever); assign(lever, M_LEVER)

# ============================================================
# 7. PEGA INFERIOR (carry handle preta - segura-se debaixo)
# ============================================================
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.025, 0, 0.628))
handle = bpy.context.object
handle.name = "07_Carry_Handle"
handle.scale = (0.085, 0.036, 0.014)
bpy.ops.object.transform_apply(scale=True)
apply_bevel(handle, 0.004, 3)
smooth(handle); assign(handle, M_LEVER)

# ============================================================
# 8. MANÓMETRO (gauge frontal)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.022, depth=0.022,
                                     location=(0, -0.05, 0.58),
                                     rotation=(radians(90),0,0))
gauge_case = bpy.context.object
gauge_case.name = "08_Gauge_Case"
smooth(gauge_case); assign(gauge_case, M_CHROME)

bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.019, depth=0.004,
                                     location=(0, -0.062, 0.58),
                                     rotation=(radians(90),0,0))
gauge_face = bpy.context.object
gauge_face.name = "09_Gauge_Face"
smooth(gauge_face); assign(gauge_face, M_GAUGE)

# ponteiro
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.004, -0.064, 0.582))
needle = bpy.context.object
needle.name = "10_Gauge_Needle"
needle.scale = (0.012, 0.001, 0.0015)
bpy.ops.object.transform_apply(scale=True)
needle.rotation_euler = (0, radians(25), 0)
assign(needle, M_BLACK)

# ============================================================
# 9. PINO DE SEGURANÇA (não visível na ref, mas habitual - pequeno)
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.0018, depth=0.06,
                                     location=(0.025, 0.012, 0.66),
                                     rotation=(radians(90),0,0))
pin = bpy.context.object
pin.name = "11_Safety_Pin"
smooth(pin); assign(pin, M_CHROME)

# ============================================================
# 10. MANGUEIRA (curve em S vindo da válvula até à base preta)
# ============================================================
cd = bpy.data.curves.new('Hose', type='CURVE')
cd.dimensions = '3D'
cd.bevel_depth = 0.011
cd.bevel_resolution = 8
cd.use_fill_caps = True
sp = cd.splines.new('BEZIER')
pts = [
    ( 0.045, -0.005, 0.605),  # sai da válvula
    (-0.18,   0.0,   0.55 ),  # curva para esquerda/cima
    (-0.22,   0.0,   0.30 ),  # desce pelo lado esquerdo
    (-0.17,   0.0,   0.10 ),  # curva para dentro
    (-0.07,   0.0,   0.07 ),  # encosta à base preta
]
sp.bezier_points.add(len(pts)-1)
for i,p in enumerate(pts):
    bp = sp.bezier_points[i]
    bp.co = p
    bp.handle_left_type = 'AUTO'
    bp.handle_right_type = 'AUTO'
hose = bpy.data.objects.new("12_Hose", cd)
bpy.context.collection.objects.link(hose)
assign(hose, M_RUBBER)

# ============================================================
# 11. ACOPLAMENTO da mangueira na válvula
# ============================================================
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.013, depth=0.025,
                                     location=(0.06, 0, 0.605),
                                     rotation=(0, radians(90), 0))
coup = bpy.context.object
coup.name = "13_Hose_Coupling"
smooth(coup); assign(coup, M_CHROME)

# ============================================================
# 12. BOCAL na ponta da mangueira (preto, junto à base)
# ============================================================
bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.014, radius2=0.009,
                                 depth=0.04, location=(-0.05, 0, 0.07),
                                 rotation=(0, radians(90), 0))
nozzle = bpy.context.object
nozzle.name = "14_Nozzle"
smooth(nozzle); assign(nozzle, M_BLACK)

# ============================================================
# 13. CHÃO + ILUMINAÇÃO + CÂMARA
# ============================================================
bpy.ops.mesh.primitive_plane_add(size=6, location=(0,0,0))
floor = bpy.context.object; floor.name = "Floor"
assign(floor, mat("Floor", (0.18,0.18,0.19), roughness=0.55))

bpy.ops.object.light_add(type='AREA', location=(1.8, -1.8, 2.2))
k = bpy.context.object; k.data.energy = 900; k.data.size = 2.2
bpy.ops.object.light_add(type='AREA', location=(-2.0, -1.0, 1.6))
f = bpy.context.object; f.data.energy = 280; f.data.size = 2.0
bpy.ops.object.light_add(type='AREA', location=(0, 2.5, 1.8))
r = bpy.context.object; r.data.energy = 450; r.data.size = 2.0

bpy.ops.object.camera_add(location=(1.05, -1.25, 0.65),
                           rotation=(radians(78), 0, radians(42)))
cam = bpy.context.object
bpy.context.scene.camera = cam
cam.data.lens = 60

# render
scn = bpy.context.scene
scn.render.engine = 'CYCLES'
scn.cycles.samples = 256
scn.render.resolution_x = 1200
scn.render.resolution_y = 1400
scn.view_settings.look = 'Medium High Contrast'
try:
    scn.cycles.device = 'GPU'
except Exception:
    pass

# ============================================================
# Agrupar peças
# ============================================================
coll = bpy.data.collections.new("FireExtinguisher_Parts")
bpy.context.scene.collection.children.link(coll)
parts = [body, base, label, neck, valve, lever, handle,
         gauge_case, gauge_face, needle, pin, hose, coup, nozzle]
for p in parts:
    for c in p.users_collection:
        c.objects.unlink(p)
    coll.objects.link(p)

print(f"OK - Extintor criado com {len(parts)} peças separadas na coleção 'FireExtinguisher_Parts'.")
