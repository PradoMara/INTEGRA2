import React, { useEffect, useState } from 'react'
import SelectCampus from '../onboarding/Onboarding.UI/SelectCampus'
import SelectCarrera from '../onboarding/Onboarding.UI/SelectCarrera'
import { campuses as mockCampuses, carreras as mockCarreras } from '../onboarding/Onboarding.Utils/mocks'

export default function EditProfile() {
  // Datos de ejemplo (simularían venir del hook useMe())
  const existing = { id: 'u-0', name: 'Juan Pérez', email: 'juan.perez@uct.cl', campusId: 'c1', carreraId: 'r2' }

  const [name, setName] = useState(existing.name)
  const [email, setEmail] = useState(existing.email)

  const [campuses, setCampuses] = useState<Array<{ id: string; name: string }>>([])
  const [carreras, setCarreras] = useState<Array<{ id: string; name: string; campusId: string }>>([])
  const [campusId, setCampusId] = useState<string | null>(null)
  const [carreraId, setCarreraId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCampuses(mockCampuses)
    // pre-llenar con valores existentes
    setCampusId(existing.campusId)
    setCarreraId(existing.carreraId)
  }, [])

  useEffect(() => {
    if (!campusId) return setCarreras([])
    setCarreras(mockCarreras.filter((c) => c.campusId === campusId))
  }, [campusId])

  function handleSave(e?: React.FormEvent) {
    e?.preventDefault()
    setSaving(true)
    setSaved(false)
    // Simular llamada al backend
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      console.log('Perfil guardado', { name, email, campusId, carreraId })
    }, 600)
  }

  const selectedCampusName = campuses.find((c) => c.id === campusId)?.name
  const selectedCarreraName = mockCarreras.find((c) => c.id === carreraId)?.name

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar + resumen */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">JP</div>
            <div className="text-center md:text-left">
              <h2 className="text-lg font-bold">{name}</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
            <div className="mt-2 flex flex-col gap-2 w-full">
              {selectedCampusName && <span className="inline-block px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">{selectedCampusName}</span>}
              {selectedCarreraName && <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">{selectedCarreraName}</span>}
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-semibold mb-4">Editar perfil</h1>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectCampus value={campusId} onChange={setCampusId} options={campuses} />
                <SelectCarrera value={carreraId} onChange={setCarreraId} options={carreras.map(c => ({ id: c.id, name: c.name }))} disabled={!campusId} />
              </div>

              <div className="flex items-center gap-3 justify-end mt-2">
                <button type="button" onClick={() => { setName(existing.name); setEmail(existing.email); setCampusId(existing.campusId); setCarreraId(existing.carreraId); setSaved(false) }} className="px-4 py-2 border rounded text-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded text-sm shadow">
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>

              {saved && <p className="text-sm text-emerald-700">Perfil guardado correctamente.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
