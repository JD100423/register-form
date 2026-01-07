import { NextRequest, NextResponse } from 'next/server';
import { createListItem, findItemByField, updateListItemFields } from '@/lib/graph';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // map incoming payload to SharePoint list internal field names
    const fields = {
      Title: body.nombre || body.cedula || 'Visitante',
      Nombre: body.nombre || '',
      Cedula: body.cedula || '',
      Empresa: body.empresa || '',
      Correo: body.correo || '',
      Fecha: body.fecha || '',
      HoraEntrada: body.horaEntrada || '',
      Servicio: body.servicio || '',
      Area: body.area || '',
      FirmaDataUrl: body.firmaDataUrl || '',
    };

    const result = await createListItem(fields);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('POST /api/visitors error', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { cedula, horaSalida } = await req.json();
    if (!cedula) return NextResponse.json({ ok: false, error: 'cedula required' }, { status: 400 });

    const found = await findItemByField('Cedula', cedula);
    if (!found) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });

    // found.id is the list item id
    const itemId = found.id;
    const update = await updateListItemFields(itemId, { HoraSalida: horaSalida });
    return NextResponse.json({ ok: true, update });
  } catch (err: any) {
    console.error('PATCH /api/visitors error', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
